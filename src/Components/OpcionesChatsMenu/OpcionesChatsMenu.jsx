import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useChat } from "../../Context/ChatContext";
import "./OpcionesChatsMenu.css";

const OpcionesChatsMenu = ({ chat }) => {
    const { toggleFavorito, toggleArchivado, eliminarChat } = useChat();
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const buttonRef = useRef(null);
    const menuRef = useRef(null);

    const handleToggle = (e) => {
        e.preventDefault();
        e.stopPropagation(); // Evita que se disparen clics en el SidebarItem o Header

        if (!isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + 5,
                left: rect.right - 160
            });
        }
        setIsOpen(!isOpen);
    };

    const handleAction = (action, e) => {
        // Importante: Detener propagación para que no navegue al chat si estamos en el sidebar
        e.preventDefault();
        e.stopPropagation();

        if (action === "favorito") toggleFavorito(chat.id);
        if (action === "archivar") toggleArchivado(chat.id);
        if (action === "eliminar") eliminarChat(chat.id);

        setIsOpen(false);
    };

    // Cerrar al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (e) => {
            // Si el menú está abierto...
            if (isOpen) {
                // Y el clic NO fue en el botón que lo abre...
                if (buttonRef.current && !buttonRef.current.contains(e.target)) {
                    // Y el clic NO fue dentro del menú (aunque el stopPropagation de abajo debería prevenir esto, es doble seguridad)
                    if (menuRef.current && !menuRef.current.contains(e.target)) {
                        setIsOpen(false);
                    }
                }
            }
        };

        const handleScroll = () => { if (isOpen) setIsOpen(false); };

        // Usamos mousedown porque es el evento que usa el resto de la app para cerrar cosas
        window.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("scroll", handleScroll, true);
        window.addEventListener("resize", handleScroll);

        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("scroll", handleScroll, true);
            window.removeEventListener("resize", handleScroll);
        };
    }, [isOpen]);

    // Contenido del menú (Portal)
    const menuContent = (
        <div
            className="options-dropdown"
            ref={menuRef}
            style={{ top: position.top, left: position.left }}
            // ✨ SOLUCIÓN CLAVE:
            // Al detener la propagación del MOUSE DOWN aquí, evitamos que el listener
            // de la ventana (handleClickOutside) se entere de que hicimos clic.
            // Esto permite que el onClick de los botones se ejecute tranquilamente.
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); }}
        >
            <button onClick={(e) => handleAction("favorito", e)}>
                {chat.esFavorito ? "Quitar de favoritos" : "Agregar a favoritos"}
            </button>
            <button onClick={(e) => handleAction("archivar", e)}>
                {chat.archivado ? "Desarchivar" : "Archivar chat"}
            </button>
            <button onClick={(e) => handleAction("eliminar", e)} className="text-danger">
                Eliminar chat
            </button>
        </div>
    );

    return (
        <div className="chat-options-container">
            <button
                ref={buttonRef}
                className={`btn-options ${isOpen ? 'active' : ''}`}
                onClick={handleToggle}
                // También detenemos mousedown aquí para evitar conflictos
                onMouseDown={(e) => e.stopPropagation()}
                title="Opciones"
            >
                <span className="material-symbols-outlined">more_vert</span>
            </button>

            {isOpen && createPortal(menuContent, document.body)}
        </div>
    );
};

export default OpcionesChatsMenu;