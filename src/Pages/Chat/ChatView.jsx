import React from "react";
import { useParams, useNavigate } from "react-router"; 
import { useChat } from "../../Context/ChatContext";
import { EMISOR } from "../../Utils/constants";
import MessageBubble from "../../Components/MessageBubble/MessageBubble";
import ChatInput from "../../Components/ChatInput/ChatInput";
import Avatar from "../../Components/Avatar/Avatar";
import "./ChatView.css";

const generarEstadoConexion = (id, tipo) => {
    if (tipo === EMISOR.IA) return null;
    if (tipo === EMISOR.GRUPO) return "Haz clic aquí para info. del grupo";

    const numeroAleatorioFijo = String(id).charCodeAt(0) || 1;
    
    if (numeroAleatorioFijo % 3 === 0) return "En línea";
    if (numeroAleatorioFijo % 2 === 0) return `última conexión hoy a las ${numeroAleatorioFijo % 12 + 8}:30`;
    
    const dias = (numeroAleatorioFijo % 5) + 1;
    return `última conexión hace ${dias} día${dias > 1 ? 's' : ''}`;
};

const ChatView = () => {
    const { chatId } = useParams();
    const navigate = useNavigate(); 
    const { chats, enviarMensaje } = useChat();

    const chatActivo = chats.find((chat) => chat.id === Number(chatId) || chat.id === chatId);

    if (!chatActivo) return <div className="chat-view-container centered">Chat no encontrado</div>;

    const handleEnviar = (texto) => enviarMensaje(chatId, texto);
    
    const estadoConexion = generarEstadoConexion(chatActivo.id, chatActivo.tipo);

    return (
        <div className="chat-view-container" key={chatId}>
            <div className="chat-header-placeholder">
                <div className="chat-header-info">
                    <Avatar
                        imagen={chatActivo.avatar}
                        nombre={chatActivo.nombre}
                        isIA={chatActivo.tipo === EMISOR.IA}
                    />
                    <div className="chat-header-texto">
                        <h2>{chatActivo.nombre}</h2>
                        {estadoConexion && <span className="chat-status">{estadoConexion}</span>}
                    </div>
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
                        hora={mensaje.hora}
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