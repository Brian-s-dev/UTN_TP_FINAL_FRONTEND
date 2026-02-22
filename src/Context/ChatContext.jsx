import { createContext, useContext, useState } from "react";
import { EMISOR } from "../Utils/constants";
import { chatsIniciales, contactosIniciales } from "../Data/ChatData";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [chats, setChats] = useState(chatsIniciales);
    const [contactos, setContactos] = useState(contactosIniciales);
    const [usuarioActual, setUsuarioActual] = useState("Yo"); 

    const enviarMensaje = (chatId, texto) => {
        setChats(prevChats => prevChats.map(chat => {
            if (chat.id === Number(chatId) || chat.id === chatId) {
                return {
                    ...chat,
                    mensajes: [...chat.mensajes, { id: crypto.randomUUID(), texto, emisor: EMISOR.USUARIO }]
                };
            }
            return chat;
        }));
    };

    const iniciarChatConContacto = (contacto) => {
        const chatExistente = chats.find(c => c.nombre === contacto.nombre);
        if (chatExistente) return chatExistente.id;

        const nuevoChat = {
            id: crypto.randomUUID(),
            nombre: contacto.nombre,
            tipo: contacto.tipo,
            avatar: contacto.avatar,
            mensajes: [],
            bloqueado: false // ✨ Por defecto no está bloqueado
        };
        setChats([nuevoChat, ...chats]);
        return nuevoChat.id;
    };

    const agregarNuevoContacto = (nombreContacto) => {
        const nuevoContacto = {
            id: crypto.randomUUID(),
            nombre: nombreContacto,
            tipo: EMISOR.CONTACTO,
            avatar: "" 
        };
        setContactos([nuevoContacto, ...contactos]);
        return nuevoContacto;
    };

    // ✨ NUEVA FUNCIÓN: Vacía los mensajes y marca el chat como bloqueado
    const bloquearContacto = (chatId) => {
        setChats(prevChats => prevChats.map(chat => {
            if (chat.id === Number(chatId) || chat.id === chatId) {
                return { ...chat, mensajes: [], bloqueado: true };
            }
            return chat;
        }));
    };

    // ✨ NUEVA FUNCIÓN: Filtra el chat para eliminarlo de la lista
    const eliminarChat = (chatId) => {
        setChats(prevChats => prevChats.filter(chat => chat.id !== Number(chatId) && chat.id !== chatId));
    };

    return (
        <ChatContext.Provider value={{ 
            chats, 
            contactos, 
            enviarMensaje, 
            iniciarChatConContacto, 
            agregarNuevoContacto, 
            bloquearContacto, 
            eliminarChat, 
            usuarioActual, 
            setUsuarioActual 
        }}>
            {children}
        </ChatContext.Provider> 
    );
};

export const useChat = () => useContext(ChatContext);