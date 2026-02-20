import React from "react";
import "./Welcome.css";

const Welcome = () => {
    return (
        <div className="welcome-container">
            <h1 className="welcome-title">👋 Bienvenido</h1>
            <p className="welcome-text">Selecciona un chat de la izquierda para comenzar a chatear o crea uno nuevo.</p>
        </div>
    );
};

export default Welcome;