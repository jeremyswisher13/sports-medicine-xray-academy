import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { firebaseAuth, firebaseEnabled, firestore, googleProvider, COLLECTIONS } from './firebase';
import { logAuditEvent } from './firestore';
import type { LearnerRole, UserProfile } from '../types';

const LOCAL_USER_KEY = 'sxra:user';

const buildLocalProfile = (): UserProfile => ({
  uid: 'local-demo-user',
  displayName: 'Demo Learner',
  email: 'demo@ucla.local',
  role: 'guest',
  createdAt: Date.now(),
  lastLogin: Date.now(),
});

export async function signInWithGoogle(): Promise<UserProfile> {
  if (!firebaseEnabled || !firebaseAuth) {
    const profile = buildLocalProfile();
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
    return profile;
  }
  const result = await signInWithPopup(firebaseAuth, googleProvider);
  const profile = await ensureUserDoc(result.user);
  await logAuditEvent({ userId: profile.uid, type: 'login' });
  return profile;
}

export async function signInAsGuest(): Promise<UserProfile> {
  const profile: UserProfile = {
    ...buildLocalProfile(),
    uid: `guest-${Math.random().toString(36).slice(2, 10)}`,
  };
  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
  return profile;
}

export async function signOut(): Promise<void> {
  localStorage.removeItem(LOCAL_USER_KEY);
  if (firebaseEnabled && firebaseAuth) {
    try {
      const uid = firebaseAuth.currentUser?.uid;
      if (uid) await logAuditEvent({ userId: uid, type: 'logout' });
    } catch {
      // ignore
    }
    await fbSignOut(firebaseAuth);
  }
}

export function subscribeToAuth(
  cb: (profile: UserProfile | null) => void,
): () => void {
  if (!firebaseEnabled || !firebaseAuth) {
    const raw = localStorage.getItem(LOCAL_USER_KEY);
    cb(raw ? (JSON.parse(raw) as UserProfile) : null);
    const handler = (e: StorageEvent) => {
      if (e.key === LOCAL_USER_KEY) {
        cb(e.newValue ? (JSON.parse(e.newValue) as UserProfile) : null);
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }
  return onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
    if (!firebaseUser) {
      const raw = localStorage.getItem(LOCAL_USER_KEY);
      cb(raw ? (JSON.parse(raw) as UserProfile) : null);
      return;
    }
    const profile = await ensureUserDoc(firebaseUser);
    cb(profile);
  });
}

async function ensureUserDoc(user: FirebaseUser): Promise<UserProfile> {
  if (!firestore) {
    return {
      uid: user.uid,
      displayName: user.displayName ?? 'Learner',
      email: user.email ?? '',
      photoURL: user.photoURL ?? undefined,
      role: defaultRoleFor(user.email),
      createdAt: Date.now(),
      lastLogin: Date.now(),
    };
  }
  const ref = doc(firestore, COLLECTIONS.users, user.uid);
  const snap = await getDoc(ref);
  const baseDisplayName = user.displayName ?? user.email?.split('@')[0] ?? 'Learner';

  if (!snap.exists()) {
    const profile: UserProfile = {
      uid: user.uid,
      displayName: baseDisplayName,
      email: user.email ?? '',
      photoURL: user.photoURL ?? undefined,
      role: defaultRoleFor(user.email),
      createdAt: Date.now(),
      lastLogin: Date.now(),
    };
    await setDoc(ref, {
      ...profile,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    });
    return profile;
  }
  const data = snap.data() as Partial<UserProfile>;
  await updateDoc(ref, { lastLogin: serverTimestamp() });
  return {
    uid: user.uid,
    displayName: data.displayName ?? baseDisplayName,
    email: data.email ?? user.email ?? '',
    photoURL: data.photoURL ?? user.photoURL ?? undefined,
    role: data.role ?? defaultRoleFor(user.email),
    createdAt: data.createdAt ?? Date.now(),
    lastLogin: Date.now(),
  };
}

const ADMIN_EMAILS = new Set([
  'jswisher@mednet.ucla.edu',
  'jeremyswisher@gmail.com',
  'jeremyswisher13@gmail.com',
  'jeremyswisher.medicine@gmail.com',
]);

function defaultRoleFor(email: string | null | undefined): LearnerRole {
  if (!email) return 'guest';
  const e = email.toLowerCase();
  if (ADMIN_EMAILS.has(e)) return 'admin';
  if (e.includes('@mednet.ucla.edu')) return 'fellow';
  if (e.includes('ucla')) return 'resident';
  return 'guest';
}
