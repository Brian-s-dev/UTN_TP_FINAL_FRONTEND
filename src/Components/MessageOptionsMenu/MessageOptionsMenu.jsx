import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useChat } from "../../Context/ChatContext";
import { useParams } from "react-router"; // Para saber en qué chat estamos
import "./MessageOptionsMenu.css";

const MessageOptionsMenu = ({ mensaje }) => {
    const { chatId } = useParams();
    const { eliminarMensaje, setMensajeCitado, setMensajeAReenviar } = useChat();

    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const buttonRef = useRef(null);

    const handleToggle = (e) => {
        e.stopPropagation();
        if (!isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + 5,
                left: rect.right - 150 // Alineación derecha
            });
        }
        setIsOpen(!isOpen);
    };

    const handleAction = (accion) => {
        if (accion === "copiar") {
            navigator.clipboard.writeText(mensaje.texto);
        } else if (accion === "responder") {
            setMensajeCitado(mensaje);
        } else if (accion === "reenviar") {
            setMensajeAReenviar(mensaje); // Esto abrirá el modal
        } else if (accion === "eliminar") {
            eliminarMensaje(chatId, mensaje.id);
        }
        setIsOpen(false);
    };

    // Cerrar al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = () => setIsOpen(false);
        const handleScroll = () => { if (isOpen) setIsOpen(false); };

        if (isOpen) {
            window.addEventListener("mousedown", handleClickOutside);
            window.addEventListener("scroll", handleScroll, true);
        }
        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("scroll", handleScroll, true);
        };
    }, [isOpen]);

    const menuContent = (
        <div
            className="msg-options-dropdown"
            style={{ top: position.top, left: position.left }}
            onMouseDown={(e) => e.stopPropagation()} // Evita que el clic cierre el menú inmediatamente
        >
            <button onClick={() => handleAction("responder")}>Responder</button>
            <button onClick={() => handleAction("copiar")}>Copiar</button>
            <button onClick={() => handleAction("reenviar")}>Reenviar</button>
            <button onClick={() => handleAction("eliminar")}>Eliminar</button>
        </div>
    );

    return (
        <>
            <button
                ref={buttonRef}
                className={`btn-msg-options ${isOpen ? 'visible' : ''}`}
                onClick={handleToggle}
            >
                <span className="material-symbols-outlined">expand_more</span>
            </button>
            {isOpen && createPortal(menuContent, document.body)}
        </>
    );
};

export default MessageOptionsMenu;