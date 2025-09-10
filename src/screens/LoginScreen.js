// src/screens/LoginScreen.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase.js";
import { collection, getDocs } from "firebase/firestore";
import { commonStyles as styles } from "../styles/Style.js";

export default function LoginScreen() {
    const [nome, setNome] = useState("");
    const [cognome, setCognome] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const colRef = collection(db, "spiazzati");
            console.log("Tentativo di lettura della collezione 'spiazzati'...");

            const querySnapshot = await getDocs(colRef);

            console.log("Documenti trovati nella collezione:", querySnapshot.size);
            if (querySnapshot.empty) {
                console.warn("La collezione è vuota!");
                setError("Errore: nessun utente disponibile");
                return;
            }

            querySnapshot.docs.forEach(doc => console.log("Documento:", doc.id, doc.data()));

            const studentDoc = querySnapshot.docs.find(doc => {
                const data = doc.data();
                return (
                    data.nome && data.cognome &&
                    data.nome.trim().toLowerCase() === nome.trim().toLowerCase() &&
                    data.cognome.trim().toLowerCase() === cognome.trim().toLowerCase()
                );
            });

            if (studentDoc) {
                const studentData = studentDoc.data();
                console.log("Login riuscito:", studentData);
                navigate("/home", { state: { student: studentData } });
            } else {
                console.warn("Nessun documento corrispondente trovato per input:", nome, cognome);
                setError("Nome o cognome non valido");
            }

        } catch (err) {
            console.error("Errore durante la query Firestore:", err);
            setError("Errore durante il login");
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Login</h1>
            <form onSubmit={handleLogin} style={styles.form}>
                <input
                    type="text"
                    placeholder="Nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    style={styles.input}
                    required
                />
                <input
                    type="text"
                    placeholder="Cognome"
                    value={cognome}
                    onChange={(e) => setCognome(e.target.value)}
                    style={styles.input}
                    required
                />
                <button type="submit" style={styles.button}>Accedi</button>
            </form>
            {error && <p style={styles.error}>{error}</p>}
        </div>
    );
}
