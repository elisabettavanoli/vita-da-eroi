import React, { useState, useEffect } from "react";
import { mapStyles } from "../styles/Style.js";
import { collection, getDocs, doc, getDoc, setDoc, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import cavaliereImg from "../assets/cavaliere.png";

export default function MapBoard({ userId, readonly = false }) {
    const cols = 4;
    const [incontri, setIncontri] = useState([]);
    const [currentPosition, setCurrentPosition] = useState(0);
    const [cellStatus, setCellStatus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    const zigzagOrder = [];
    const totalCells = incontri.length;
    for (let row = 0; row < Math.ceil(totalCells / cols); row++) {
        if (row % 2 === 0) {
            for (let col = 0; col < cols; col++) {
                const index = row * cols + col;
                if (index < totalCells) zigzagOrder.push(index);
            }
        } else {
            for (let col = cols - 1; col >= 0; col--) {
                const index = row * cols + col;
                if (index < totalCells) zigzagOrder.push(index);
            }
        }
    }

    useEffect(() => {
        if (!userId) {
            setErrorMessage("Nessun utente selezionato.");
            setLoading(false);
            return;
        }

        const loadIncontriAndData = async () => {
            setLoading(true);
            try {
                const q = query(collection(db, "incontri"), orderBy("numero"));
                const incontriSnapshot = await getDocs(q);
                const incontriList = incontriSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setIncontri(incontriList);

                // Initialize cellStatus array with nulls
                let statusArray = Array(incontriList.length).fill(null);

                // Query partecipazioni for the user
                const partecipazioniQuery = query(collection(db, "partecipazioni"), where("userId", "==", userId));
                const partecipazioniSnapshot = await getDocs(partecipazioniQuery);

                partecipazioniSnapshot.forEach(docSnap => {
                    const data = docSnap.data();
                    const index = incontriList.findIndex(incontro => incontro.id === data.incontroId);
                    if (index !== -1) {
                        statusArray[index] = data.stato || null;
                    }
                });

                setCellStatus(statusArray);

                // Determine currentPosition as the last completed cell (yes or no), or 0 if none
                let lastCompletedIndex = -1;
                for (let i = 0; i < statusArray.length; i++) {
                    if (statusArray[i] === "yes" || statusArray[i] === "no") {
                        lastCompletedIndex = i;
                    }
                }
                // Position should be next cell after last completed, or 0 if none completed
                let newPosition = 0;
                if (lastCompletedIndex !== -1 && lastCompletedIndex + 1 < incontriList.length) {
                    newPosition = lastCompletedIndex + 1;
                } else if (lastCompletedIndex !== -1) {
                    newPosition = lastCompletedIndex;
                }
                setCurrentPosition(newPosition);

                setErrorMessage(null);
            } catch (err) {
                console.error(err);
                setCellStatus([]);
                setCurrentPosition(0);
                setErrorMessage("Errore durante il caricamento dei dati.");
            } finally {
                setLoading(false);
            }
        };

        loadIncontriAndData();
    }, [userId]);

    const handleCellClick = async (index) => {
        if (readonly) return;
        const currentZigzagIndex = zigzagOrder.indexOf(currentPosition);
        const nextZigzagIndex = currentZigzagIndex + 1;
        if (nextZigzagIndex < zigzagOrder.length && index === zigzagOrder[nextZigzagIndex]) {
            const conferma = window.confirm("Hai partecipato all'incontro?");
            const stato = conferma ? "yes" : "no";
            const newCellStatus = [...cellStatus];
            newCellStatus[index] = stato;
            setCellStatus(newCellStatus);
            setCurrentPosition(index);

            const nextIncontro = incontri[index];
            await setDoc(
                doc(db, "partecipazioni", `${userId}_${nextIncontro.id}`),
                { userId, incontroId: nextIncontro.id, stato },
                { merge: true }
            );
        } else {
            alert("Devi seguire l'ordine delle caselle!");
        }
    };

    const handleReset = async () => {
        const resetStatus = Array(cellStatus.length).fill(null);
        setCellStatus(resetStatus);
        setCurrentPosition(0);
        for (let i = 0; i < incontri.length; i++) {
            const nextIncontro = incontri[i];
            await setDoc(
                doc(db, "partecipazioni", `${userId}_${nextIncontro.id}`),
                { userId, incontroId: nextIncontro.id, stato: null },
                { merge: true }
            );
        }
    };

    if (loading) return <div>Caricamento...</div>;
    if (errorMessage) return <div>{errorMessage}</div>;

    // Board style: make it wider and centered, even for readonly
    const boardStyle = {
        ...mapStyles.board,
        gridTemplateColumns: `repeat(${cols}, minmax(60px, 1fr))`,
        maxWidth: 400,
        margin: "0 auto",
    };
    return (
        <div style={mapStyles.container}>
            <div style={boardStyle}>
                {incontri.map((incontro, index) => {
                    let backgroundColor;
                    let border;
                    if (cellStatus[index] === "yes") {
                        backgroundColor = "#90EE90";
                        border = "3px solid green";
                    } else if (cellStatus[index] === "no") {
                        backgroundColor = "#F08080";
                        border = "3px solid red";
                    } else {
                        backgroundColor = "#FFF8DC";
                        border = "2px solid #654321";
                    }
                    // If not readonly, highlight current position differently
                    if (!readonly && cellStatus[index] === null) {
                        backgroundColor = index === currentPosition ? "#8B4513" : backgroundColor;
                        border = index === currentPosition ? "3px solid #DAA520" : border;
                    }

                    return (
                        <div
                            key={incontro.id}
                            style={{ ...mapStyles.cell, backgroundColor, border, display: "flex", justifyContent: "center", alignItems: "center", cursor: readonly ? "default" : "pointer" }}
                            onClick={() => { if (!readonly) handleCellClick(index); }}
                        >
                            {!readonly && index === currentPosition ? (
                                <img src={cavaliereImg} alt="Cavaliere" style={{ maxWidth: "80%", maxHeight: "80%", objectFit: "contain" }} />
                            ) : (
                                incontro.numero
                            )}
                        </div>
                    );
                })}
            </div>
            {/*<button onClick={handleReset} style={{ display: "block", margin: "10px auto", padding: "8px 16px", fontSize: "16px", cursor: "pointer" }}>
                Reset Mappa
            </button>*/}
        </div>
    );
}
