import React, { useState, useRef, useEffect } from "react";
import { useChat } from "../../Context/ChatContext";
import "./OpcionesChatsMenu.css";

const OpcionesChatsMenu = ({ chat }) => {
    const { toggleFavorito, toggleArchivado, eliminarChat } = useChat();
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const buttonRef = useRef(null);
    const menuRef = useRef(null);

    const handleToggle = (e) => {
        e.preventDefault(); // Evita navegar al chat
        e.stopPropagation(); // Evita navegar al chat

        if (!isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            // Calculamos posición para que aparezca junto al botón
            setPosition({
                top: rect.bottom + 5,
                left: rect.right - 150 // 150px es el ancho aprox del menú
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

    // Cerrar al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isOpen && menuRef.current && !menuRef.current.contains(e.target) && buttonRef.current && !buttonRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        // Cerrar al scrollear
        const handleScroll = () => { if (isOpen) setIsOpen(false); };

        window.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("scroll", handleScroll, true);
        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("scroll", handleScroll, true);
        };
    }, [isOpen]);

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

            {isOpen && (
                <div
                    className="options-dropdown"
                    ref={menuRef}
                    style={{ top: position.top, left: position.left }}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} // Stop propagation del menú mismo
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
            )}
        </div>
    );
};

export default OpcionesChatsMenu;