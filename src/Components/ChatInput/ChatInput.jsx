import React, { useState, useRef, useEffect } from "react";
import { useChat } from "../../Context/ChatContext"; // Importar contexto
import "./ChatInput.css";

const ChatInput = ({ onEnviarMensaje, deshabilitado, mensajeDeshabilitado }) => {
    const { mensajeCitado, setMensajeCitado } = useChat(); // ✨ Traemos estado de cita
    const [texto, setTexto] = useState("");
    const [mostrarMenu, setMostrarMenu] = useState(false);
    const menuRef = useRef(null);

    // ... (useEffect handleClickFuera igual) ...
    useEffect(() => {
        const handleClickFuera = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMostrarMenu(false);
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
        // setMensajeCitado(null); // Esto ya lo hace el context al enviar
    };

    return (
        <div className="chat-footer-wrapper">
            {/* ✨ PREVISUALIZACIÓN DE RESPUESTA */}
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
                                {/* ... Botones adjuntos iguales ... */}
                                <button type="button"><span className="material-symbols-outlined color-foto">image</span> Fotos</button>
                                <button type="button"><span className="material-symbols-outlined color-doc">description</span> Documento</button>
                            </div>
                        )}
                    </div>

                    <input
                        type="text"
                        placeholder={deshabilitado ? mensajeDeshabilitado : "Escribe un mensaje aquí..."}
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                        onClick={() => setMostrarMenu(false)}
                        disabled={deshabilitado}
                        autoFocus={!!mensajeCitado} // Enfocar si estoy respondiendo
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