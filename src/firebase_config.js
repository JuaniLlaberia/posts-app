import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAo7yeqQ8JGceQkxx8Ut1f3546Nmg8E3_E",
  authDomain: "post-app-18e62.firebaseapp.com",
  projectId: "post-app-18e62",
  storageBucket: "post-app-18e62.appspot.com",
  messagingSenderId: "677186325260",
  appId: "1:677186325260:web:56e68276dbda70a8111729"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);