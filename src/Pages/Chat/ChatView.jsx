import React, { useState, useRef, useEffect } from "react";
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

    // ✨ Nuevos estados para el panel derecho
    const [infoAbierta, setInfoAbierta] = useState(false);
    const [menuEditarAbierto, setMenuEditarAbierto] = useState(false);
    const menuEditarRef = useRef(null);

    const chatActivo = chats.find((chat) => chat.id === Number(chatId) || chat.id === chatId);

    // Cerrar menú de edición al hacer clic fuera
    useEffect(() => {
        const handleClickFuera = (event) => {
            if (menuEditarRef.current && !menuEditarRef.current.contains(event.target)) {
                setMenuEditarAbierto(false);
            }
        };
        document.addEventListener("mousedown", handleClickFuera);
        return () => document.removeEventListener("mousedown", handleClickFuera);
    }, []);

    // Cerramos el panel derecho si cambiamos de chat
    useEffect(() => {
        setInfoAbierta(false);
    }, [chatId]);

    if (!chatActivo) return <div className="chat-view-container centered">Chat no encontrado</div>;

    const handleEnviar = (texto) => enviarMensaje(chatId, texto);
    const estadoConexion = generarEstadoConexion(chatActivo.id, chatActivo.tipo);

    return (
        <div className="chat-view-container" key={chatId}>
            <div className="chat-header-placeholder">
                
                {/* ✨ Hicimos clickeable esta zona para abrir el panel derecho */}
                <div 
                    className="chat-header-info clickable" 
                    onClick={() => setInfoAbierta(true)}
                    title="Ver información del contacto"
                >
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
                        avatarContacto={mensaje.remitenteAvatar || chatActivo.avatar}
                        nombreContacto={mensaje.remitenteNombre || chatActivo.nombre}
                        mostrarAvatar={chatActivo.tipo === EMISOR.GRUPO}
                        esGrupo={chatActivo.tipo === EMISOR.GRUPO}
                    />
                ))}
            </div>

            <ChatInput onEnviarMensaje={handleEnviar} />

            {/* =========================================
                ✨ NUEVO SIDEBAR DERECHO DE INFO
                ========================================= */}
            <div className={`contact-info-sidebar ${infoAbierta ? 'abierto' : ''}`}>
                <div className="contact-info-header">
                    <button className="btn-icon" onClick={() => setInfoAbierta(false)} title="Cerrar info">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    <h3>Info. del contacto</h3>
                    
                    <div className="edit-menu-wrapper" ref={menuEditarRef}>
                        <button 
                            className="btn-icon" 
                            onClick={() => setMenuEditarAbierto(!menuEditarAbierto)} 
                            title="Editar"
                        >
                            <span className="material-symbols-outlined">edit</span>
                        </button>
                        
                        {menuEditarAbierto && (
                            <div className="menu-flotante-editar">
                                <button onClick={() => setMenuEditarAbierto(false)}>Editar contacto</button>
                                <button onClick={() => setMenuEditarAbierto(false)}>Compartir contacto</button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="contact-info-body">
                    <div className="contact-profile-card">
                        <div className="avatar-large-container">
                            <Avatar imagen={chatActivo.avatar} nombre={chatActivo.nombre} isIA={chatActivo.tipo === EMISOR.IA} />
                        </div>
                        <h2>{chatActivo.nombre}</h2>
                        <p>{chatActivo.tipo === EMISOR.GRUPO ? 'Grupo' : estadoConexion}</p>
                    </div>

                    <div className="contact-actions-card">
                        <button className="action-btn">
                            <span className="material-symbols-outlined">star</span>
                            <span>Añadir a favoritos</span>
                        </button>
                    </div>

                    <div className="contact-actions-card danger-zone">
                        <button className="action-btn text-danger">
                            <span className="material-symbols-outlined">block</span>
                            <span>Bloquear contacto</span>
                        </button>
                        <button className="action-btn text-danger">
                            <span className="material-symbols-outlined">delete</span>
                            <span>Eliminar chat</span>
                        </button>
                    </div>
                </div>
            </div>
            {/* FIN SIDEBAR DERECHO */}

        </div>
    );
};

export default ChatView;