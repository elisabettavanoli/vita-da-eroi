// src/screens/HomeScreen.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // ⚠ Import mancanti
import { commonStyles as styles } from "../styles/Style.js";   // ⚠ Assicurati che il nome del file sia styles.js
import MapBoard from "../components/MapBoard";
import { collection, getDocs, getFirestore } from "firebase/firestore";

export default function HomeScreen() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state?.user;
    console.log("User data:", user);

    const [spiazzati, setSpiazzati] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);

    useEffect(() => {
        if (user?.ruolo === "educatore") {
            const db = getFirestore();
            const spiazzatiCollection = collection(db, "spiazzati");
            getDocs(spiazzatiCollection).then((querySnapshot) => {
                const ragazziList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setSpiazzati(ragazziList);
            }).catch((error) => {
                console.error("Errore nel caricamento dei ragazzi:", error);
            });
        }
    }, [user]);

    const handleLogout = () => navigate("/");

    const handleSelectChange = (e) => {
        setSelectedUserId(e.target.value);
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Benvenuto, {user?.nome}!</h1>
            {user?.ruolo === "educato" && (
                <MapBoard userId={user?.id} />
            )}
            {user?.ruolo === "educatore" && (
                <>
                    <select onChange={handleSelectChange} value={selectedUserId || ""} style={{ marginBottom: 20, padding: 8, fontSize: 16 }}>
                        <option value="" disabled>Seleziona un ragazzo</option>
                        {spiazzati.filter(ragazzo => ragazzo.ruolo === "educato").map((ragazzo) => (
                            <option key={ragazzo.id} value={ragazzo.id}>
                                {ragazzo.nome} {ragazzo.cognome}
                            </option>
                        ))}
                    </select>
                    {selectedUserId && <MapBoard userId={selectedUserId} readonly={true} />}
                </>
            )}
            <button onClick={handleLogout} style={styles.buttonPrimary}>Logout</button>
        </div>
    );
}