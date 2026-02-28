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
        e.stopPropagation();

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
        // Detenemos propagación del CLICK para que no navegue al chat (SidebarItem)
        e.preventDefault();
        e.stopPropagation();

        // Ejecutamos la acción
        if (action === "favorito") toggleFavorito(chat.id);
        if (action === "archivar") toggleArchivado(chat.id);
        if (action === "eliminar") eliminarChat(chat.id);

        // Cerramos el menú
        setIsOpen(false);
    };

    // Cerrar al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isOpen) {
                // Verificamos que el clic NO sea en el botón de abrir
                const clickedButton = buttonRef.current && buttonRef.current.contains(e.target);
                // Verificamos que el clic NO sea dentro del menú desplegable
                const clickedMenu = menuRef.current && menuRef.current.contains(e.target);

                // Si el clic fue afuera de ambos, cerramos
                if (!clickedButton && !clickedMenu) {
                    setIsOpen(false);
                }
            }
        };

        const handleScroll = () => { if (isOpen) setIsOpen(false); };

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
            // ✨ CORRECCIÓN: Quitamos onMouseDown. 
            // Solo necesitamos detener el click para que no afecte al NavLink padre.
            onClick={(e) => e.stopPropagation()}
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
                // Aquí tampoco necesitamos detener mousedown, el onClick maneja la lógica
                title="Opciones"
            >
                <span className="material-symbols-outlined">more_vert</span>
            </button>

            {isOpen && createPortal(menuContent, document.body)}
        </div>
    );
};

export default OpcionesChatsMenu;