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
    cacheLocalProfile(profile);
    return profile;
  }
  const result = await signInWithPopup(firebaseAuth, googleProvider);
  const profile = await ensureUserDocOrFallback(result.user);
  try {
    await logAuditEvent({ userId: profile.uid, type: 'login' });
  } catch {
    // Audit logging should never block an otherwise successful sign-in.
  }
  return profile;
}

export async function signInAsGuest(): Promise<UserProfile> {
  const profile: UserProfile = {
    ...buildLocalProfile(),
    uid: `guest-${Math.random().toString(36).slice(2, 10)}`,
  };
  cacheLocalProfile(profile);
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
    cb(readLocalProfile());
    const handler = (e: StorageEvent) => {
      if (e.key === LOCAL_USER_KEY) {
        cb(readLocalProfile());
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }
  return onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
    if (!firebaseUser) {
      cb(readLocalProfile());
      return;
    }
    const profile = await ensureUserDocOrFallback(firebaseUser);
    cb(profile);
  });
}

function readLocalProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(LOCAL_USER_KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    return null;
  }
}

function cacheLocalProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
  } catch {
    // Local storage can be unavailable in private browsing.
  }
}

function profileFromFirebaseUser(user: FirebaseUser): UserProfile {
  const baseDisplayName = user.displayName ?? user.email?.split('@')[0] ?? 'Learner';
  return {
    uid: user.uid,
    displayName: baseDisplayName,
    email: user.email ?? '',
    photoURL: user.photoURL ?? undefined,
    role: defaultRoleFor(user.email),
    createdAt: Date.now(),
    lastLogin: Date.now(),
  };
}

async function ensureUserDocOrFallback(user: FirebaseUser): Promise<UserProfile> {
  try {
    const profile = await ensureUserDoc(user);
    cacheLocalProfile(profile);
    return profile;
  } catch (err) {
    console.warn('[auth] profile sync failed, continuing with authenticated profile', err);
    const profile = profileFromFirebaseUser(user);
    cacheLocalProfile(profile);
    return profile;
  }
}

async function ensureUserDoc(user: FirebaseUser): Promise<UserProfile> {
  if (!firestore) {
    return profileFromFirebaseUser(user);
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
