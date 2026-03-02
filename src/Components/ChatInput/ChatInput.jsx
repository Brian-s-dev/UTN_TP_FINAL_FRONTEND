import React, { useState, useRef, useEffect } from "react";
import { useChat } from "../../Context/ChatContext";
import { useTheme } from "../../Context/ThemeContext"; // ✨ Importar contexto de tema
import EmojiPickerComponent from "../EmojiPicker/EmojiPicker"; // ✨ Importar el componente nuevo
import "./ChatInput.css";

const ChatInput = ({ onEnviarMensaje, deshabilitado, mensajeDeshabilitado }) => {
    const { mensajeCitado, setMensajeCitado } = useChat();
    const { tema } = useTheme(); // ✨ Obtenemos el tema actual

    const [texto, setTexto] = useState("");

    // Estados para menús
    const [mostrarMenu, setMostrarMenu] = useState(false); // Adjuntos
    const [mostrarPicker, setMostrarPicker] = useState(false); // ✨ Emojis

    const menuRef = useRef(null);
    const pickerRef = useRef(null); // ✨ Ref para el picker

    // Detectar clic fuera
    useEffect(() => {
        const handleClickFuera = (event) => {
            // Cerrar menú adjuntos
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMostrarMenu(false);
            }

            // ✨ Cerrar menú emojis si el clic no es en el picker ni en el botón de emoji
            if (
                pickerRef.current &&
                !pickerRef.current.contains(event.target) &&
                !event.target.closest('.btn-emoji') // Clase del botón
            ) {
                setMostrarPicker(false);
            }
        };

        document.addEventListener("mousedown", handleClickFuera);
        return () => document.removeEventListener("mousedown", handleClickFuera);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (texto.trim() === "" || deshabilitado) return;
        onEnviarMensaje(texto);
        setTexto("");
        setMostrarMenu(false);
        setMostrarPicker(false); // ✨ Cerrar picker al enviar
    };

    // ✨ Función al seleccionar emoji
    const handleEmojiSelect = (emojiObject) => {
        setTexto((prev) => prev + emojiObject.emoji);
    };

    return (
        <div className="chat-footer-wrapper">
            {/* ✨ RENDERIZADO DEL PICKER */}
            {mostrarPicker && (
                <div ref={pickerRef}>
                    <EmojiPickerComponent
                        onEmojiClick={handleEmojiSelect}
                        theme={tema}
                    />
                </div>
            )}

            {/* PREVISUALIZACIÓN DE RESPUESTA */}
            {mensajeCitado && (
                <div className="reply-preview-container">
                    <div className="reply-content">
                        <span className="reply-title">
                            Respondiendo a {mensajeCitado.emisor === "yo" ? "tí mismo" : mensajeCitado.nombreContacto || "Contacto"}
                        </span>
                        <p className="reply-text">{mensajeCitado.texto}</p>
                    </div>
                    <button className="btn-close-reply" onClick={() => setMensajeCitado(null)}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
            )}

            <form className={`chat-input-area ${deshabilitado ? 'input-deshabilitado' : ''}`} onSubmit={handleSubmit}>
                <div className="input-pill-container">

                    {/* --- BOTÓN ADJUNTAR (+) --- */}
                    <div className="adjuntos-container" ref={menuRef}>
                        <button
                            type="button"
                            className="btn-icon btn-adjuntar"
                            onClick={() => !deshabilitado && setMostrarMenu(!mostrarMenu)}
                            title="Adjuntar"
                            disabled={deshabilitado}
                        >
                            <span className="material-symbols-outlined">add</span>
                        </button>

                        {mostrarMenu && (
                            <div className="menu-adjuntos">
                                <button type="button"><span className="material-symbols-outlined color-foto">image</span> Fotos</button>
                                <button type="button"><span className="material-symbols-outlined color-doc">description</span> Documento</button>
                            </div>
                        )}
                    </div>

                    {/* --- ✨ BOTÓN EMOJIS (NUEVO) --- */}
                    <button
                        type="button"
                        className="btn-icon btn-emoji"
                        onClick={() => {
                            if (!deshabilitado) {
                                setMostrarPicker(!mostrarPicker);
                                setMostrarMenu(false); // Cerrar el otro menú si está abierto
                            }
                        }}
                        title="Emojis"
                        disabled={deshabilitado}
                    >
                        {/* Cambia el icono si está abierto */}
                        <span className="material-symbols-outlined">
                            {mostrarPicker ? "keyboard" : "sentiment_satisfied"}
                        </span>
                    </button>

                    {/* --- INPUT --- */}
                    <input
                        type="text"
                        placeholder={deshabilitado ? mensajeDeshabilitado : "Escribe un mensaje aquí..."}
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                        onClick={() => {
                            setMostrarMenu(false);
                            // Opcional: setMostrarPicker(false); // Si quieres que se cierre al escribir
                        }}
                        disabled={deshabilitado}
                        autoFocus={!!mensajeCitado}
                    />

                    <button type="submit" className="btn-icon btn-enviar" title="Enviar" disabled={deshabilitado}>
                        <span className="material-symbols-outlined">send</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatInput;