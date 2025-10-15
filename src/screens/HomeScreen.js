import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { commonStyles as styles } from "../styles/Style.js";
import MapBoard from "../components/MapBoard";
import { collection, getDocs, getFirestore } from "firebase/firestore";

export default function HomeScreen() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state?.user;
    const [spiazzati, setSpiazzati] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const mapContainerRef = useRef(null);

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
    const handleSelectChange = (e) => setSelectedUserId(e.target.value);

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>
                {user?.sesso === "F" ? "Benvenuta" : "Benvenuto"}, {user?.nome}!
            </h1>

            {/* Contenitore con altezza esplicita */}
            <div
                ref={mapContainerRef}
                style={{
                    width: "90%",
                    aspectRatio: "3 / 4",
                    height: "fit-content",
                    margin: "0 auto",
                    marginBottom: 30,

                }}
            >
                {user?.ruolo === "educato" && (
                    <MapBoard userId={user?.id} containerRef={mapContainerRef} />
                )}
                {user?.ruolo === "educatore" && (
                    <>
                        <select
                            onChange={handleSelectChange}
                            value={selectedUserId || ""}
                            style={{ marginBottom: 20, padding: 8, fontSize: 16 }}
                        >
                            <option value="" disabled>Seleziona un ragazzo</option>
                            {spiazzati
                                .filter(r => r.ruolo === "educato")
                                .sort((a, b) => a.nome.localeCompare(b.nome))
                                .map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.nome} {r.cognome}
                                    </option>
                                ))}
                        </select>
                        {selectedUserId && (
                            <MapBoard
                                userId={selectedUserId}
                                readonly={true}
                                containerRef={mapContainerRef}
                            />
                        )}
                    </>
                )}
            </div>

            <button onClick={handleLogout} style={styles.buttonPrimary}>Logout</button>
        </div>
    );
}