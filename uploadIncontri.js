import { db } from "./firebaseAdmin.js";

const incontri = [
    { numero: 1, titolo: "Pizzata + gioco", data: "2025-10-07", posizione: { x: 10, y: 80 } },
    { numero: 2, titolo: "Il mondo ordinario", data: "2025-10-14", posizione: { x: 25, y: 65 } },
    { numero: 3, titolo: "La chiamata all’avventura", data: "2025-10-21", posizione: { x: 40, y: 50 } },
    { numero: 4, titolo: "Il rifiuto della chiamata", data: "2025-10-28", posizione: { x: 55, y: 40 } },
    { numero: 5, titolo: "L’incontro col mentore", data: "2025-11-04", posizione: { x: 70, y: 30 } },
    { numero: 6, titolo: "Gesù", data: "2025-11-11", posizione: { x: 85, y: 20 } },
    { numero: 7, titolo: "", data: "2025-11-18", posizione: { x: 100, y: 15 } },
    { numero: 8, titolo: "\u25BA ritiro (22-23 o 29-30)", data: "2025-11-25", posizione: { x: 115, y: 10 } },
    { numero: 9, titolo: "", data: "2025-12-02", posizione: { x: 130, y: 5 } },
    { numero: 10, titolo: "Il varco della prima soglia", data: "2025-12-09", posizione: { x: 145, y: 0 } },
    { numero: 11, titolo: "Pizzata natale + lupus", data: "2025-12-16", posizione: { x: 160, y: 0 } },
    { numero: 12, titolo: "Gioco prove + saluti eliii", data: "2026-01-13", posizione: { x: 175, y: 5 } },
    { numero: 13, titolo: "Quali sono le prove quotidiane", data: "2026-01-20", posizione: { x: 190, y: 10 } },
    { numero: 14, titolo: "Alleati concreti, persone e oggetti.", data: "2026-01-27", posizione: { x: 205, y: 15 } },
    { numero: 15, titolo: "Chi sono i tuoi alleati? + intro sentimentalità", data: "2026-02-03", posizione: { x: 220, y: 20 } },
    { numero: 16, titolo: "Testimonianza sessualità", data: "2026-02-10", posizione: { x: 235, y: 25 } },
    { numero: 17, titolo: "Avvicinamento alla caverna più profonda", data: "2026-02-17", posizione: { x: 250, y: 30 } },
    { numero: 18, titolo: "Quando noi diventiamo i cattivi + bugie", data: "2026-02-24", posizione: { x: 265, y: 35 } },
    { numero: 19, titolo: "Quei “cattivi” che avevi giudicato all’apparenza (Piton)", data: "2026-03-03", posizione: { x: 280, y: 40 } },
    { numero: 20, titolo: "L’ordalia", data: "2026-03-10", posizione: { x: 295, y: 45 } },
    { numero: 21, titolo: "La ricompensa", data: "2026-03-17", posizione: { x: 310, y: 50 } },
    { numero: 22, titolo: "Confessioni", data: "2026-03-24", posizione: { x: 325, y: 55 } },
    { numero: 23, titolo: "Incontro Leonardo", data: "2026-04-14", posizione: { x: 340, y: 60 } },
    { numero: 24, titolo: "Per me o per gli altri?", data: "2026-04-21", posizione: { x: 355, y: 65 } },
    { numero: 25, titolo: "Volontariato", data: "2026-04-28", posizione: { x: 370, y: 70 } },
    { numero: 26, titolo: "Il ritorno a casa, la celebrazione", data: "2026-05-05", posizione: { x: 385, y: 75 } },
    { numero: 27, titolo: "Pizzata", data: "2026-05-12", posizione: { x: 400, y: 80 } }
];

async function uploadIncontri() {
    const collectionRef = db.collection("incontri");

    for (const incontro of incontri) {
        const dataToUpload = {
            numero: incontro.numero,
            titolo: incontro.titolo,
            data: incontro.data,
            posizione: incontro.posizione
        };
        const docRef = collectionRef.doc(); // ID automatico
        await docRef.set(dataToUpload);
        console.log(`Aggiunto: ${incontro.titolo} (${incontro.data})`);
    }

    console.log("Tutti gli incontri sono stati caricati nella collezione 'incontri'!");
}

uploadIncontri().catch((err) => console.error("Errore:", err));