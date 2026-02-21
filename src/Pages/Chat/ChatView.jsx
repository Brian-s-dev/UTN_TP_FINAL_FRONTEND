import React from "react";
import { useParams, useNavigate } from "react-router"; // ✨ Agregamos useNavigate
import { useChat } from "../../Context/ChatContext";
import { EMISOR } from "../../Utils/constants";
import MessageBubble from "../../Components/MessageBubble/MessageBubble";
import ChatInput from "../../Components/ChatInput/ChatInput";
import Avatar from "../../Components/Avatar/Avatar";
import "./ChatView.css";

const ChatView = () => {
    const { chatId } = useParams();
    const navigate = useNavigate(); // ✨ Inicializamos navegación
    const { chats, enviarMensaje } = useChat();

    const chatActivo = chats.find((chat) => chat.id === Number(chatId) || chat.id === chatId);

    if (!chatActivo) return <div className="chat-view-container centered">Chat no encontrado</div>;

    const handleEnviar = (texto) => enviarMensaje(chatId, texto);

    return (
        <div className="chat-view-container" key={chatId}>
            <div className="chat-header-placeholder">
                <div className="chat-header-info">
                    {/* Pasamos isIA al header también */}
                    <Avatar
                        imagen={chatActivo.avatar}
                        nombre={chatActivo.nombre}
                        isIA={chatActivo.tipo === EMISOR.IA}
                    />
                    <h2>{chatActivo.nombre}</h2>
                </div>

                <button className="btn-volver" onClick={() => navigate("/")} title="Cerrar chat">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
            </div>

            <div className="chat-messages-placeholder">
                {chatActivo.mensajes.map((mensaje) => (
                    <MessageBubble
                        key={mensaje.id}
                        texto={mensaje.texto}
                        emisor={mensaje.emisor}
                        avatarContacto={chatActivo.avatar}
                        nombreContacto={chatActivo.nombre}
                        mostrarAvatar={chatActivo.tipo === EMISOR.GRUPO || chatActivo.tipo === EMISOR.IA}
                    />
                ))}
            </div>

            <ChatInput onEnviarMensaje={handleEnviar} />
        </div>
    );
};

export default ChatView;