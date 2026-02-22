import React, { useState, useRef, useEffect } from "react";

const ChatInput = ({ onEnviarMensaje }) => {
    const [texto, setTexto] = useState("");
    const [mostrarMenu, setMostrarMenu] = useState(false);
    const menuRef = useRef(null); // Para detectar clics fuera del menú

    // ✨ Efecto para cerrar el menú si hacemos clic en otro lado de la pantalla
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
        if (texto.trim() === "") return;
        onEnviarMensaje(texto);
        setTexto(""); 
        setMostrarMenu(false); // Cerramos menú por si estaba abierto
    };

    return (
        <form className="chat-input-area" onSubmit={handleSubmit}>
            
            {/* ✨ Contenedor del botón "+" y el menú flotante */}
            <div className="adjuntos-container" ref={menuRef}>
                <button 
                    type="button" 
                    className="btn-icon btn-adjuntar"
                    onClick={() => setMostrarMenu(!mostrarMenu)}
                    title="Adjuntar"
                >
                    <span className="material-symbols-outlined">add</span>
                </button>

                {/* El Menú Desplegable */}
                {mostrarMenu && (
                    <div className="menu-adjuntos">
                        <button type="button" onClick={() => setMostrarMenu(false)}>
                            <span className="material-symbols-outlined color-doc">description</span>
                            Documento
                        </button>
                        <button type="button" onClick={() => setMostrarMenu(false)}>
                            <span className="material-symbols-outlined color-foto">image</span>
                            Fotos y videos
                        </button>
                        <button type="button" onClick={() => setMostrarMenu(false)}>
                            <span className="material-symbols-outlined color-camara">photo_camera</span>
                            Cámara
                        </button>
                        <button type="button" onClick={() => setMostrarMenu(false)}>
                            <span className="material-symbols-outlined color-contacto">person</span>
                            Contacto
                        </button>
                        <button type="button" onClick={() => setMostrarMenu(false)}>
                            <span className="material-symbols-outlined color-encuesta">poll</span>
                            Encuesta
                        </button>
                    </div>
                )}
            </div>

            <input 
                type="text" 
                placeholder="Escribe un mensaje aquí..." 
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                onClick={() => setMostrarMenu(false)} // Cierra el menú al escribir
            />
            
            {/* ✨ El nuevo botón de Enviar con ícono */}
            <button type="submit" className="btn-icon btn-enviar" title="Enviar">
                <span className="material-symbols-outlined">send</span>
            </button>
        </form>
    );
};

export default ChatInput;