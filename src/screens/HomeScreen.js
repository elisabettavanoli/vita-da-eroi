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
        setPartecipantiByIncontro(prev => ({ ...prev, [incontroId]: "loading" }));

        // Se abbiamo già caricato i partecipanti, non ricaricare
        if (partecipantiByIncontro[incontroId]) return;

        try {
            const db = getFirestore();

            // Recupera partecipazioni dell'incontro con stato "yes"
            const partecipazioniSnap = await getDocs(
                query(
                    collection(db, "partecipazioni"),
                    where("incontroId", "==", incontroId),
                    where("stato", "==", "yes")
                )
            );

            if (partecipazioniSnap.empty) {
                setPartecipantiByIncontro(prev => ({ ...prev, [incontroId]: [] }));
                return;
            }

            // Normalizza i dati e prova a estrarre gli id utente anche se sono stored come DocumentReference
            const partecipazioni = partecipazioniSnap.docs.map(d => ({ id: d.id, ...d.data() }));

            const userIdsRaw = partecipazioni.map(p => {
                // supporta più possibili nomi di campo e DocumentReference
                const candidate = (p.userId ?? p.userUid ?? p.uid ?? (p.user && (p.user.id || p.user))) || null;
                if (!candidate) return null;
                // Se è un DocumentReference estrai .id
                if (typeof candidate === "object" && candidate.id) return candidate.id;
                return candidate;
            });

            // Rimuovi duplicati e falsy
            const userIds = Array.from(new Set(userIdsRaw.filter(Boolean).map(String)));

            if (!userIds.length) {
                setPartecipantiByIncontro(prev => ({ ...prev, [incontroId]: [] }));
                return;
            }

            // Chunking (firestore 'in' supporta max 10)
            const usersCollection = collection(db, "spiazzati");
            const allUsers = [];

            for (let i = 0; i < userIds.length; i += 10) {
                const chunk = userIds.slice(i, i + 10);
                const usersSnap = await getDocs(
                    query(usersCollection, where(documentId(), "in", chunk))
                );
                usersSnap.docs.forEach(u => {
                    allUsers.push({ id: u.id, ...u.data() });
                });
            }

            setPartecipantiByIncontro(prev => ({ ...prev, [incontroId]: allUsers }));
        } catch (error) {
            console.error("Errore caricamento partecipanti:", error);
            setPartecipantiByIncontro(prev => ({ ...prev, [incontroId]: [] }));
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>
                {user?.sesso === "F" ? "Benvenuta" : "Benvenuto"}, {user?.nome}!
            </h1>
            {user?.ruolo === "educato" && (
                <div
                    ref={mapContainerRef}
                    style={{
                        width: "90%",
                        aspectRatio: "3 / 4",
                        height: "fit-content",
                        margin: "0 auto",
                        marginBottom: 30,

                    }}>
                <MapBoard userId={user?.id} containerRef={mapContainerRef} />
                </div>

            )}
            {/* Contenitore con altezza esplicita */}

            {user?.ruolo === "educatore" && (

                <div
                    style={{
                        width: "100%",
                        maxWidth: "100%",
                        margin: "0 auto",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        boxSizing: "border-box",
                        padding: "0px 30px",
                        overflowY: "auto",
                        overflowX: "hidden",
                        marginBottom: 30,
                    }}
                >

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
                                        backgroundColor: "#f5f0e1",
                                        border: "2px solid #8b4513",
                                        borderRadius: "12px",
                                        padding: "15px",
                                        fontFamily: "'Old English Text MT', 'Gothic', serif",
                                        color: "#5a2d0c",
                                        boxShadow: '2px 2px 6px rgba(0,0,0,0.3)',
                                        width: "100%",
                                        maxWidth: 500,
                                        marginBottom: 10,
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
                                            {partecipanti === "loading" ? (
                                                <p style={{ fontStyle: "italic" }}>Caricamento partecipanti...</p>
                                            ) : partecipanti.length > 0 ? (
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

            <button onClick={handleLogout} style={styles.buttonPrimary}>Logout</button>
        </div>
    );
}