import { db } from "./firebaseAdmin.js";

const incontri = [
    { numero: 1, titolo: "Pizzata + gioco", data: "2025-10-07" },
    { numero: 2, titolo: "Il mondo ordinario", data: "2025-10-14" },
    { numero: 3, titolo: "La chiamata all’avventura", data: "2025-10-21" },
    { numero: 4, titolo: "Il rifiuto della chiamata", data: "2025-10-28" },
    { numero: 5, titolo: "L’incontro col mentore", data: "2025-11-04" },
    { numero: 6, titolo: "Gesù", data: "2025-11-11" },
    { numero: 7, titolo: "", data: "2025-11-18" },
    { numero: 8, titolo: "\u25BA ritiro (22-23 o 29-30)", data: "2025-11-25" },
    { numero: 9, titolo: "", data: "2025-12-02" },
    { numero: 10, titolo: "Il varco della prima soglia", data: "2025-12-09" },
    { numero: 11, titolo: "Pizzata natale + lupus", data: "2025-12-16" },
    { numero: 12, titolo: "Gioco prove + saluti eliii", data: "2026-01-13" },
    { numero: 13, titolo: "Quali sono le prove quotidiane", data: "2026-01-20" },
    { numero: 14, titolo: "Alleati concreti, persone e oggetti.", data: "2026-01-27" },
    { numero: 15, titolo: "Chi sono i tuoi alleati? + intro sentimentalità", data: "2026-02-03" },
    { numero: 16, titolo: "Testimonianza sessualità", data: "2026-02-10" },
    { numero: 17, titolo: "Avvicinamento alla caverna più profonda", data: "2026-02-17" },
    { numero: 18, titolo: "Quando noi diventiamo i cattivi + bugie", data: "2026-02-24" },
    { numero: 19, titolo: "Quei “cattivi” che avevi giudicato all’apparenza (Piton)", data: "2026-03-03" },
    { numero: 20, titolo: "L’ordalia", data: "2026-03-10" },
    { numero: 21, titolo: "La ricompensa", data: "2026-03-17" },
    { numero: 22, titolo: "Confessioni", data: "2026-03-24" },
    { numero: 23, titolo: "\u25BA ritiro 28-29", data: "2026-03-31" },
    { numero: 24, titolo: "Incontro Leonardo", data: "2026-04-14" },
    { numero: 25, titolo: "Per me o per gli altri?", data: "2026-04-21" },
    { numero: 26, titolo: "Volontariato", data: "2026-04-28" },
    { numero: 27, titolo: "Il ritorno a casa, la celebrazione", data: "2026-05-05" },
    { numero: 28, titolo: "Pizzata", data: "2026-05-12" }
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