import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Secondary project: the on-site 3D survey app (실측앱) has its own Firebase project.
// We connect read-only to fetch the auto-generated wall/plan drawings it saves per room.
// (This API key is already public in the survey app's own page source — Firebase client
// keys identify a project, they aren't secrets; access is controlled by Firestore rules.)
const surveyFirebaseConfig = {
  apiKey: "AIzaSyB09DJJw1Q2Vm0xW5IvnSCaIQEja5PHwYk",
  authDomain: "hanger-survey.firebaseapp.com",
  projectId: "hanger-survey",
  storageBucket: "hanger-survey.firebasestorage.app",
  messagingSenderId: "1026732408882",
  appId: "1:1026732408882:web:fb02c65ed129548709bc2b",
};
const surveyApp = initializeApp(surveyFirebaseConfig, "surveyApp");
export const surveyDb = getFirestore(surveyApp);
