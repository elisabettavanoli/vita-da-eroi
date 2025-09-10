// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginScreen from "./screens/LoginScreen.js";
import HomeScreen from "./screens/HomeScreen.js";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginScreen />} />
                <Route path="/home" element={<HomeScreen />} />
            </Routes>
        </Router>
    );
}