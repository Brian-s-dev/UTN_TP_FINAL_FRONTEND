import React, { useState } from "react";

const ChatInput = ({ onEnviarMensaje }) => {
    const [texto, setTexto] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (texto.trim() === "") return;
        onEnviarMensaje(texto);
        setTexto(""); 
    };

    return (
        <form className="chat-input-area" onSubmit={handleSubmit}>
            <input 
                type="text" 
                placeholder="Escribe un mensaje aquí..." 
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
            />
            <button type="submit">Enviar</button>
        </form>
    );
};

export default ChatInput;