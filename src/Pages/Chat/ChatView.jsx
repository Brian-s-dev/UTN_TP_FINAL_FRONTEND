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
    const { chats, contactos, usuarioActual, enviarMensaje, bloquearContacto, desbloquearContacto, eliminarChat } = useChat();

    const [infoAbierta, setInfoAbierta] = useState(false);
    const [menuEditarAbierto, setMenuEditarAbierto] = useState(false);
    const menuEditarRef = useRef(null);

    const mensajesFinRef = useRef(null);

    const chatActivo = chats.find((chat) => chat.id === Number(chatId) || chat.id === chatId);

    useEffect(() => {
        const handleClickFuera = (event) => {
            if (menuEditarRef.current && !menuEditarRef.current.contains(event.target)) {
                setMenuEditarAbierto(false);
            }
        };
        document.addEventListener("mousedown", handleClickFuera);
        return () => document.removeEventListener("mousedown", handleClickFuera);
    }, []);

    useEffect(() => {
        setInfoAbierta(false);
    }, [chatId]);

    useEffect(() => {
        mensajesFinRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatActivo?.mensajes]);

    if (!chatActivo) return <div className="chat-view-container centered">Chat no encontrado</div>;

    const esGrupo = chatActivo.tipo === EMISOR.GRUPO;
    const estadoConexion = generarEstadoConexion(chatActivo.id, chatActivo.tipo);

    const handleBloquearToggle = () => {
        if (chatActivo.bloqueado) {
            desbloquearContacto(chatId);
        } else {
            bloquearContacto(chatId);
        }
        setInfoAbierta(false);
    };

    const handleEliminar = () => {
        eliminarChat(chatId);
        navigate("/");
    };

    const txtMensajeSistema = esGrupo ? "Saliste del grupo" : "Se bloqueó el contacto";
    const txtInputApagado = esGrupo ? "Ya no eres participante de este grupo" : "No puedes enviar mensajes a un contacto bloqueado";
    const txtBotonBloquear = esGrupo
        ? (chatActivo.bloqueado ? "Volver al grupo (Solo Admins)" : "Salir del grupo")
        : (chatActivo.bloqueado ? "Desbloquear contacto" : "Bloquear contacto");

    return (
        <div className="chat-view-container" key={chatId}>
            <div className="chat-header-placeholder">
                <div
                    className="chat-header-info clickable"
                    onClick={() => setInfoAbierta(true)}
                    title="Ver información"
                >
                    <Avatar imagen={chatActivo.avatar} nombre={chatActivo.nombre} isIA={chatActivo.tipo === EMISOR.IA} />
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
                {chatActivo.bloqueado ? (
                    <div className="mensaje-sistema-wrapper">
                        <span className="mensaje-sistema-burbuja">{txtMensajeSistema}</span>
                    </div>
                ) : (
                    chatActivo.mensajes.map((mensaje) => (
                        <MessageBubble
                            key={mensaje.id}
                            texto={mensaje.texto}
                            emisor={mensaje.emisor}
                            hora={mensaje.hora}
                            avatarContacto={mensaje.remitenteAvatar || chatActivo.avatar}
                            nombreContacto={mensaje.remitenteNombre || chatActivo.nombre}
                            mostrarAvatar={esGrupo}
                            esGrupo={esGrupo}
                        />
                    ))
                )}
                <div ref={mensajesFinRef} />
            </div>

            <ChatInput
                onEnviarMensaje={(texto) => enviarMensaje(chatId, texto)}
                deshabilitado={chatActivo.bloqueado}
                mensajeDeshabilitado={txtInputApagado}
            />

            <div className={`contact-info-sidebar ${infoAbierta ? 'abierto' : ''}`}>
                <div className="contact-info-header">
                    <button className="btn-icon" onClick={() => setInfoAbierta(false)} title="Cerrar info">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    <h3>{esGrupo ? 'Info. del grupo' : 'Info. del contacto'}</h3>

                    <div className="edit-menu-wrapper" ref={menuEditarRef}>
                        <button className="btn-icon" onClick={() => setMenuEditarAbierto(!menuEditarAbierto)} title="Editar">
                            <span className="material-symbols-outlined">edit</span>
                        </button>

                        {menuEditarAbierto && (
                            <div className="menu-flotante-editar">
                                <button onClick={() => setMenuEditarAbierto(false)}>Editar {esGrupo ? 'grupo' : 'contacto'}</button>
                                <button onClick={() => setMenuEditarAbierto(false)}>Compartir enlace</button>
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
                        <p>{esGrupo ? `Grupo · ${contactos.slice(0, 4).length + 1} participantes` : estadoConexion}</p>
                    </div>

                    {!esGrupo && (
                        <div className="contact-actions-card">
                            <button className="action-btn">
                                <span className="material-symbols-outlined">star</span>
                                <span>Añadir a favoritos</span>
                            </button>
                        </div>
                    )}

                    {esGrupo && (
                        <div className="contact-actions-card">
                            <h4 className="card-subtitle">{contactos.slice(0, 4).length + 1} participantes</h4>
                            <div className="participant-list">
                                <div className="participant-item">
                                    <Avatar nombre={usuarioActual} />
                                    <div className="participant-info">
                                        <span className="participant-name">Tú</span>
                                        <span className="participant-role">Admin del grupo</span>
                                    </div>
                                </div>
                                {contactos.slice(0, 4).map(c => (
                                    <div key={c.id} className="participant-item">
                                        <Avatar imagen={c.avatar} nombre={c.nombre} />
                                        <div className="participant-info">
                                            <span className="participant-name">{c.nombre}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="contact-actions-card danger-zone">
                        <button className="action-btn text-danger" onClick={handleBloquearToggle}>
                            <span className="material-symbols-outlined">
                                {esGrupo ? "logout" : "block"}
                            </span>
                            <span>{txtBotonBloquear}</span>
                        </button>
                        <button className="action-btn text-danger" onClick={handleEliminar}>
                            <span className="material-symbols-outlined">delete</span>
                            <span>Eliminar chat</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatView;