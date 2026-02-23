import React from "react";
import "./Avatar.css";

const COLORES_AVATAR = [
    "#00a884", "#007bfc", "#ff2e74", "#7f66ff", 
    "#ffbc38", "#009de2", "#ea0038", "#1fa855", 
    "#53bdeb", "#ff8a8c", "#a695c7", "#f3a731"
];

const obtenerColorPorNombre = (nombre) => {
    if (!nombre) return "#ccc";
    
    let hash = 0;
    for (let i = 0; i < nombre.length; i++) {
        hash = nombre.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const indice = Math.abs(hash) % COLORES_AVATAR.length;
    return COLORES_AVATAR[indice];
};

const obtenerIniciales = (nombre) => {
    if (!nombre) return "";
    
    const palabras = nombre.trim().split(" ");
    if (palabras.length >= 2) {
        return (palabras[0][0] + palabras[1][0]).toUpperCase();
    }
    
    return nombre.substring(0, 2).toUpperCase();
};

const Avatar = ({ imagen, nombre, isIA = false }) => {
    if (isIA) {
        return (
            <div className="avatar-circle ia-avatar" title={nombre}>
                <span className="material-symbols-outlined">smart_toy</span>
            </div>
        );
    }

    if (imagen && imagen.trim() !== "") {
        return (
            <div className="avatar-circle" title={nombre}>
                <img src={imagen} alt={`Avatar de ${nombre}`} className="avatar-img" />
            </div>
        );
    }

    const iniciales = obtenerIniciales(nombre);
    const colorFondo = obtenerColorPorNombre(nombre);

    return (
        <div 
            className="avatar-circle text-avatar" 
            style={{ backgroundColor: colorFondo }}
            title={nombre}
        >
            <span className="avatar-initials">{iniciales}</span>
        </div>
    );
};

export default Avatar;