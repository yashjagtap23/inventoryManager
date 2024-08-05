// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "",
  authDomain: "inventory-management-aedcb.firebaseapp.com",
  projectId: "inventory-management-aedcb",
  storageBucket: "inventory-management-aedcb.appspot.com",
  messagingSenderId: "929372105761",
  appId: "1:929372105761:web:4f30fbaea33aa82d2dc760",
  measurementId: "G-SVBXZHZVQ3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}
