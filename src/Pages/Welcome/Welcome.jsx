import React from "react";
import { useChat } from "../../Context/ChatContext";
import { useLottie } from "lottie-react"; // ✨ Volvemos al hook seguro
import blobAnimation from "../../assets/Animations/loading-blob.json";
import "./Welcome.css";

const Welcome = () => {
    const { usuarioActual } = useChat();

    const opciones = {
        animationData: blobAnimation,
        loop: true,
        autoplay: true,
        initialSegment: [0, 120] 
    };
    
    const { View } = useLottie(opciones);

    return (
        <div className="welcome-container">
            <div className="welcome-blob-wrapper">
                {View}
            </div>
            
            <div className="welcome-header">
                <span className="welcome-greeting">Bienvenido</span>
                <div className="welcome-name-container">
                    <span className="welcome-name">{usuarioActual}</span>
                </div>
            </div>

            <p className="welcome-subtitle">¿Qué vamos a hacer hoy?</p>
        </div>
    );
};

export default Welcome;