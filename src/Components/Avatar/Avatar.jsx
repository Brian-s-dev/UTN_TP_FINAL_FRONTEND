import React from "react";
import { useLottie } from "lottie-react"; 
import blobAnimation from "../../assets/Animations/loading-blob.json";
import "./Avatar.css";

const AvatarAnimado = () => {
    const opciones = {
        animationData: blobAnimation,
        loop: true,
        autoplay: true,
    };
    const { View } = useLottie(opciones);
    
    return <>{View}</>;
};

// 🧑 COMPONENTE PRINCIPAL
const Avatar = ({ imagen, nombre, isIA }) => {
    const claseCirculo = isIA ? "avatar-circle ia-avatar" : "avatar-circle";

    return (
        <div className={claseCirculo}>
            {isIA ? (
                <div className="avatar-lottie">
                    {/* Al llamar al sub-componente aquí, el hook de Lottie SOLO se ejecuta 1 vez y solo para la IA */}
                    <AvatarAnimado />
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