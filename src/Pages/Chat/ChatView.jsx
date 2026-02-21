import React from "react";
import { useParams } from "react-router";
import { useChat } from "../../Context/ChatContext";
import { EMISOR } from "../../Utils/constants";
import MessageBubble from "../../Components/MessageBubble/MessageBubble";
import ChatInput from "../../Components/ChatInput/ChatInput";
import Avatar from "../../Components/Avatar/Avatar";
import "./ChatView.css";

const ChatView = () => {
    const { chatId } = useParams();
    const { chats, enviarMensaje } = useChat();

    const chatActivo = chats.find((chat) => chat.id === Number(chatId) || chat.id === chatId);

    if (!chatActivo) return <div className="chat-view-container centered">Chat no encontrado</div>;

    const handleEnviar = (texto) => enviarMensaje(chatId, texto);

    return (
        <div className="chat-view-container" key={chatId}>
            <div className="chat-header-placeholder">
                <Avatar imagen={chatActivo.avatar} nombre={chatActivo.nombre} />
                <h2>{chatActivo.nombre}</h2>
            </div>
            
            <div className="chat-messages-placeholder">
                {chatActivo.mensajes.map((mensaje) => (
                    <MessageBubble 
                        key={mensaje.id} 
                        texto={mensaje.texto} 
                        emisor={mensaje.emisor} 
                        avatarContacto={chatActivo.avatar}
                        nombreContacto={chatActivo.nombre}
                        mostrarAvatar={chatActivo.tipo === EMISOR.GRUPO}
                    />
                ))}
            </div>
            
            <ChatInput onEnviarMensaje={handleEnviar} />
        </div>
    );
};

export default ChatView;