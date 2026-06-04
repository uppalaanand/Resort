import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from "firebase/auth";

// Firebase web application configuration.
// Utilizes environment variables (VITE_FIREBASE_*) with secure fallback values for mock/dev usage.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "mock-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mock-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mock-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mock-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:000000000000:web:0000000000000000000000"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Custom sign-in with Google function that initiates the Firebase Popup authentication
export const signInWithGoogle = async () => {
  // Safe mock support for development mode when api-key is not populated
  if (firebaseConfig.apiKey === "mock-api-key" && import.meta.env.DEV) {
    console.log("Using Mock Google Authentication Flow for development");
    return {
      user: {
        getIdToken: async () => "mock-token-google-12345-test_user@example.com-Ojas_Guest-https://lh3.googleusercontent.com/a/mock-pic",
        uid: "google-12345",
        email: "test_user@example.com",
        displayName: "Ojas Guest",
        photoURL: "https://lh3.googleusercontent.com/a/mock-pic"
      }
    };
  }
  return signInWithPopup(auth, googleProvider);
};

export const resetPasswordEmail = async (email: string) => {
  if (firebaseConfig.apiKey === "mock-api-key" && import.meta.env.DEV) {
    console.log("Simulating mock Firebase password reset email to:", email);
    return Promise.resolve();
  }
  return sendPasswordResetEmail(auth, email);
};

export default app;
