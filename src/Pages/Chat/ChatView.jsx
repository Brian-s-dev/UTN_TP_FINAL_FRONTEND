import React, { useState } from "react";
import { useParams } from "react-router";
import { useChat } from "../../Context/ChatContext";
import "./ChatView.css";

const ChatView = () => {
    const { chatId } = useParams();
    
    const { chats, enviarMensaje } = useChat();

    const [nuevoMensaje, setNuevoMensaje] = useState("");

    const chatActivo = chats.find((chat) => chat.id === Number(chatId));

    if (!chatActivo) {
        return <div className="chat-view-container">Chat no encontrado</div>;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (nuevoMensaje.trim() === "") return;
        enviarMensaje(chatId, nuevoMensaje);
        setNuevoMensaje("");
    };

    return (
        <div className="chat-view-container">
            <div className="chat-header-placeholder">
                <h2>{chatActivo.nombre}</h2>
            </div>

            <div className="chat-messages-placeholder">
                {chatActivo.mensajes.map((mensaje) => (
                    <div 
                        key={mensaje.id} 
                        className={`mensaje-burbuja ${mensaje.emisor === 'usuario' ? 'mi-mensaje' : 'su-mensaje'}`}
                    >
                        {mensaje.texto}
                    </div>
                ))}
            </div>

            <form className="chat-input-area" onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Escribe un mensaje aquí..." 
                    value={nuevoMensaje}
                    onChange={(e) => setNuevoMensaje(e.target.value)} 
                />
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
}

export default ChatView;