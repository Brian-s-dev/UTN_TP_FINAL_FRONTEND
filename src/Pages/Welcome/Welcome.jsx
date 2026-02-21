import React from "react";
import { useChat } from "../../Context/ChatContext";
import Lottie from "lottie-react"; // ✨ Importamos el componente directo en lugar del hook
import blobAnimation from "../../assets/Animations/loading-blob.json";
import "./Welcome.css";

const Welcome = () => {
    const { usuarioActual } = useChat();

    return (
        <div className="welcome-container">
            <div className="welcome-blob-wrapper">
                {/* ✨ El componente directo suele manejar los loops de forma mucho más fluida */}
                <Lottie 
                    animationData={blobAnimation} 
                    loop={true} 
                    autoplay={true} 
                    /* 💡 TRUCO PRO: Si el blob sigue desapareciendo, es porque el JSON tiene frames 
                       vacíos al final. Descomenta la línea de abajo y ajusta el segundo número 
                       (ej: si la animación dura 120 frames, pon 90 o 100) para cortarla antes 
                       de que desaparezca y forzar el loop perfecto. */
                    // initialSegment={[0, 90]} 
                />
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