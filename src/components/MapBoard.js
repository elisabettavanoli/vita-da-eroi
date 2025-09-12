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
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);

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

                // Trova l'ultima cella completata
                let lastCompletedIndex = -1;
                for (let i = 0; i < statusArray.length; i++) {
                    if (statusArray[i] === "yes" || statusArray[i] === "no") {
                        lastCompletedIndex = i;
                    }
                }

// Se nessuna cella completata, il cavaliere rimane sopra la griglia (isFirstMove)
                let newPosition = lastCompletedIndex !== -1 ? lastCompletedIndex : 0;

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

    const handleCellClick = (index) => {
        if (readonly) return;
        const isFirstMove = cellStatus.every(status => status === null);
        const currentZigzagIndex = zigzagOrder.indexOf(currentPosition);
        const clickedZigzagIndex = zigzagOrder.indexOf(index);

        // Allow click only if it's the next in zigzag order after currentPosition, or first move at index 0
        if ((isFirstMove && index === 0) || (clickedZigzagIndex === currentZigzagIndex + 1)) {
            setSelectedIndex(index);
            setModalOpen(true);
        } else {
            alert("Devi seguire l'ordine delle caselle!");
        }
    };

    const handleModalResponse = async (confirm) => {
        if (selectedIndex === null) {
            setModalOpen(false);
            return;
        }
        const stato = confirm ? "yes" : "no";
        const newCellStatus = [...cellStatus];
        newCellStatus[selectedIndex] = stato;
        setCellStatus(newCellStatus);
        setCurrentPosition(selectedIndex);

        const nextIncontro = incontri[selectedIndex];
        await setDoc(
            doc(db, "partecipazioni", `${userId}_${nextIncontro.id}`),
            { userId, incontroId: nextIncontro.id, stato },
            { merge: true }
        );
        setModalOpen(false);
        setSelectedIndex(null);
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

    const isFirstMove = cellStatus.every(status => status === null);

    // Board style: make it wider and centered, even for readonly
    const boardStyle = {
        ...mapStyles.board,
    };
    return (
        <div style={mapStyles.container}>
            {isFirstMove && !readonly && (
                <div style={mapStyles.knightAboveContainer}>
                    <img src={cavaliereImg} alt="Cavaliere" style={mapStyles.cellKnight} />
                </div>
            )}
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

                    return (
                        <div
                            key={incontro.id}
                            style={{
                                ...mapStyles.cell,
                                backgroundColor,
                                border,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                cursor: readonly ? "default" : "pointer",
                                position: "relative"
                            }}
                            onClick={() => { if (!readonly) handleCellClick(index); }}
                        >
                            {incontro.numero}
                            {!readonly && !isFirstMove && index === currentPosition && (
                                <img
                                    src={cavaliereImg}
                                    alt="Cavaliere"
                                    style={mapStyles.cellKnight}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
            <button onClick={handleReset} style={mapStyles.resetButton}>
                Reset Mappa
            </button>
            {modalOpen && (
                <div style={mapStyles.modalOverlay}>
                    <div style={mapStyles.modalContent}>
                        <p>Hai partecipato all'incontro {incontri[selectedIndex].numero}: "{incontri[selectedIndex].titolo}"?</p>
                        <div style={mapStyles.modalButtonContainer}>
                            <button onClick={() => handleModalResponse(false)} style={mapStyles.modalButtonNo}>No</button>
                            <button onClick={() => handleModalResponse(true)} style={mapStyles.modalButtonYes}>Sì</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
