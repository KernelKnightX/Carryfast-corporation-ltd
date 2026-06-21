import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const hasFirebaseConfig = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId,
);

export const firebaseApp = hasFirebaseConfig
  ? getApps().length ? getApp() : initializeApp(firebaseConfig)
  : null;
export const firebaseAuth = firebaseApp ? getAuth(firebaseApp) : null;

// Debug helpers: expose a small flag to the browser for quick verification.
try {
  if (typeof window !== "undefined") {
    window.__CFC_FIREBASE_READY__ = {
      hasFirebaseConfig: !!hasFirebaseConfig,
      firebaseApp: !!firebaseApp,
      projectId: firebaseConfig.projectId || null,
    };
  }
} catch (e) {
  // ignore in non-browser environments
}

// Persist auth across browser reloads (defaults to local, but make it explicit).
if (firebaseAuth) {
  setPersistence(firebaseAuth, browserLocalPersistence).catch(() => {});
}

export const ADMIN_URL = process.env.REACT_APP_ADMIN_URL || "/cfc-admin-control-room";
