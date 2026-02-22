import React, { useState, useRef, useEffect } from "react";

// ✨ Recibimos la prop deshabilitado
const ChatInput = ({ onEnviarMensaje, deshabilitado }) => { 
    const [texto, setTexto] = useState("");
    const [mostrarMenu, setMostrarMenu] = useState(false);
    const menuRef = useRef(null);

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
        if (texto.trim() === "" || deshabilitado) return; // Protegemos el envío
        onEnviarMensaje(texto);
        setTexto(""); 
        setMostrarMenu(false); 
    };

    return (
        // Añadimos una clase si está deshabilitado para opacarlo
        <form className={`chat-input-area ${deshabilitado ? 'input-deshabilitado' : ''}`} onSubmit={handleSubmit}>
            
            <div className="input-pill-container">
                <div className="adjuntos-container" ref={menuRef}>
                    <button 
                        type="button" 
                        className="btn-icon btn-adjuntar"
                        onClick={() => !deshabilitado && setMostrarMenu(!mostrarMenu)}
                        title="Adjuntar"
                        disabled={deshabilitado} // ✨ Apagamos botón
                    >
                        <span className="material-symbols-outlined">add</span>
                    </button>

                    {mostrarMenu && (
                        /* ... menú de adjuntos (sin cambios) ... */
                        <div className="menu-adjuntos">
                            <button type="button" onClick={() => setMostrarMenu(false)}>
                                <span className="material-symbols-outlined color-doc">description</span> Documento
                            </button>
                            <button type="button" onClick={() => setMostrarMenu(false)}>
                                <span className="material-symbols-outlined color-foto">image</span> Fotos y videos
                            </button>
                            <button type="button" onClick={() => setMostrarMenu(false)}>
                                <span className="material-symbols-outlined color-camara">photo_camera</span> Cámara
                            </button>
                            <button type="button" onClick={() => setMostrarMenu(false)}>
                                <span className="material-symbols-outlined color-contacto">person</span> Contacto
                            </button>
                            <button type="button" onClick={() => setMostrarMenu(false)}>
                                <span className="material-symbols-outlined color-encuesta">poll</span> Encuesta
                            </button>
                        </div>
                    )}
                </div>

                <input 
                    type="text" 
                    placeholder={deshabilitado ? "No puedes enviar mensajes a un contacto bloqueado" : "Escribe un mensaje aquí..."} 
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    onClick={() => setMostrarMenu(false)} 
                    disabled={deshabilitado} // ✨ Apagamos input
                />
                
                <button type="submit" className="btn-icon btn-enviar" title="Enviar" disabled={deshabilitado}>
                    <span className="material-symbols-outlined">send</span>
                </button>
            </div>
        </form>
    );
};

export default ChatInput;