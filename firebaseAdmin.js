// firebaseAdmin.js
import { readFileSync } from "fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = JSON.parse(
    readFileSync(new URL("./vitadaeroi-firebase-adminsdk-fbsvc-b65c8ebe9b.json", import.meta.url))
);

initializeApp({
    credential: cert(serviceAccount)
});

export const db = getFirestore();