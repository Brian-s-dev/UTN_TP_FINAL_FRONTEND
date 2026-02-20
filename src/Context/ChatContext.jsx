import { createContext, useContext, useState } from "react";
import { EMISOR } from "../Utils/constants";
import { chatsIniciales } from "../Data/ChatData";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [chats, setChats] = useState(chatsIniciales);

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

    const agregarNuevoChat = (nombreContacto) => {
        const nuevoId = crypto.randomUUID();
        const nuevoChat = {
            id: nuevoId,
            nombre: nombreContacto,
            tipo: EMISOR.CONTACTO,
            mensajes: []
        };
        setChats([nuevoChat, ...chats]);
        return nuevoId;
    };

    return (
        <ChatContext.Provider value={{ chats, enviarMensaje, agregarNuevoChat }}>
            {children}
        </ChatContext.Provider> 
    );
};

export const useChat = () => useContext(ChatContext);