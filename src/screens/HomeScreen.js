// src/screens/HomeScreen.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function HomeScreen() {
    const navigate = useNavigate();
    const location = useLocation();
    const student = location.state?.student;

    const handleLogout = () => navigate("/");

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Benvenuto, {student?.nome}!</h1>
            <p>Sei autenticato come {student?.nome} {student?.cognome}</p>
            <button onClick={handleLogout} style={styles.button}>Logout</button>
        </div>
    );
}

const styles = {
    container: { maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px", textAlign: "center" },
    title: { marginBottom: "20px" },
    button: { padding: "10px 20px", borderRadius: "5px", border: "none", backgroundColor: "#dc3545", color: "white", fontWeight: "bold", cursor: "pointer" }
};