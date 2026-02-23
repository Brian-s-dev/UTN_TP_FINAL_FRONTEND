import React from "react";
import "./Avatar.css";

// Paleta de colores al estilo WhatsApp/Material Design
const COLORES_AVATAR = [
    "#00a884", "#007bfc", "#ff2e74", "#7f66ff", 
    "#ffbc38", "#009de2", "#ea0038", "#1fa855", 
    "#53bdeb", "#ff8a8c", "#a695c7", "#f3a731"
];

// Función para generar siempre el mismo color basado en el texto del nombre
const obtenerColorPorNombre = (nombre) => {
    if (!nombre) return "#ccc"; // Color por defecto si no hay nombre
    
    let hash = 0;
    for (let i = 0; i < nombre.length; i++) {
        hash = nombre.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Convertimos el hash en un índice positivo dentro de nuestra paleta
    const indice = Math.abs(hash) % COLORES_AVATAR.length;
    return COLORES_AVATAR[indice];
};

// Función para extraer hasta 2 iniciales (ej: "Juan Pérez" -> "JP", "Maria" -> "M")
const obtenerIniciales = (nombre) => {
    if (!nombre) return "";
    
    const palabras = nombre.trim().split(" ");
    if (palabras.length >= 2) {
        // Toma la primera letra de la primera y segunda palabra
        return (palabras[0][0] + palabras[1][0]).toUpperCase();
    }
    
    // Si es una sola palabra, toma hasta las dos primeras letras
    return nombre.substring(0, 2).toUpperCase();
};

const Avatar = ({ imagen, nombre, isIA = false }) => {
    // 1. Si es la Inteligencia Artificial, mostramos un ícono especial
    if (isIA) {
        return (
            <div className="avatar-circle ia-avatar" title={nombre}>
                <span className="material-symbols-outlined">smart_toy</span>
            </div>
        );
    }

    // 2. Si el contacto tiene una imagen válida (URL), la mostramos
    if (imagen && imagen.trim() !== "") {
        return (
            <div className="avatar-circle" title={nombre}>
                <img src={imagen} alt={`Avatar de ${nombre}`} className="avatar-img" />
            </div>
        );
    }

    // 3. Si no hay imagen, generamos las iniciales con un color de fondo dinámico
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