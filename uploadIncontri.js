import { db } from "./firebaseAdmin.js";

const incontri = [
    { numero: 1, titolo: "Pizzata + gioco", data: "2025-10-07", posizione: { x: 15.79, y: 18.23 } },
    { numero: 2, titolo: "Il mondo ordinario", data: "2025-10-14", posizione: { x: 19.77, y: 26.13 } },
    { numero: 3, titolo: "La chiamata all’avventura", data: "2025-10-21", posizione: { x: 26.90, y: 30.95 } },
    { numero: 4, titolo: "Il rifiuto della chiamata", data: "2025-10-28", posizione: { x: 33.19, y: 39.28 } },
    { numero: 5, titolo: "L’incontro col mentore", data: "2025-11-04", posizione: { x: 23.50, y: 54.63 } },
    { numero: 6, titolo: "Gesù", data: "2025-11-11", posizione: { x: 14.71, y: 52.73 } },
    { numero: 7, titolo: "", data: "2025-11-18", posizione: { x: 38.50, y: 50.98 } },
    { numero: 8, titolo: "► ritiro (22-23 o 29-30)", data: "2025-11-25", posizione: { x: 34.77, y: 60.48 } },
    { numero: 9, titolo: "", data: "2025-12-02", posizione: { x: 29.88, y: 70.27 } },
    { numero: 10, titolo: "Il varco della prima soglia", data: "2025-12-09", posizione: { x: 33.03, y: 80.07 } },
    { numero: 11, titolo: "Pizzata natale + lupus", data: "2025-12-16", posizione: { x: 47.69, y: 72.76 } },
    { numero: 12, titolo: "Gioco prove + saluti eliii", data: "2026-01-13", posizione: { x: 49.52, y: 59.89 } },
    { numero: 13, titolo: "Quali sono le prove quotidiane", data: "2026-01-20", posizione: { x: 46.45, y: 44.11 } },
    { numero: 14, titolo: "Alleati concreti, persone e oggetti.", data: "2026-01-27", posizione: { x: 45.71, y: 24.96 } },
    { numero: 15, titolo: "Chi sono i tuoi alleati? + intro sentimentalità", data: "2026-02-03", posizione: { x: 33.86, y: 21.15 } },
    { numero: 16, titolo: "Testimonianza sessualità", data: "2026-02-10", posizione: { x: 55.07, y: 32.26 } },
    { numero: 17, titolo: "Avvicinamento alla caverna più profonda", data: "2026-02-17", posizione: { x: 59.79, y: 39.57 } },
    { numero: 18, titolo: "Quando noi diventiamo i cattivi + bugie", data: "2026-02-24", posizione: { x: 70.65, y: 32.41 } },
    { numero: 19, titolo: "Quei “cattivi” che avevi giudicato all’apparenza (Piton)", data: "2026-03-03", posizione: { x: 82.33, y: 20.72 } },
    { numero: 20, titolo: "L’ordalia", data: "2026-03-10", posizione: { x: 87.89, y: 37.53 } },
    { numero: 21, titolo: "La ricompensa", data: "2026-03-17", posizione: { x: 74.54, y: 47.18 } },
    { numero: 22, titolo: "Confessioni", data: "2026-03-24", posizione: { x: 65.59, y: 47.76 } },
    { numero: 23, titolo: "Incontro Leonardo", data: "2026-04-14", posizione: { x: 60.79, y: 52.88 } },
    { numero: 24, titolo: "Per me o per gli altri?", data: "2026-04-21", posizione: { x: 68.74, y: 59.31 } },
    { numero: 25, titolo: "Volontariato", data: "2026-04-28", posizione: { x: 76.28, y: 69.83 } },
    { numero: 26, titolo: "Il ritorno a casa, la celebrazione", data: "2026-05-05", posizione: { x: 74.46, y: 87.08 } },
    { numero: 27, titolo: "Pizzata", data: "2026-05-12", posizione: { x: 0, y: 0 } } // l'ultima puoi misurarla tu
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
        const docRef = collectionRef.doc();
        await docRef.set(dataToUpload);
        console.log(`Aggiunto: ${incontro.titolo} (${incontro.data})`);
    }

    console.log("Tutti gli incontri sono stati caricati nella collezione 'incontri'!");
}

uploadIncontri().catch((err) => console.error("Errore:", err));