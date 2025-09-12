import React, { useState, useEffect } from "react";
import { mapStyles } from "../styles/Style.js";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase"; // Assumendo che l'istanza di Firestore sia esportata da qui

export default function MapBoard({ userId }) {
    const totalCells = 25;

    const [currentPosition, setCurrentPosition] = useState(0);
    const [cellStatus, setCellStatus] = useState(Array(totalCells).fill(null));
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        if (!userId) {
            setErrorMessage("Nessun utente selezionato. Per favore, effettua il login o seleziona un utente.");
            setLoading(false);
            return;
        }

        const loadData = async () => {
            try {
                const docRef = doc(db, "spiazzati", userId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setCurrentPosition(typeof data.currentPosition === "number" ? data.currentPosition : 0);
                    setCellStatus(Array.isArray(data.cellStatus) && data.cellStatus.length === totalCells ? data.cellStatus : Array(totalCells).fill(null));
                    setErrorMessage(null);
                } else {
                    setCurrentPosition(0);
                    setCellStatus(Array(totalCells).fill(null));
                    setErrorMessage("Nessun dato trovato per l'utente selezionato.");
                }
            } catch (error) {
                console.error("Errore nel caricamento dati Firestore:", error);
                setCurrentPosition(0);
                setCellStatus(Array(totalCells).fill(null));
                setErrorMessage("Errore durante il caricamento dei dati. Riprova più tardi.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [userId]);

    const saveData = async (newPosition, newCellStatus) => {
        if (!userId) return;
        try {
            const docRef = doc(db, "spiazzati", userId);
            await setDoc(
                docRef,
                {
                    currentPosition: newPosition,
                    cellStatus: newCellStatus,
                },
                { merge: true }
            );
        } catch (error) {
            console.error("Errore nel salvataggio dati Firestore:", error);
        }
    };

    const handleCellClick = (index) => {
        if (index === currentPosition + 1) {
            const confirmParticipation = window.confirm("Hai partecipato all'incontro?");
            const newCellStatus = [...cellStatus];
            if (confirmParticipation) {
                newCellStatus[index] = "yes";
            } else {
                newCellStatus[index] = "no";
            }
            setCellStatus(newCellStatus);
            setCurrentPosition(index);
            saveData(index, newCellStatus);
        } else {
            alert("Devi seguire l'ordine delle caselle!");
        }
    };

    if (loading) {
        return <div>Caricamento...</div>;
    }

    if (errorMessage) {
        return <div>{errorMessage}</div>;
    }

    return (
        <div style={mapStyles.container}>
            <div style={mapStyles.board}>
                {Array.from({ length: totalCells }).map((_, index) => {
                    let backgroundColor;
                    let border;
                    if (cellStatus[index] === "yes") {
                        backgroundColor = "#90EE90";
                        border = "3px solid green";
                    } else if (cellStatus[index] === "no") {
                        backgroundColor = "#F08080";
                        border = "3px solid red";
                    } else {
                        backgroundColor = index === currentPosition ? "#8B4513" : "#FFF8DC";
                        border = index === currentPosition ? "3px solid #DAA520" : "2px solid #654321";
                    }
                    const cols = 4; // numero di colonne
                    const row = Math.floor(index / cols);
                    const colInRow = index % cols;
                    const displayNumber = row % 2 === 0 ? index + 1 : row * cols + (cols - colInRow);
                    return (
                        <div
                            key={index}
                            style={{
                                ...mapStyles.cell,
                                backgroundColor,
                                border,
                            }}
                            onClick={() => handleCellClick(index)}
                        >
                            {displayNumber}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}