import React from "react";
import { useChat } from "../../Context/ChatContext";
import { useLottie } from "lottie-react";
import blobAnimation from "../../assets/Animations/loading-blob.json";
import "./Welcome.css";

const Welcome = () => {
    // Obtenemos el nombre del usuario logueado
    const { usuarioActual } = useChat();

    // Configuramos la animación de Lottie
    const opciones = {
        animationData: blobAnimation,
        loop: true,
        autoplay: true,
    };
    const { View } = useLottie(opciones);

    return (
        <div className="welcome-container">
            {/* 1. El Blob Animado */}
            <div className="welcome-blob-wrapper">
                {View}
            </div>
            
            {/* 2. El Saludo y el Nombre Animado */}
            <div className="welcome-header">
                <span className="welcome-greeting">Bienvenido</span>
                {/* Contenedor con overflow hidden para la animación de caída */}
                <div className="welcome-name-container">
                    <span className="welcome-name">{usuarioActual}</span>
                </div>
            </div>

            {/* 3. El Subtítulo */}
            <p className="welcome-subtitle">¿Qué vamos a hacer hoy?</p>
        </div>
    );
};

export default Welcome;