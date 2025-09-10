// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC7zTbxLpfjmEQu2pGnA7PnqC1qwrbSAcc",
    authDomain: "vitadaeroi.firebaseapp.com",
    projectId: "vitadaeroi",
    storageBucket: "vitadaeroi.firebasestorage.app",
    messagingSenderId: "875694047701",
    appId: "1:875694047701:web:fda144043a2d97364fbd5c",
    measurementId: "G-TPGWH5HDNM"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);

// Esporta i servizi che ti servono
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;