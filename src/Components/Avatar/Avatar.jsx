import React from "react";
import Lottie from "lottie-react";
import blobAnimation from "../../assets/Animations/loading-blob.json";
import "./Avatar.css";

const Avatar = ({ imagen, nombre, isIA }) => {
    // ✨ Calculamos la clase dinámicamente
    // Si es IA, agregamos una clase extra para poder darle estilos únicos
    const claseCirculo = isIA ? "avatar-circle ia-avatar" : "avatar-circle";

    return (
        <div className={claseCirculo}>
            {isIA ? (
                <div className="avatar-lottie">
                    <Lottie 
                        animationData={blobAnimation} 
                        loop={true} 
                        autoplay={true} 
                    />
                </div>
            ) : imagen ? (
                <img src={imagen} alt={`Avatar de ${nombre}`} className="avatar-img" />
            ) : (
                nombre?.charAt(0).toUpperCase() || "?"
            )}
        </div>
    );
};

export default Avatar;