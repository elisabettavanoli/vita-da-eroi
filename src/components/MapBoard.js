import React, { useState, useEffect, useRef } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { collection, getDocs, query, orderBy, where, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import cavaliereImg from "../assets/cavaliere.png";
import mapImg from "../assets/infinityMap.png";

export default function MapBoard({ userId, readonly = false, containerRef }) {
    const [incontri, setIncontri] = useState([]);
    const [cellStatus, setCellStatus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mapSize, setMapSize] = useState({ width: 0, height: 0 });
    const [initialScale, setInitialScale] = useState(1);
    const [ready, setReady] = useState(false);

    const transformWrapperRef = useRef(null); // ✅ aggiungi questo

    // ... resto del codice

    // 🔹 Carica dimensione immagine
    useEffect(() => {
        const img = new Image();
        img.src = mapImg;
        img.onload = () => setMapSize({ width: img.width, height: img.height });
    }, []);

    // 🔹 Calcola scala iniziale in base al container passato da HomeScreen
    useEffect(() => {
        const calcScale = () => {
            if (mapSize.width && mapSize.height && containerRef?.current) {
                const containerWidth = containerRef.current.clientWidth;
                const containerHeight = containerRef.current.clientHeight;
                const scaleX = containerWidth / mapSize.width;
                const scaleY = containerHeight / mapSize.height;
                const scale = Math.max(scaleX, scaleY) * 1.05;
                setInitialScale(scale);
                setReady(true);
            }
        };

        // Esegui il calcolo una volta che tutto è pronto
        setTimeout(calcScale, 100);

        // Aggiorna in caso di resize
        window.addEventListener("resize", calcScale);
        return () => window.removeEventListener("resize", calcScale);
    }, [mapSize, containerRef]);

    // 🔹 Carica incontri e stati dell’utente
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

    if (loading || !ready) return <div>Caricamento mappa...</div>;

    // 🔹 Determina la prossima cella da sbloccare
    const lastCompletedIndex = Math.max(
        ...cellStatus.map((s, i) => (s === "yes" || s === "no" ? i : -1))
    );
    const nextIndex = lastCompletedIndex + 1;

    // 🔹 Gestione click cella
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

    // 🔹 Render mappa
    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                border: "2px solid #ccc",
                overflow: "hidden",
                backgroundColor: "#E8DBC6",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <TransformWrapper
                initialScale={initialScale}
                minScale={initialScale * 0.5}
                maxScale={3}
                centerOnInit
                limitToBounds={false} // prevent white borders
                wheel={{ step: 50 }}
                pan={{ velocity: true }}
                ref={transformWrapperRef} // crea ref con useRef()
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
                            const { x, y } = incontro.posizione;
                            const stato = cellStatus[index];

                            let bgColor = "#d3d3d3";
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
                                        border: isCurrent
                                            ? "3px solid #ffd700"
                                            : "3px solid transparent",
                                        boxSizing: "border-box",
                                        cursor:
                                            index === nextIndex && !readonly
                                                ? "pointer"
                                                : "default",
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