import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  type Auth,
} from 'firebase/auth';
import {
  getFirestore,
  type Firestore,
} from 'firebase/firestore';

// Firebase web SDK config is read from environment variables. Web SDK keys
// are technically public-safe (they ship in the browser bundle anyway, and
// Firestore security rules are what protect data), but we keep them out of
// source control so a forked public repo doesn't ship pre-wired to our
// project. Set them in .env.local — see .env.example for the shape.
const env = import.meta.env;

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: env.VITE_FIREBASE_APP_ID as string | undefined,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID as string | undefined,
};

// Firebase is enabled when an apiKey is present, unless explicitly disabled
// with VITE_FIREBASE_ENABLED="false". Without env vars the app runs in a
// localStorage-only fallback mode, which is fine for local demos.
const explicitFlag = (env.VITE_FIREBASE_ENABLED as string | undefined)?.toLowerCase();
export const firebaseEnabled =
  explicitFlag === 'false' ? false : Boolean(firebaseConfig.apiKey);

let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

if (firebaseEnabled) {
  try {
    appInstance = initializeApp(firebaseConfig);
    authInstance = getAuth(appInstance);
    dbInstance = getFirestore(appInstance);
  } catch (err) {
    console.warn('[firebase] init failed, falling back to local-only mode', err);
    appInstance = null;
    authInstance = null;
    dbInstance = null;
  }
}

export const firebaseApp = appInstance;
export const firebaseAuth = authInstance;
export const firestore = dbInstance;
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const COLLECTIONS = {
  users: 'users',
  modules: 'modules',
  moduleProgress: 'moduleProgress',
  quizAttempts: 'quizAttempts',
  confidenceRatings: 'confidenceRatings',
  caseAttempts: 'caseAttempts',
  videoProgress: 'videoProgress',
  auditLogs: 'auditLogs',
  bookmarks: 'bookmarks',
  adminContentDrafts: 'adminContentDrafts',
} as const;
