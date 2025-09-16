import { db } from "./firebaseAdmin.js";

const ragazzi = [
    { nome: "Alessandro", cognome: "Lipari", ruolo: "educato", sesso: "M" },
    { nome: "Alice", cognome: "Maggi", ruolo: "educato", sesso: "F" },
    { nome: "Amelie", cognome: "Cordera", ruolo: "educato", sesso: "F" },
    { nome: "Annachiara", cognome: "Invernizzi", ruolo: "educato", sesso: "F" },
    { nome: "Antonio", cognome: "Livigni", ruolo: "educato", sesso: "M" },
    { nome: "Arianna", cognome: "Rebonato", ruolo: "educato", sesso: "F" },
    { nome: "Bianca", cognome: "Palmieri", ruolo: "educato", sesso: "F" },
    { nome: "Carlo", cognome: "Benetti", ruolo: "educato", sesso: "M" },
    { nome: "Carlo", cognome: "Starace", ruolo: "educato", sesso: "M" },
    { nome: "Cecilia", cognome: "Perotti", ruolo: "educato", sesso: "F" },
    { nome: "Cecilia", cognome: "Schweiger", ruolo: "educato", sesso: "F" },
    { nome: "Cecilia", cognome: "Verdoia", ruolo: "educato", sesso: "F" },
    { nome: "Cristian", cognome: "Biasi", ruolo: "educato", sesso: "M" },
    { nome: "Elisa", cognome: "Palma", ruolo: "educato", sesso: "F" },
    { nome: "Emma", cognome: "Castellani", ruolo: "educato", sesso: "F" },
    { nome: "Francesca", cognome: "Brandimarte", ruolo: "educato", sesso: "F" },
    { nome: "Francesco", cognome: "De Domenico", ruolo: "educato", sesso: "M" },
    { nome: "Gabriele", cognome: "Colombo", ruolo: "educato", sesso: "M" },
    { nome: "Gaia", cognome: "Pappalardo", ruolo: "educato", sesso: "F" },
    { nome: "Gea", cognome: "Tomassi", ruolo: "educato", sesso: "F" },
    { nome: "Giulia", cognome: "Pellegrini", ruolo: "educato", sesso: "F" },
    { nome: "Iside", cognome: "Fonda", ruolo: "educato", sesso: "F" },
    { nome: "Linda", cognome: "Dell'Orco", ruolo: "educato", sesso: "F" },
    { nome: "Luca", cognome: "Segaricci", ruolo: "educato", sesso: "M" },
    { nome: "Marco", cognome: "Muzzin", ruolo: "educato", sesso: "M" },
    { nome: "Marta", cognome: "Maccarini", ruolo: "educato", sesso: "F" },
    { nome: "Matilde", cognome: "Fossati", ruolo: "educato", sesso: "F" },
    { nome: "Matteo", cognome: "Rizza", ruolo: "educato", sesso: "M" },
    { nome: "Miriam", cognome: "Frascotti", ruolo: "educato", sesso: "F" },
    { nome: "Nunzio", cognome: "Scaringella", ruolo: "educato", sesso: "M" },
    { nome: "Sofia", cognome: "Perotti", ruolo: "educato", sesso: "F" },
    { nome: "Sofia Lucia", cognome: "Mai", ruolo: "educato", sesso: "F" },
    { nome: "Emanuele", cognome: "Casula", ruolo: "educato", sesso: "M" },
    { nome: "Isabella", cognome: "Donesana", ruolo: "educato", sesso: "F" },
    { nome: "Elisabetta", cognome: "Vanoli", ruolo: "educatore", sesso: "F" },
    { nome: "Ettore", cognome: "Longo", ruolo: "educatore", sesso: "M" },
    { nome: "Matteo", cognome: "Tattoli", ruolo: "educatore", sesso: "M" },
    { nome: "Don", cognome: "Stefano", ruolo: "educatore", sesso: "M" }
];

async function uploadRagazzi() {
    const collectionRef = db.collection("spiazzati");

    for (const ragazzo of ragazzi) {
        const dataToUpload = {
            nome: ragazzo.nome,
            cognome: ragazzo.cognome,
            ruolo: ragazzo.ruolo,
            sesso: ragazzo.sesso,
        };
        const docRef = collectionRef.doc(); // ID automatico
        await docRef.set(dataToUpload);
        console.log(`Aggiunto: ${ragazzo.nome} ${ragazzo.cognome}`);
    }

    console.log("Tutti i ragazzi sono stati caricati nella collezione 'spiazzati'!");
}

uploadRagazzi().catch((err) => console.error("Errore:", err));