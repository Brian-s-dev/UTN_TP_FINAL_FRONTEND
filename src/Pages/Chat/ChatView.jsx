import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { useChat } from "../../Context/ChatContext";

// Componentes
import ChatHeader from "../ChatHeader/ChatHeader";
import MessageBubble from "../MessageBubble/MessageBubble";
import ChatInput from "../ChatInput/ChatInput";
import ContactInfoSidebar from "../ContactInfoSidebar/ContactInfoSidebar";

import "./ChatView.css"; // (Asumo que tienes estilos básicos para el contenedor aquí)

const ChatView = () => {
    const { chatId } = useParams();
    const navigate = useNavigate();
    const { chats, enviarMensaje, usuarioActual } = useChat();

    // Estado para el sidebar de información derecho
    const [infoAbierta, setInfoAbierta] = useState(false);

    // ✨ Estado para el buscador de mensajes
    const [busquedaMensajes, setBusquedaMensajes] = useState("");

    // Referencia para el scroll automático
    const messagesEndRef = useRef(null);

    // 1. Encontrar el chat activo
    // (Buscamos por ID numérico o string para mayor seguridad)
    const chatActivo = chats.find(c => c.id === Number(chatId) || c.id === chatId);

    // Scroll al fondo cuando llegan mensajes nuevos
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatActivo?.mensajes, busquedaMensajes]); // También scrollear si cambia el filtro

    // Si no existe el chat, redirigir o mostrar error
    if (!chatActivo) {
        return <div className="chat-placeholder">Chat no encontrado</div>;
    }

    // 2. ✨ Filtrar mensajes según la búsqueda
    const mensajesFiltrados = busquedaMensajes.trim() === ""
        ? chatActivo.mensajes
        : chatActivo.mensajes.filter(msg =>
            msg.texto.toLowerCase().includes(busquedaMensajes.toLowerCase())
        );

    const handleEnviarMensaje = (texto) => {
        enviarMensaje(chatId, texto);
    };

    return (
        <div className="chat-view-container">
            {/* HEADER CON BUSCADOR */}
            <ChatHeader
                chatActivo={chatActivo}
                estadoConexion={chatActivo.bloqueado ? "" : "en línea"}
                setInfoAbierta={setInfoAbierta}
                navigate={navigate}
                setBusquedaMensajes={setBusquedaMensajes} // ✨ Pasamos la función al header
            />

            {/* ÁREA DE MENSAJES */}
            <div className="chat-messages-area">
                {mensajesFiltrados.length === 0 && busquedaMensajes !== "" ? (
                    <div className="no-results-search">
                        <p>No se encontraron mensajes con "{busquedaMensajes}"</p>
                    </div>
                ) : (
                    mensajesFiltrados.map((mensaje) => (
                        <MessageBubble
                            key={mensaje.id}
                            id={mensaje.id}
                            texto={mensaje.texto}
                            emisor={mensaje.emisor}
                            hora={mensaje.hora} // Asegúrate de tener esta prop en tus datos
                            avatarContacto={chatActivo.avatar}
                            nombreContacto={chatActivo.nombre}
                            mostrarAvatar={chatActivo.tipo === "grupo"} // Solo mostrar avatar en grupos
                            esGrupo={chatActivo.tipo === "grupo"}
                            cita={mensaje.cita} // Soporte para responder
                        />
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <ChatInput
                onEnviarMensaje={handleEnviarMensaje}
                deshabilitado={chatActivo.bloqueado}
                mensajeDeshabilitado="No puedes enviar mensajes a este contacto bloqueado."
            />

            {/* SIDEBAR DERECHO DE INFORMACIÓN */}
            <ContactInfoSidebar
                chat={chatActivo}
                isOpen={infoAbierta}
                onClose={() => setInfoAbierta(false)}
            />
        </div>
    );
};

export default ChatView;