import { db } from "./firebaseAdmin.js";

const ragazzi = [
    { nome: "Alessandro", cognome: "Lipari", ruolo: "educato" },
    { nome: "Alice", cognome: "Maggi", ruolo: "educato" },
    { nome: "Amelie", cognome: "Cordera", ruolo: "educato" },
    { nome: "Annachiara", cognome: "Invernizzi", ruolo: "educato" },
    { nome: "Antonio", cognome: "Livigni", ruolo: "educato" },
    { nome: "Arianna", cognome: "Rebonato", ruolo: "educato" },
    { nome: "Bianca", cognome: "Palmieri", ruolo: "educato" },
    { nome: "Carlo", cognome: "Benetti", ruolo: "educato" },
    { nome: "Carlo", cognome: "Starace", ruolo: "educato" },
    { nome: "Cecilia", cognome: "Perotti", ruolo: "educato" },
    { nome: "Cecilia", cognome: "Schweiger", ruolo: "educato" },
    { nome: "Cecilia", cognome: "Verdoia", ruolo: "educato" },
    { nome: "Cristian", cognome: "Biasi", ruolo: "educato" },
    { nome: "Elisa", cognome: "Palma", ruolo: "educato" },
    { nome: "Emma", cognome: "Castellani", ruolo: "educato" },
    { nome: "Francesca", cognome: "Brandimarte", ruolo: "educato" },
    { nome: "Francesco", cognome: "De Domenico", ruolo: "educato" },
    { nome: "Gabriele", cognome: "Colombo", ruolo: "educato" },
    { nome: "Gaia", cognome: "Pappalardo", ruolo: "educato" },
    { nome: "Gea", cognome: "Tomassi", ruolo: "educato" },
    { nome: "Giulia", cognome: "Pellegrini", ruolo: "educato" },
    { nome: "Iside", cognome: "Fonda", ruolo: "educato" },
    { nome: "Linda", cognome: "Dell'Orco", ruolo: "educato" },
    { nome: "Luca", cognome: "Segaricci", ruolo: "educato" },
    { nome: "Marco", cognome: "Muzzin", ruolo: "educato" },
    { nome: "Marta", cognome: "Maccarini", ruolo: "educato" },
    { nome: "Matilde", cognome: "Fossati", ruolo: "educato" },
    { nome: "Matteo", cognome: "Rizza", ruolo: "educato" },
    { nome: "Miriam", cognome: "Frascotti", ruolo: "educato" },
    { nome: "Nunzio", cognome: "Scaringella", ruolo: "educato" },
    { nome: "Sofia", cognome: "Perotti", ruolo: "educato" },
    { nome: "Sofia Lucia", cognome: "Mai", ruolo: "educato" },
    { nome: "Emanuele", cognome: "Casula", ruolo: "educato" },
    { nome: "Isabella", cognome: "Donesana", ruolo: "educato" },
    { nome: "Elisabetta", cognome: "Vanoli", ruolo: "educatore" },
    { nome: "Ettore", cognome: "Longo", ruolo: "educatore" },
    { nome: "Matteo", cognome: "Tattoli", ruolo: "educatore" },
    { nome: "Don", cognome: "Stefano", ruolo: "educatore" }
];

async function uploadRagazzi() {
    const collectionRef = db.collection("spiazzati");

    for (const ragazzo of ragazzi) {
        const dataToUpload = {
            nome: ragazzo.nome,
            cognome: ragazzo.cognome,
            ruolo: ragazzo.ruolo
        };
        const docRef = collectionRef.doc(); // ID automatico
        await docRef.set(dataToUpload);
        console.log(`Aggiunto: ${ragazzo.nome} ${ragazzo.cognome}`);
    }

    console.log("Tutti i ragazzi sono stati caricati nella collezione 'spiazzati'!");
}

uploadRagazzi().catch((err) => console.error("Errore:", err));