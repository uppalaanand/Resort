import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
try {
  if (admin.apps.length === 0) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('Firebase Admin SDK initialized successfully with service account cert.');
    } else {
      // Initialize with default application credentials or project ID
      admin.initializeApp({
        projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'mock-project'
      });
      console.log('Firebase Admin SDK initialized with project ID.');
    }
  }
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
}

export const verifyFirebaseToken = async (idToken: string) => {
  // If we are running in development/test environment without real Firebase credentials,
  // we can provide a bypass for mock development tokens to enable robust local testing.
  if (idToken.startsWith('mock-token-') && process.env.NODE_ENV !== 'production') {
    const parts = idToken.split('-');
    const uid = parts[2] || 'mock-uid';
    const email = parts[3] || 'mock@example.com';
    const name = parts[4] || 'Mock User';
    const picture = parts[5] || '';
    return {
      uid,
      email,
      name,
      picture,
      email_verified: true,
      auth_time: Math.floor(Date.now() / 1000),
      iss: 'https://securetoken.google.com/mock-project',
      aud: 'mock-project',
      sub: uid,
      exp: Math.floor(Date.now() / 1000) + 3600
    };
  }

  return admin.auth().verifyIdToken(idToken);
};

export default admin;
