import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom"; // ✨ Importamos el Portal
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
        e.stopPropagation();

        if (!isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            // Calculamos la posición exacta en la pantalla
            setPosition({
                top: rect.bottom + 5,
                left: rect.right - 160 // Alineado a la derecha del botón
            });
        }
        setIsOpen(!isOpen);
    };

    const handleAction = (action, e) => {
        e.preventDefault();
        e.stopPropagation();

        if (action === "favorito") toggleFavorito(chat.id);
        if (action === "archivar") toggleArchivado(chat.id);
        if (action === "eliminar") eliminarChat(chat.id);

        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            // Verificamos si el clic fue fuera del menú Y fuera del botón
            if (isOpen &&
                menuRef.current && !menuRef.current.contains(e.target) &&
                buttonRef.current && !buttonRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        const handleScroll = () => { if (isOpen) setIsOpen(false); };

        window.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("scroll", handleScroll, true);
        window.addEventListener("resize", handleScroll); // Cerrar si cambian el tamaño

        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("scroll", handleScroll, true);
            window.removeEventListener("resize", handleScroll);
        };
    }, [isOpen]);

    // ✨ EL CONTENIDO DEL MENÚ (Lo sacamos a una variable para el Portal)
    const menuContent = (
        <div
            className="options-dropdown"
            ref={menuRef}
            style={{ top: position.top, left: position.left }}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
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
                title="Opciones"
            >
                <span className="material-symbols-outlined">more_vert</span>
            </button>

            {/* ✨ USAMOS EL PORTAL PARA RENDERIZAR EN EL BODY */}
            {isOpen && createPortal(menuContent, document.body)}
        </div>
    );
};

export default OpcionesChatsMenu;