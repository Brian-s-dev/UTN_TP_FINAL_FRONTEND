import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router"; // ✨ Importamos useNavigate
import { useChat } from "../../Context/ChatContext";
import "./OpcionesChatsMenu.css";

const OpcionesChatsMenu = ({ chat }) => {
    const navigate = useNavigate();

    // ✨ Traemos las funciones de bloqueo del contexto
    const {
        toggleFavorito,
        toggleArchivado,
        eliminarChat,
        bloquearContacto,
        desbloquearContacto
    } = useChat();

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
                left: rect.right - 180 // Ajustamos un poco para que entre el texto más largo
            });
        }
        setIsOpen(!isOpen);
    };

    const handleAction = (action, e) => {
        e.preventDefault();
        e.stopPropagation();

        switch (action) {
            case "favorito":
                toggleFavorito(chat.id);
                break;
            case "archivar":
                toggleArchivado(chat.id);
                break;
            case "bloquear":
                // ✨ Lógica de Bloqueo/Desbloqueo
                if (chat.bloqueado) {
                    desbloquearContacto(chat.id);
                } else {
                    bloquearContacto(chat.id);
                }
                break;
            case "eliminar":
                eliminarChat(chat.id);
                navigate("/"); // ✨ Redirección al Home tras eliminar (igual que el Sidebar)
                break;
            default:
                break;
        }

        setIsOpen(false);
    };

    // Cerrar al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isOpen) {
                const clickedButton = buttonRef.current && buttonRef.current.contains(e.target);
                const clickedMenu = menuRef.current && menuRef.current.contains(e.target);

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

    // Contenido del menú
    const menuContent = (
        <div
            className="options-dropdown"
            ref={menuRef}
            style={{ top: position.top, left: position.left }}
            onClick={(e) => e.stopPropagation()}
        >
            <button onClick={(e) => handleAction("favorito", e)}>
                {chat.esFavorito ? "Quitar de favoritos" : "Agregar a favoritos"}
            </button>

            <button onClick={(e) => handleAction("archivar", e)}>
                {chat.archivado ? "Desarchivar" : "Archivar chat"}
            </button>

            {/* ✨ Nueva opción: Bloquear/Desbloquear */}
            <button onClick={(e) => handleAction("bloquear", e)}>
                {chat.bloqueado ? "Desbloquear contacto" : "Bloquear contacto"}
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

            {isOpen && createPortal(menuContent, document.body)}
        </div>
    );
};

export default OpcionesChatsMenu;