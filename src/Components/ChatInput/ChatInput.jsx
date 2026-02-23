import React, { useState, useRef, useEffect } from "react";

const ChatInput = ({ onEnviarMensaje, deshabilitado, mensajeDeshabilitado }) => { 
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
        if (texto.trim() === "" || deshabilitado) return; 
        onEnviarMensaje(texto);
        setTexto(""); 
        setMostrarMenu(false); 
    };

    return (
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
                    placeholder={deshabilitado ? mensajeDeshabilitado : "Escribe un mensaje aquí..."} 
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    onClick={() => setMostrarMenu(false)} 
                    disabled={deshabilitado}
                />
                
                <button type="submit" className="btn-icon btn-enviar" title="Enviar" disabled={deshabilitado}>
                    <span className="material-symbols-outlined">send</span>
                </button>
            </div>
        </form>
    );
};

export default ChatInput;