import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: "gen-lang-client-0780698048"
  });
}

export const adminDb = admin.firestore();
