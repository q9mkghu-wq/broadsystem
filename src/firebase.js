import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
apiKey: "AIzaSyBvwf-pR1WYdFOnJGuhbrnf02HTNhVgSaA",
  authDomain: "broadsystem-9147f.firebaseapp.com",
  projectId: "broadsystem-9147f",
  storageBucket: "broadsystem-9147f.firebasestorage.app",
  messagingSenderId: "458957971815",
  appId: "1:458957971815:web:0e71b6ccb7a4d0936b4fc2"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
