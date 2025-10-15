// src/styles/styles.js

const colors = {
    primary: "#8B4513",       // marrone legno
    secondary: "#DAA520",     // oro
    danger: "#B22222",        // rosso scuro
    border: "#654321",        // marrone scuro
    background: "#F5DEB3",    // colore pergamena
    text: "#3E2723",
    green: "#00af0b"// marrone scuro per il testo
};

const spacing = {
    small: 8,
    medium: 12,
    large: 20,
};

export const commonStyles = {
    container: {
        width: "90%",
        margin: "5vh auto",
        padding: 20,
        borderRadius: 15,
        border: `2px solid ${colors.border}`,
        textAlign: "center",
        boxSizing: "border-box",
        backgroundColor: colors.background,
        fontFamily: "'MedievalSharp', cursive", // font fiabesco, da importare da Google Fonts
        boxShadow: "0 0 10px rgba(0,0,0,0.3)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "90vh",
    },
    title: {
        fontSize: "2rem",
        marginBottom: 20,
        color: colors.primary,
        textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",

    },
    input: {
        padding: spacing.medium,
        marginBottom: spacing.large,
        borderRadius: 8,
        border: `2px solid ${colors.border}`,
        fontSize: "1.1rem",
        fontFamily: "'Cinzel', serif",
        backgroundColor: "#FFF8DC",
        boxShadow: "inset 0 0 5px rgba(0,0,0,0.1)",
        width: "100%",

    },
    buttonPrimary: {
        padding: spacing.medium,
        borderRadius: 10,
        border: `2px solid ${colors.border}`,
        backgroundColor: colors.primary,
        color: colors.background,
        fontWeight: "bold",
        fontSize: "1.1rem",
        cursor: "pointer",
        fontFamily: "'Cinzel', serif",
        boxShadow: "0 3px 6px rgba(0,0,0,0.3)",
        transition: "all 0.2s ease",
        width: "fit-content",
        marginBottom: 20,
    },
    buttonPrimaryHover: {
        backgroundColor: colors.secondary,
        color: colors.text,
    },
    buttonDanger: {
        padding: spacing.medium,
        borderRadius: 10,
        border: `2px solid ${colors.border}`,
        backgroundColor: colors.danger,
        color: colors.background,
        fontWeight: "bold",
        fontSize: "1.1rem",
        cursor: "pointer",
        fontFamily: "'Cinzel', serif",
        boxShadow: "0 3px 6px rgba(0,0,0,0.3)",
        transition: "all 0.2s ease",
    },
    errorText: {
        color: colors.danger,
        marginTop: 10,
        fontSize: "0.95rem",
        fontFamily: "'Cinzel', serif",
    },


};

export const mapStyles = {
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        marginBottom: 20,
    },
    board: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(50px, 1fr))",
        gridAutoRows: "minmax(40px, 1fr)",
        maxWidth: "90%",
        gap: "12px",
        justifyContent: "center",
        padding: "30px",
    },
    cell: {
        aspectRatio: "1/1",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "50%",
        cursor: "pointer",
        fontFamily: "'Cinzel', serif",
        fontWeight: "bold",
        boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
        fontSize: "1.2rem",
        userSelect: "none",
        transition: "all 0.2s ease",
        textAlign: "center",
        position: "relative",   // Added to allow absolute positioning of knight image

    },

    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: colors.background,
        padding: 30,
        borderRadius: 15,
        border: `3px solid ${colors.border}`,
        boxShadow: "0 0 15px rgba(0,0,0,0.5)",
        fontFamily: "'Cinzel', serif",
        textAlign: "center",
        maxWidth: "400px",
        width: "90%",
    },
    modalButtonContainer: {
        marginTop: 25,
        display: "flex",
        justifyContent: "space-around",
    },
    modalButtonYes: {
        padding: spacing.medium,
        borderRadius: 10,
        border: `2px solid ${colors.border}`,
        backgroundColor: colors.green,
        color: colors.background,
        fontWeight: "bold",
        fontSize: "1.1rem",
        cursor: "pointer",
        fontFamily: "'Cinzel', serif",
        boxShadow: "0 3px 6px rgba(0,0,0,0.3)",
        transition: "all 0.2s ease",
        width: "120px",
    },
    modalButtonNo: {
        padding: spacing.medium,
        borderRadius: 10,
        border: `2px solid ${colors.border}`,
        backgroundColor: colors.danger,
        color: colors.background,
        fontWeight: "bold",
        fontSize: "1.1rem",
        cursor: "pointer",
        fontFamily: "'Cinzel', serif",
        boxShadow: "0 3px 6px rgba(0,0,0,0.3)",
        transition: "all 0.2s ease",
        width: "120px",
    },
    modalKnightAbove: {
        position: "absolute",
        top: "-10px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "40px",
        height: "40px",
        zIndex: 10,
        pointerEvents: "none",
    },

    knightAboveContainer: {
        display: "flex",
        justifyContent: "center",
        marginBottom: 10,
    },

    resetButton: {
        display: "block",
        margin: "10px auto",
        padding: "8px 16px",
        fontSize: "16px",
        cursor: "pointer",
        borderRadius: 10,
        border: `2px solid ${colors.border}`,
        backgroundColor: colors.secondary,
        color: colors.text,
        fontWeight: "bold",
        fontFamily: "'Cinzel', serif",
        boxShadow: "0 3px 6px rgba(0,0,0,0.3)",
        transition: "all 0.2s ease",
    },

    cellContent: {
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
    },

    cellKnight: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        maxWidth: "60%",
        maxHeight: "60%",
        objectFit: "contain",
        pointerEvents: "none",
        userSelect: "none",
    },

    aboveKnight: {
        width: "40%",
        height: "40%",
    }
}