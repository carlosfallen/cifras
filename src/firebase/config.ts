import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  // Replace with your Firebase config
  apiKey: "demo-key",
  authDomain: "music-platform-demo.firebaseapp.com",
  projectId: "music-platform-demo",
  storageBucket: "music-platform-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "demo-app-id"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);