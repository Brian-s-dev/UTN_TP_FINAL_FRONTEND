import { createContext, useContext, useState } from "react";
import { EMISOR } from "../Utils/constants";
import { chatsIniciales, contactosIniciales } from "../Data/ChatData";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [chats, setChats] = useState(chatsIniciales);
    const [contactos, setContactos] = useState(contactosIniciales); // ✨ Nuevo estado para agenda
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

    // ✨ Nueva función: Iniciar un chat desde la lista de contactos
    const iniciarChatConContacto = (contacto) => {
        // Revisamos si ya existe un chat activo con esa persona
        const chatExistente = chats.find(c => c.nombre === contacto.nombre);
        if (chatExistente) return chatExistente.id;

        // Si no existe, creamos un nuevo chat vacío
        const nuevoChat = {
            id: crypto.randomUUID(),
            nombre: contacto.nombre,
            tipo: contacto.tipo,
            avatar: contacto.avatar,
            mensajes: []
        };
        setChats([nuevoChat, ...chats]);
        return nuevoChat.id;
    };

    // ✨ Nueva función: Agregar a la agenda
    const agregarNuevoContacto = (nombreContacto) => {
        const nuevoContacto = {
            id: crypto.randomUUID(),
            nombre: nombreContacto,
            tipo: EMISOR.CONTACTO,
            avatar: "" // Sin avatar por defecto
        };
        setContactos([nuevoContacto, ...contactos]);
        return nuevoContacto;
    };

    return (
        <ChatContext.Provider value={{ 
            chats, 
            contactos, 
            enviarMensaje, 
            iniciarChatConContacto, 
            agregarNuevoContacto, 
            usuarioActual, 
            setUsuarioActual 
        }}>
            {children}
        </ChatContext.Provider> 
    );
};

export const useChat = () => useContext(ChatContext);