import React, { useState, useEffect, useRef } from "react";
// Stili per i bottoni e il container del modal
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { collection, getDocs, query, orderBy, where, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import cavaliereImg from "../assets/cavaliere.png";
import mapImg from "../assets/infinityMap.png";

export default function MapBoard({ userId, readonly = false, containerRef }) {
    // All hooks at the top!
    const [incontri, setIncontri] = useState([]);
    const [cellStatus, setCellStatus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mapSize, setMapSize] = useState({ width: 0, height: 0 });
    const [initialScale, setInitialScale] = useState(1);
    const [ready, setReady] = useState(false);
    const [modalData, setModalData] = useState(null);
    // Stato per animazione cavaliere
    const [isMoving, setIsMoving] = useState(false);
    const prevCavaliereIndexRef = useRef(null);
    const transformWrapperRef = useRef(null);

    const mapStyles = {
        modalButtonContainer: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            marginTop: "20px"
        }
    };

    // Carica dimensione immagine
    useEffect(() => {
        const img = new Image();
        img.src = mapImg;
        img.onload = () => setMapSize({ width: img.width, height: img.height });
    }, []);

    // Calcola scala iniziale in base al container passato da HomeScreen
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
        setTimeout(calcScale, 100);
        window.addEventListener("resize", calcScale);
        return () => window.removeEventListener("resize", calcScale);
    }, [mapSize, containerRef]);

    // Carica incontri e stati dell’utente
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

    // Determina la cella corrente del cavaliere
    const cavaliereIndex = Math.max(
        ...cellStatus.map((s, i) => (s === "yes" || s === "no" ? i : -1))
    );

    // Gestione stato animazione cavaliere
    useEffect(() => {
        // Solo se il cavaliere si è spostato (non al primo render)
        if (prevCavaliereIndexRef.current !== null && prevCavaliereIndexRef.current !== cavaliereIndex) {
            setIsMoving(true);
            const timeout = setTimeout(() => setIsMoving(false), 1200); // durata animazione = 1.2s
            return () => clearTimeout(timeout);
        }
        prevCavaliereIndexRef.current = cavaliereIndex;
    }, [cavaliereIndex]);

    // Determina la prossima cella da sbloccare (subito dopo quella del cavaliere, eccetto la prima)
    const nextIndex = cavaliereIndex === -1 ? 0 : cavaliereIndex + 1;

    // Gestione click cella
    const handleCellClick = (index) => {
        if (readonly) return;
        const isPrevious = index <= cavaliereIndex;
        const isNext = index === nextIndex;
        if (!isNext && !isPrevious)
            return alert("Puoi cliccare solo la prossima cella o modificarne una già completata!");
        setModalData({
            index,
            incontro: incontri[index],
            statoAttuale: cellStatus[index],
        });
    };

    const handleModalClose = () => {
        setModalData(null);
    };

    const handleModalChoice = async (choice) => {
        if (!modalData) return;
        const { index, incontro } = modalData;
        const newStatus = [...cellStatus];
        newStatus[index] = choice;
        setCellStatus(newStatus);
        await setDoc(
            doc(db, "partecipazioni", `${userId}_${incontro.id}`),
            { userId, incontroId: incontro.id, stato: choice },
            { merge: true }
        );
        setModalData(null);
    };

    // Funzione per ottenere coordinate percentuali al click
    const handleMapClick = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const xPx = event.clientX - rect.left;
        const yPx = event.clientY - rect.top;
        const xPercent = (xPx / rect.width) * 100;
        const yPercent = (yPx / rect.height) * 100;
        console.log(`Coordinate percentuali: x=${xPercent.toFixed(2)}%, y=${yPercent.toFixed(2)}%`);
    };

    if (loading || !ready) return <div>Caricamento mappa...</div>;

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
                limitToBounds={false}
                wheel={{ step: 50 }}
                pan={{ velocity: true }}
                ref={transformWrapperRef}
            >
                <TransformComponent>
                    <div
                        style={{
                            position: "relative",
                            width: `${mapSize.width}px`,
                            height: `${mapSize.height}px`,
                        }}
                        onClick={handleMapClick}
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
                            const isCurrent = index === cavaliereIndex;
                            return (
                                <div
                                    key={incontro.id}
                                    onClick={() => handleCellClick(index)}
                                    title={incontro.titolo}
                                    style={{
                                        position: "absolute",
                                        left: `${x}%`,
                                        top: `${y}%`,
                                        width: "120px",
                                        height: "120px",
                                        borderRadius: "50%",
                                        backgroundColor: bgColor,
                                        boxShadow: "0 6px 12px rgba(0,0,0,0.4)",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        fontWeight: "bolder",
                                        fontSize: "50px",
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
                                        <>
                                            {/* Ombra sotto il cavaliere */}
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    top: "69%",
                                                    left: "50%",
                                                    width: "48px",
                                                    height: "18px",
                                                    background: "radial-gradient(ellipse at center, rgba(0,0,0,0.22) 65%, rgba(0,0,0,0.08) 100%)",
                                                    borderRadius: "50%",
                                                    transform: "translate(-50%, -50%)",
                                                    zIndex: 0,
                                                    pointerEvents: "none",
                                                    filter: "blur(0.6px)"
                                                }}
                                            />
                                            <img
                                                src={cavaliereImg}
                                                alt={incontro.titolo}
                                                style={{
                                                    position: "absolute",
                                                    top: "50%",
                                                    left: "50%",
                                                    width: "80px",
                                                    height: "80px",
                                                    transform: "translate(-50%, -50%)",
                                                    pointerEvents: "none",
                                                    boxShadow: "0 10px 24px 0px rgba(0,0,0,0.55)",
                                                    animation: isMoving
                                                        ? "cavaliereRearing 1.2s infinite cubic-bezier(.4,0,.6,1)"
                                                        : "none",
                                                }}
                                            />
                                        </>
                                    )}
                                    {/* Animazione cavaliere che impenna */}
                                    <style>
                                        {`
                                        @keyframes cavaliereRearing {
                                            0% {
                                                transform: translate(-50%, -50%) rotate(-10deg) scale(1);
                                            }
                                            20% {
                                                transform: translate(-50%, -50%) rotate(-18deg) scale(1.04);
                                            }
                                            45% {
                                                transform: translate(-50%, -50%) rotate(13deg) scale(1.13);
                                            }
                                            70% {
                                                transform: translate(-50%, -50%) rotate(-14deg) scale(1.04);
                                            }
                                            100% {
                                                transform: translate(-50%, -50%) rotate(-10deg) scale(1);
                                            }
                                        }
                                        `}
                                    </style>
                                    <span style={{ zIndex: 1 }}>{index + 1}</span>
                                </div>
                            );
                        })}
                    </div>
                </TransformComponent>
            </TransformWrapper>
            {modalData && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1000,
                }}>
                    <div style={{
                        backgroundColor: "#e6dabb",
                        padding: "20px",
                        borderRadius: "10px",
                        maxWidth: "280px",
                        width: "90%",
                        textAlign: "center",
                    }}>
                        <h2>Hai partecipato all'incontro "{modalData.incontro.titolo}"?</h2>
                        <div style={mapStyles.modalButtonContainer}>
                            <button
                                onClick={() => handleModalChoice("no")}
                                style={{
                                    backgroundColor: "#f44336",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "8px",
                                    fontFamily: "'Cinzel', serif",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                                    width: "90px",
                                    height: "40px",
                                    padding: "4px 0",
                                    marginBottom: "14px",
                                    fontWeight: "bold",
                                    fontSize: "20px",
                                    cursor: "pointer",
                                    transition: "background 0.2s, box-shadow 0.2s, transform 0.2s",
                                }}
                            >
                                No
                            </button>
                            <button
                                onClick={() => handleModalChoice("yes")}
                                style={{
                                    backgroundColor: "#4caf50",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "8px",
                                    fontFamily: "'Cinzel', serif",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                                    width: "90px",
                                    height: "40px",
                                    padding: "4px 0",
                                    marginBottom: "14px",
                                    fontWeight: "bold",
                                    fontSize: "20px",
                                    cursor: "pointer",
                                    transition: "background 0.2s, box-shadow 0.2s, transform 0.2s",
                                }}
                            >
                                Sì
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}