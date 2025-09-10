// src/screens/HomeScreen.js
import React from "react";
import { useNavigate, useLocation } from "react-router-dom"; // ⚠ Import mancanti
import { commonStyles as styles } from "../styles/Style.js";   // ⚠ Assicurati che il nome del file sia styles.js
import MapBoard from "../components/MapBoard";

export default function HomeScreen() {
    const navigate = useNavigate();
    const location = useLocation();
    const student = location.state?.student;

    const handleLogout = () => navigate("/");

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Benvenuto, {student?.nome}!</h1>
            {/* Mappa interattiva */}
            <MapBoard />
            <button onClick={handleLogout} style={styles.buttonPrimary}>Logout</button>
        </div>
    );
}