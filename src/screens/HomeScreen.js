import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { commonStyles as styles } from "../styles/Style.js";
import MapBoard from "../components/MapBoard";
import { collection, getDocs, getFirestore, where, query, documentId } from "firebase/firestore";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

export default function HomeScreen() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state?.user;
    const [spiazzati, setSpiazzati] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const mapContainerRef = useRef(null);
    const [incontri, setIncontri] = useState([]);
    const [selectedIncontroId, setSelectedIncontroId] = useState("");
    const [expandedIncontro, setExpandedIncontro] = useState(null);
    const [partecipantiByIncontro, setPartecipantiByIncontro] = useState({});

    useEffect(() => {
        if (user?.ruolo === "educatore") {
            const db = getFirestore();
            const incontriCollection = collection(db, "incontri");
            getDocs(incontriCollection)
                .then((querySnapshot) => {
                    const incontriList = querySnapshot.docs
                        .map(doc => ({
                            id: doc.id,
                            ...doc.data(),
                        }))
                        .sort((a, b) => (a.numero || 0) - (b.numero || 0));
                    setIncontri(incontriList);
                })
                .catch((error) => {
                    console.error("Errore nel caricamento degli incontri:", error);
                });
        }
    }, [user]);

    const handleLogout = () => navigate("/");
    const handleSelectChange = (e) => setSelectedUserId(e.target.value);

    const togglePartecipanti = async (incontroId) => {
        if (expandedIncontro === incontroId) {
            setExpandedIncontro(null);
            return;
        }

        setExpandedIncontro(incontroId);

        // Se abbiamo già caricato i partecipanti, non ricaricare
        if (partecipantiByIncontro[incontroId]) return;

        try {
            const db = getFirestore();

            // 1️⃣ Recupera tutte le partecipazioni dell'incontro con stato "yes"
            const partecipazioniSnap = await getDocs(
                query(
                    collection(db, "partecipazioni"),
                    where("incontroId", "==", incontroId),
                    where("stato", "==", "yes")
                )
            );

            const partecipazioni = partecipazioniSnap.docs.map(d => d.data());
            console.log("Partecipazioni trovate:", partecipazioni);

            const userIds = partecipazioni.map(p => p.userId);
            console.log("userIds trovati:", userIds);

            if (!userIds.length) {
                setPartecipantiByIncontro(prev => ({ ...prev, [incontroId]: [] }));
                return;
            }

            // 2️⃣ Recupera dati utenti corrispondenti con chunking
            const usersCollection = collection(db, "users");
            const allUsers = [];

            for (let i = 0; i < userIds.length; i += 10) {
                const chunk = userIds.slice(i, i + 10);
                console.log("Chunk utenti query:", chunk);
                const usersSnap = await getDocs(
                    query(usersCollection, where(documentId(), "in", chunk))
                );
                usersSnap.docs.forEach(u => {
                    allUsers.push({ id: u.id, ...u.data() });
                });
            }

            console.log("Utenti trovati:", allUsers);

            setPartecipantiByIncontro(prev => ({ ...prev, [incontroId]: allUsers }));
        } catch (error) {
            console.error("Errore caricamento partecipanti:", error);
        }
    };

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

                    <div style={{
                        width: "100%",
                        margin: "0 auto",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        paddingRight: "10px",
                        boxSizing: "border-box", // aggiunto per includere padding e border nel calcolo della larghezza
                        padding: "10px 20px", // spazio sopra e sotto
                        overflow: "auto",
                    }}>

                        {incontri.length === 0 ? (
                            <p>Nessun incontro disponibile.</p>
                        ) : (
                            incontri.map((incontro) => {
                                const isExpanded = expandedIncontro === incontro.id;
                                const partecipanti = partecipantiByIncontro[incontro.id] || [];
                                return (
                                    <div
                                        key={incontro.id}
                                        style={{
                                            border: "1px solid #ccc",
                                            borderRadius: 8,
                                            padding: 12,
                                            width: "100%",
                                            maxWidth: 500,
                                            marginBottom: 10,
                                            backgroundColor: "#fafafa",
                                            textAlign: "left"
                                        }}
                                    >
                                        <div
                                            onClick={() => togglePartecipanti(incontro.id)}
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                cursor: "pointer"
                                            }}
                                        >
                                            <span style={{ fontFamily: "Arial, sans-serif", fontWeight: "bold", fontSize: 16 }}>
                                                {incontro.titolo || `Incontro ${incontro.numero || ""}`}
                                            </span>
                                            {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
                                        </div>
                                        {isExpanded && (
                                            <div style={{ marginTop: 10, marginLeft: 10 }}>
                                                {partecipanti.length > 0 ? (
                                                    <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                                                        {partecipanti.map((p) => (
                                                            <li key={p.id}>• {p.nome} {p.cognome}</li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p style={{ fontStyle: "italic" }}>Nessun partecipante registrato.</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>

            <button onClick={handleLogout} style={styles.buttonPrimary}>Logout</button>
        </div>
    );
}