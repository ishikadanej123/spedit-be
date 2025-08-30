const admin = require("firebase-admin");
const {
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_API_KEY,
  FIREBASE_APP_ID,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_AUTH_DOMAIN,
} = require("../config/env.js");

if (!admin.apps.length) {
  const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID,
  };
  admin.initializeApp(firebaseConfig);
}

const adminAuth = admin.auth();
const adminDb = admin.firestore();
const adminStorage = admin.storage();

module.exports = { adminAuth, adminDb, adminStorage };
