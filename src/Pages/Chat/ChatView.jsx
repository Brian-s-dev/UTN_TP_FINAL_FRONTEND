import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useChat } from "../../Context/ChatContext";
import { EMISOR } from "../../Utils/constants";

// Componentes
import MessageBubble from "../../Components/MessageBubble/MessageBubble";
import ChatInput from "../../Components/ChatInput/ChatInput";
import ChatHeader from "../../Components/ChatHeader/ChatHeader";
import ContactInfoSidebar from "../../Components/ContactInfoSidebar/ContactInfoSidebar";

import "./ChatView.css";

// Función auxiliar para el estado de conexión
const generarEstadoConexion = (id, tipo) => {
    if (tipo === EMISOR.IA) return null;
    if (tipo === EMISOR.GRUPO) return "Haz clic aquí para info. del grupo";
    const numFijo = String(id).charCodeAt(0) || 1;
    if (numFijo % 3 === 0) return "En línea";
    if (numFijo % 2 === 0) return `última conexión hoy a las ${numFijo % 12 + 8}:30`;
    const dias = (numFijo % 5) + 1;
    return `última conexión hace ${dias} día${dias > 1 ? 's' : ''}`;
};

const ChatView = () => {
    const { chatId } = useParams();
    const navigate = useNavigate();

    // Traemos todo lo necesario del Contexto
    const {
        chats,
        contactos,
        usuarioActual,
        enviarMensaje,
        bloquearContacto,
        desbloquearContacto,
        eliminarChat
    } = useChat();

    const [infoAbierta, setInfoAbierta] = useState(false);
    const [menuEditarAbierto, setMenuEditarAbierto] = useState(false);

    // ✨ NUEVO: Estado para el buscador de mensajes
    const [busquedaMensajes, setBusquedaMensajes] = useState("");

    const menuEditarRef = useRef(null);
    const mensajesFinRef = useRef(null);

    // 1. Encontrar el chat activo
    const chatActivo = chats.find((chat) => chat.id === Number(chatId) || chat.id === chatId);

    // Cierra menús al hacer clic fuera
    useEffect(() => {
        const handleClickFuera = (event) => {
            if (menuEditarRef.current && !menuEditarRef.current.contains(event.target)) {
                setMenuEditarAbierto(false);
            }
        };
        document.addEventListener("mousedown", handleClickFuera);
        return () => document.removeEventListener("mousedown", handleClickFuera);
    }, []);

    // Reseteos al cambiar de chat
    useEffect(() => {
        setInfoAbierta(false);
        setBusquedaMensajes(""); // Limpiar búsqueda al cambiar de chat
    }, [chatId]);

    // Scroll al fondo al llegar mensajes o filtrar
    useEffect(() => {
        mensajesFinRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatActivo?.mensajes, busquedaMensajes]);

    if (!chatActivo) return <div className="chat-view-container centered">Chat no encontrado</div>;

    // Lógica visual
    const esGrupo = chatActivo.tipo === EMISOR.GRUPO;
    const estadoConexion = generarEstadoConexion(chatActivo.id, chatActivo.tipo);

    const handleBloquearToggle = () => {
        chatActivo.bloqueado ? desbloquearContacto(chatId) : bloquearContacto(chatId);
        setInfoAbierta(false);
    };

    const handleEliminar = () => {
        eliminarChat(chatId);
        navigate("/");
    };

    // Textos dinámicos
    const txtMensajeSistema = esGrupo ? "Saliste del grupo" : "Se bloqueó el contacto";
    const txtInputApagado = esGrupo ? "Ya no eres participante de este grupo" : "No puedes enviar mensajes a un contacto bloqueado";
    const txtBotonBloquear = esGrupo
        ? (chatActivo.bloqueado ? "Volver al grupo (Solo Admins)" : "Salir del grupo")
        : (chatActivo.bloqueado ? "Desbloquear contacto" : "Bloquear contacto");

    // ✨ 2. FILTRADO DE MENSAJES
    const mensajesFiltrados = busquedaMensajes.trim() === ""
        ? chatActivo.mensajes
        : chatActivo.mensajes.filter(msg =>
            msg.texto.toLowerCase().includes(busquedaMensajes.toLowerCase())
        );

    return (
        <div className="chat-view-container" key={chatId}>
            {/* HEADER */}
            <ChatHeader
                chatActivo={chatActivo}
                estadoConexion={estadoConexion}
                setInfoAbierta={setInfoAbierta}
                navigate={navigate}
                setBusquedaMensajes={setBusquedaMensajes} // ✨ Pasamos el setter para el buscador
            />

            {/* ÁREA DE MENSAJES */}
            {/* Usamos la clase 'chat-messages-area' para que coincida con el CSS nuevo */}
            <div className="chat-messages-area">

                {/* Caso 1: Chat Bloqueado */}
                {chatActivo.bloqueado ? (
                    <div className="mensaje-sistema-wrapper">
                        <span className="mensaje-sistema-burbuja">{txtMensajeSistema}</span>
                    </div>
                ) : (
                    <>
                        {/* Caso 2: Búsqueda sin resultados */}
                        {mensajesFiltrados.length === 0 && busquedaMensajes !== "" ? (
                            <div className="no-results-search">
                                <p>No se encontraron mensajes con "{busquedaMensajes}"</p>
                            </div>
                        ) : (
                            /* Caso 3: Lista de mensajes normal */
                            mensajesFiltrados.map((mensaje) => (
                                <MessageBubble
                                    key={mensaje.id}
                                    id={mensaje.id} // ✨ IMPORTANTE para eliminar/citar
                                    texto={mensaje.texto}
                                    emisor={mensaje.emisor}
                                    hora={mensaje.hora}
                                    avatarContacto={mensaje.remitenteAvatar || chatActivo.avatar}
                                    nombreContacto={mensaje.remitenteNombre || chatActivo.nombre}
                                    mostrarAvatar={esGrupo}
                                    esGrupo={esGrupo}
                                    cita={mensaje.cita} // ✨ IMPORTANTE para mostrar respuestas
                                />
                            ))
                        )}
                    </>
                )}
                <div ref={mensajesFinRef} />
            </div>

            {/* INPUT */}
            <ChatInput
                onEnviarMensaje={(texto) => enviarMensaje(chatId, texto)}
                deshabilitado={chatActivo.bloqueado}
                mensajeDeshabilitado={txtInputApagado}
            />

            {/* SIDEBAR DERECHO DE INFO */}
            <ContactInfoSidebar
                infoAbierta={infoAbierta} setInfoAbierta={setInfoAbierta}
                chatActivo={chatActivo} esGrupo={esGrupo} estadoConexion={estadoConexion}
                contactos={contactos} usuarioActual={usuarioActual}
                handleBloquearToggle={handleBloquearToggle} handleEliminar={handleEliminar}
                txtBotonBloquear={txtBotonBloquear}
                menuEditarRef={menuEditarRef} menuEditarAbierto={menuEditarAbierto} setMenuEditarAbierto={setMenuEditarAbierto}
            />
        </div>
    );
};

export default ChatView;