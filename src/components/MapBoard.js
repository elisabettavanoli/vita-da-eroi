import React, { useState, useEffect } from "react";

export default function MapBoard() {
    const totalCells = 25;

    // Leggi la posizione salvata su localStorage oppure usa 0
    const savedPosition = parseInt(localStorage.getItem("currentPosition"), 10) || 0;
    const [currentPosition, setCurrentPosition] = useState(savedPosition);

    const handleCellClick = (index) => {
        if (index === currentPosition + 1) {
            const confirmMove = window.confirm(`Vuoi spostarti alla casella ${index + 1}?`);
            if (confirmMove) {
                setCurrentPosition(index);
                localStorage.setItem("currentPosition", index); // salva la posizione
            }
        } else {
            alert("Devi seguire l'ordine delle caselle!");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.board}>
                {Array.from({ length: totalCells }).map((_, index) => (
                    <div
                        key={index}
                        style={{
                            ...styles.cell,
                            backgroundColor: index === currentPosition ? "#8B4513" : "#FFF8DC",
                            border: index === currentPosition ? "3px solid #DAA520" : "2px solid #654321",
                        }}
                        onClick={() => handleCellClick(index)}
                    >
                        {index + 1}
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        marginTop: 30,
    },
    board: {
        display: "grid",
        gridTemplateColumns: "repeat(5, 60px)",
        gridAutoRows: "60px",
        gap: "15px",
        justifyContent: "center",
    },
    cell: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "50%",
        cursor: "pointer",
        fontFamily: "'Cinzel', serif",
        fontWeight: "bold",
        boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
        fontSize: "1rem",
        userSelect: "none",
        transition: "all 0.2s ease",
        textAlign: "center",
    },
};