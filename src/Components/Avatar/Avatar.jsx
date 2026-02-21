import React from "react";
import { useLottie } from "lottie-react";
import blobAnimation from "../../assets/Animations/loading-blob.json";
import "./Avatar.css";

const Avatar = ({ imagen, nombre, isIA }) => {
    const opciones = {
        animationData: blobAnimation,
        loop: true,
        autoplay: true,
    };
    const { View } = useLottie(opciones);

    return (
        <div className="avatar-circle">
            {isIA ? (
                <div className="avatar-lottie">{View}</div>
            ) : imagen ? (

                <img src={imagen} alt={`Avatar de ${nombre}`} className="avatar-img" />
            ) : (
                nombre?.charAt(0).toUpperCase() || "?"
            )}
        </div>
    );
};

export default Avatar;