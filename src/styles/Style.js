// src/styles/styles.js

const colors = {
    primary: "#8B4513",       // marrone legno
    secondary: "#DAA520",     // oro
    danger: "#B22222",        // rosso scuro
    border: "#654321",        // marrone scuro
    background: "#F5DEB3",    // colore pergamena
    text: "#3E2723",           // marrone scuro per il testo
};

const spacing = {
    small: 8,
    medium: 12,
    large: 20,
};

export const commonStyles = {
    container: {
        width: "90%",
        maxWidth: 400,
        margin: "50px auto",
        padding: 20,
        borderRadius: 15,
        border: `2px solid ${colors.border}`,
        textAlign: "center",
        boxSizing: "border-box",
        backgroundColor: colors.background,
        fontFamily: "'MedievalSharp', cursive", // font fiabesco, da importare da Google Fonts
        boxShadow: "0 0 10px rgba(0,0,0,0.3)",
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