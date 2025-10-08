import React, { useState, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { collection, getDocs, query, orderBy, where, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import cavaliereImg from "../assets/cavaliere.png";
import mapImg from "../assets/map.jpg";

export default function MapBoard({ userId, readonly = false }) {
    const [incontri, setIncontri] = useState([]);
    const [cellStatus, setCellStatus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mapSize, setMapSize] = useState({ width: 0, height: 0 });

    // Carica dimensione immagine
    useEffect(() => {
        const img = new Image();
        img.src = mapImg;
        img.onload = () => setMapSize({ width: img.width, height: img.height });
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const q = query(collection(db, "incontri"), orderBy("numero"));
                const snapshot = await getDocs(q);
                const incontriList = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setIncontri(incontriList);

                const partecipazioniQuery = query(
                    collection(db, "partecipazioni"),
                    where("userId", "==", userId)
                );
                const snapshotPartecipazioni = await getDocs(partecipazioniQuery);
                const statusArray = incontriList.map((inc) => {
                    const p = snapshotPartecipazioni.docs.find(
                        (d) => d.data().incontroId === inc.id
                    );
                    return p ? p.data().stato : null;
                });
                setCellStatus(statusArray);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (userId) loadData();
    }, [userId]);

    if (loading || mapSize.width === 0) return <div>Caricamento mappa...</div>;

    const lastCompletedIndex = Math.max(
        ...cellStatus.map((s, i) => (s === "yes" || s === "no" ? i : -1))
    );
    const nextIndex = lastCompletedIndex + 1;

    const handleCellClick = (index) => {
        if (readonly) return;
        if (index !== nextIndex)
            return alert("Devi cliccare la prossima cella disponibile!");

        const stato = window.confirm("Hai partecipato a questo incontro?")
            ? "yes"
            : "no";

        const newStatus = [...cellStatus];
        newStatus[index] = stato;
        setCellStatus(newStatus);

        const nextIncontro = incontri[index];
        setDoc(
            doc(db, "partecipazioni", `${userId}_${nextIncontro.id}`),
            { userId, incontroId: nextIncontro.id, stato },
            { merge: true }
        );
    };

    return (
        <div
            style={{
                width: "100%",
                height: "70vh",
                border: "2px solid #ccc",
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f8f8f8",
            }}
        >
            <TransformWrapper
                initialScale={1}
                minScale={0.5}
                maxScale={3}
                wheel={{ step: 50 }}
                pan={{ velocity: true }}
                centerOnInit
                limitToBounds={true} // blocca pan oltre i bordi
                centerContent={true} // centra la mappa inizialmente
            >
                <TransformComponent>
                    <div
                        style={{
                            position: "relative",
                            width: `${mapSize.width}px`,
                            height: `${mapSize.height}px`,
                        }}
                    >
                        <img
                            src={mapImg}
                            alt="Mappa"
                            style={{ width: "100%", height: "100%", display: "block" }}
                        />

                        {incontri.map((incontro, index) => {
                            if (!incontro.posizione) return null;

                            const x = incontro.posizione.x;
                            const y = incontro.posizione.y;

                            const stato = cellStatus[index];
                            let bgColor = "#d3d3d3"; // neutro
                            if (stato === "yes") bgColor = "#4caf50";
                            else if (stato === "no") bgColor = "#f44336";

                            const isCurrent = index === nextIndex;

                            return (
                                <div
                                    key={incontro.id}
                                    onClick={() => handleCellClick(index)}
                                    title={incontro.titolo}
                                    style={{
                                        position: "absolute",
                                        left: `${x}%`,
                                        top: `${y}%`,
                                        width: "60px",
                                        height: "60px",
                                        borderRadius: "50%",
                                        backgroundColor: bgColor,
                                        boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        fontWeight: "bold",
                                        fontSize: "14px",
                                        userSelect: "none",
                                        transform: isCurrent
                                            ? "translate(-50%, -50%) scale(1.1)"
                                            : "translate(-50%, -50%)",
                                        border: isCurrent ? "3px solid #ffd700" : "3px solid transparent",
                                        boxSizing: "border-box",
                                        cursor: index === nextIndex && !readonly ? "pointer" : "default",
                                        transition: "transform 0.2s ease, border 0.2s ease",
                                    }}
                                >
                                    {isCurrent && (
                                        <img
                                            src={cavaliereImg}
                                            alt={incontro.titolo}
                                            style={{
                                                position: "absolute",
                                                top: "50%",
                                                left: "50%",
                                                width: "40px",
                                                height: "40px",
                                                transform: "translate(-50%, -50%)",
                                                pointerEvents: "none",
                                            }}
                                        />
                                    )}
                                    <span style={{ zIndex: 1 }}>{index + 1}</span>
                                </div>
                            );
                        })}
                    </div>
                </TransformComponent>
            </TransformWrapper>
        </div>
    );
}