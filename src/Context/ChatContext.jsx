import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { EMISOR } from "../Utils/constants";
import { chatsIniciales, contactosIniciales } from "../Data/ChatData";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [chats, setChats] = useState(chatsIniciales);
    const [contactos, setContactos] = useState(contactosIniciales);
    const [usuarioActual, setUsuarioActual] = useState("Yo");

    const enviarMensaje = useCallback((chatId, texto) => {
        setChats(prevChats => prevChats.map(chat => {
            if (chat.id === Number(chatId) || chat.id === chatId) {
                return {
                    ...chat,
                    mensajes: [...chat.mensajes, { id: crypto.randomUUID(), texto, emisor: EMISOR.USUARIO }]
                };
            }
            return chat;
        }));
    }, []);

    const iniciarChatConContacto = useCallback((contacto) => {
        const chatExistente = chats.find(c => c.nombre === contacto.nombre);
        if (chatExistente) return chatExistente.id;

        const nuevoChat = {
            id: crypto.randomUUID(), nombre: contacto.nombre, tipo: contacto.tipo,
            avatar: contacto.avatar, mensajes: [], bloqueado: false
        };
        setChats(prev => [nuevoChat, ...prev]);
        return nuevoChat.id;
    }, [chats]);

    const agregarNuevoContacto = useCallback((nombreContacto) => {
        const nuevoContacto = {
            id: crypto.randomUUID(), nombre: nombreContacto, tipo: EMISOR.CONTACTO, avatar: ""
        };
        setContactos(prev => [nuevoContacto, ...prev]);
        return nuevoContacto;
    }, []);

    const bloquearContacto = useCallback((chatId) => {
        setChats(prev => prev.map(chat =>
            (chat.id === Number(chatId) || chat.id === chatId) ? { ...chat, mensajes: [], bloqueado: true } : chat
        ));
    }, []);

    const desbloquearContacto = useCallback((chatId) => {
        setChats(prev => prev.map(chat =>
            (chat.id === Number(chatId) || chat.id === chatId) ? { ...chat, bloqueado: false } : chat
        ));
    }, []);

    const eliminarChat = useCallback((chatId) => {
        setChats(prev => prev.filter(chat => chat.id !== Number(chatId) && chat.id !== chatId));
    }, []);

    const valorContexto = useMemo(() => ({
        chats, contactos, enviarMensaje, iniciarChatConContacto,
        agregarNuevoContacto, bloquearContacto, desbloquearContacto,
        eliminarChat, usuarioActual, setUsuarioActual
    }), [chats, contactos, usuarioActual, enviarMensaje, iniciarChatConContacto, agregarNuevoContacto, bloquearContacto, desbloquearContacto, eliminarChat]);

    return (
        <ChatContext.Provider value={valorContexto}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);