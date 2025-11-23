import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDS7MrWCC3ikQDXtrznajRxH7yN_1qVaVg",
  authDomain: "studio-6847709612-63d25.firebaseapp.com",
  projectId: "studio-6847709612-63d25",
  storageBucket: "studio-6847709612-63d25.firebasestorage.app",
  messagingSenderId: "625680665452",
  appId: "1:625680665452:web:9132cdb2ae5f0f8971c149"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
