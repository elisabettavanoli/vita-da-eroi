import { db } from "./firebaseAdmin.js";

const incontri = [
    { numero: 1, titolo: "Incontro di Benvenuto", data: "2025-09-12" },
    { numero: 2, titolo: "Laboratorio STEM", data: "2025-09-13" },
    { numero: 3, titolo: "Attività Sportiva", data: "2025-09-14" },
    { numero: 4, titolo: "Giochi e Creatività", data: "2025-09-15" },
    { numero: 5, titolo: "Incontro Finale", data: "2025-09-16" }
];

async function uploadIncontri() {
    const collectionRef = db.collection("incontri");

    for (const incontro of incontri) {
        const dataToUpload = {
            numero: incontro.numero,
            titolo: incontro.titolo,
            data: incontro.data
        };
        const docRef = collectionRef.doc(); // ID automatico
        await docRef.set(dataToUpload);
        console.log(`Aggiunto: ${incontro.titolo} (${incontro.data})`);
    }

    console.log("Tutti gli incontri sono stati caricati nella collezione 'incontri'!");
}

uploadIncontri().catch((err) => console.error("Errore:", err));