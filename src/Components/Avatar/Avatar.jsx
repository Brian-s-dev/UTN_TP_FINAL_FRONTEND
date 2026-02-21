import React from "react";
import { useLottie } from "lottie-react";
import blobAnimation from "../../assets/Animations/loading-blob.json";
import "./Avatar.css";

const Avatar = ({ imagen, nombre, isIA }) => {
    // Configuramos el Lottie para el avatar
    const opciones = {
        animationData: blobAnimation,
        loop: true,
        autoplay: true,
    };
    const { View } = useLottie(opciones);

    return (
        <div className="avatar-circle">
            {isIA ? (
                // Si es IA, mostramos el Lottie
                <div className="avatar-lottie">{View}</div>
            ) : imagen ? (
                // Si es un contacto normal con imagen
                <img src={imagen} alt={`Avatar de ${nombre}`} className="avatar-img" />
            ) : (
                // Si no tiene imagen, mostramos su inicial
                nombre?.charAt(0).toUpperCase() || "?"
            )}
        </div>
    );
};

export default Avatar;