import { db } from "./firebaseAdmin.js";

const ragazzi = [
    { nome: "Alessandro", cognome: "Lipari" },
    { nome: "Alice", cognome: "Maggi" },
    { nome: "Amelie", cognome: "Cordera" },
    { nome: "Annachiara", cognome: "Invernizzi" },
    { nome: "Antonio", cognome: "Livigni" },
    { nome: "Arianna", cognome: "Rebonato" },
    { nome: "Bianca", cognome: "Palmieri" },
    { nome: "Carlo", cognome: "Benetti" },
    { nome: "Carlo", cognome: "Starace" },
    { nome: "Cecilia", cognome: "Perotti" },
    { nome: "Cecilia", cognome: "Schweiger" },
    { nome: "Cecilia", cognome: "Verdoia" },
    { nome: "Cristian", cognome: "Biasi" },
    { nome: "Elisa", cognome: "Palma" },
    { nome: "Emma", cognome: "Castellani" },
    { nome: "Francesca", cognome: "Brandimarte" },
    { nome: "Francesco", cognome: "De Domenico" },
    { nome: "Gabriele", cognome: "Colombo" },
    { nome: "Gaia", cognome: "Pappalardo" },
    { nome: "Gea", cognome: "Tomassi" },
    { nome: "Giulia", cognome: "Pellegrini" },
    { nome: "Iside", cognome: "Fonda" },
    { nome: "Linda", cognome: "Dell'Orco" },
    { nome: "Luca", cognome: "Segaricci" },
    { nome: "Marco", cognome: "Muzzin" },
    { nome: "Marta", cognome: "Maccarini" },
    { nome: "Matilde", cognome: "Fossati" },
    { nome: "Matteo", cognome: "Rizza" },
    { nome: "Miriam", cognome: "Frascotti" },
    { nome: "Nunzio", cognome: "Scaringella" },
    { nome: "Sofia", cognome: "Perotti" },
    { nome: "Sofia Lucia", cognome: "Mai" },
    { nome: "Emanuele", cognome: "Casula" },
    { nome: "Isabella", cognome: "Donesana" },
    { nome: "Elisabetta", cognome: "Vanoli" },
    { nome: "Ettore", cognome: "Longo" },
    { nome: "Matteo", cognome: "Tattoli" },
    { nome: "Don", cognome: "Stefano" }
];

async function uploadRagazzi() {
    const collectionRef = db.collection("spiazzati");

    for (const ragazzo of ragazzi) {
        const docRef = collectionRef.doc(); // ID automatico
        await docRef.set(ragazzo);
        console.log(`Aggiunto: ${ragazzo.nome} ${ragazzo.cognome}`);
    }

    console.log("Tutti i ragazzi sono stati caricati nella collezione 'spiazzati'!");
}

uploadRagazzi().catch((err) => console.error("Errore:", err));