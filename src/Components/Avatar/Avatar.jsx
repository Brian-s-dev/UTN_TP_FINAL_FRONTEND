import React from "react";
import Lottie from "lottie-react"; // ✨ Volvemos a usar el componente
import blobAnimation from "../../assets/Animations/loading-blob.json";
import "./Avatar.css";

const Avatar = ({ imagen, nombre, isIA }) => {
    return (
        <div className="avatar-circle">
            {isIA ? (
                // ✨ El componente Lottie SOLO se ejecuta si es IA
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