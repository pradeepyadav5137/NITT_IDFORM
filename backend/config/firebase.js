import admin from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';

let firebaseApp = null;

export function initFirebase() {
  if (firebaseApp) return firebaseApp;

  const cred = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (!cred) {
    console.warn('Firebase: GOOGLE_APPLICATION_CREDENTIALS_JSON not set – file uploads will use local storage');
    return null;
  }

  try {
    const serviceAccount = JSON.parse(cred);
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${serviceAccount.project_id}.appspot.com`
    });
    return firebaseApp;
  } catch (e) {
    console.warn('Firebase init failed:', e.message);
    return null;
  }
}

export async function uploadToFirebase(buffer, path, contentType) {
  const app = initFirebase();
  if (!app) return null;

  const bucket = getStorage().bucket();
  const file = bucket.file(path);
  await file.save(buffer, {
    metadata: { contentType },
    resumable: false
  });

  const [url] = await file.getSignedUrl({
    version: 'v4',
    action: 'read',
    expires: Date.now() + 365 * 24 * 60 * 60 * 1000 // 1 year
  });
  return url;
}

export async function deleteFromFirebase(path) {
  const app = initFirebase();
  if (!app) return;

  try {
    const bucket = getStorage().bucket();
    const file = bucket.file(path);
    await file.delete();
  } catch (err) {
    console.error(`Firebase delete failed for ${path}:`, err.message);
  }
}

export function isFirebaseEnabled() {
  return !!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
}
