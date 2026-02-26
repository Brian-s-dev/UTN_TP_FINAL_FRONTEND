import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useChat } from "../../Context/ChatContext";
import { EMISOR } from "../../Utils/constants";
import MessageBubble from "../../Components/MessageBubble/MessageBubble";
import ChatInput from "../../Components/ChatInput/ChatInput";
import ChatHeader from "../../Components/ChatHeader/ChatHeader";
import ContactInfoSidebar from "../../Components/ContactInfoSidebar/ContactInfoSidebar";
import "./ChatView.css";

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

    useEffect(() => setInfoAbierta(false), [chatId]);
    useEffect(() => mensajesFinRef.current?.scrollIntoView({ behavior: "smooth" }), [chatActivo?.mensajes]);

    if (!chatActivo) return <div className="chat-view-container centered">Chat no encontrado</div>;

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

    const txtMensajeSistema = esGrupo ? "Saliste del grupo" : "Se bloqueó el contacto";
    const txtInputApagado = esGrupo ? "Ya no eres participante de este grupo" : "No puedes enviar mensajes a un contacto bloqueado";
    const txtBotonBloquear = esGrupo
        ? (chatActivo.bloqueado ? "Volver al grupo (Solo Admins)" : "Salir del grupo")
        : (chatActivo.bloqueado ? "Desbloquear contacto" : "Bloquear contacto");

    return (
        <div className="chat-view-container" key={chatId}>
            <ChatHeader
                chatActivo={chatActivo} estadoConexion={estadoConexion}
                setInfoAbierta={setInfoAbierta} navigate={navigate}
            />

            <div className="chat-messages-placeholder">
                {chatActivo.bloqueado ? (
                    <div className="mensaje-sistema-wrapper">
                        <span className="mensaje-sistema-burbuja">{txtMensajeSistema}</span>
                    </div>
                ) : (
                    chatActivo.mensajes.map((mensaje) => (
                        <MessageBubble
                            key={mensaje.id} texto={mensaje.texto} emisor={mensaje.emisor} hora={mensaje.hora}
                            avatarContacto={mensaje.remitenteAvatar || chatActivo.avatar}
                            nombreContacto={mensaje.remitenteNombre || chatActivo.nombre}
                            mostrarAvatar={esGrupo} esGrupo={esGrupo}
                        />
                    ))
                )}
                <div ref={mensajesFinRef} />
            </div>

            <ChatInput
                onEnviarMensaje={(texto) => enviarMensaje(chatId, texto)}
                deshabilitado={chatActivo.bloqueado} mensajeDeshabilitado={txtInputApagado}
            />

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