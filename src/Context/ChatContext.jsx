import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { EMISOR } from "../Utils/constants";
import { chatsIniciales, contactosIniciales } from "../Data/ChatData";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    // Inicializamos los chats asegurándonos que tengan las propiedades nuevas si no las traen
    const [chats, setChats] = useState(chatsIniciales.map(c => ({
        ...c,
        esFavorito: c.esFavorito || false,
        archivado: c.archivado || false
    })));

    const [contactos, setContactos] = useState(contactosIniciales);
    const [usuarioActual, setUsuarioActual] = useState("Yo");

    const enviarMensaje = useCallback((chatId, texto) => {
        setChats(prevChats => prevChats.map(chat => {
            if (chat.id === Number(chatId) || chat.id === chatId) {
                // Si mandas un mensaje a un chat archivado, se desarchiva automáticamente (comportamiento estándar)
                return {
                    ...chat,
                    archivado: false,
                    mensajes: [...chat.mensajes, { id: crypto.randomUUID(), texto, emisor: EMISOR.USUARIO }]
                };
            }
            return chat;
        }));
    }, []);

    const iniciarChatConContacto = useCallback((contacto) => {
        const chatExistente = chats.find(c => c.nombre === contacto.nombre);
        if (chatExistente) {
            // Si estaba archivado y lo busco de nuevo, lo desarchivamos
            if (chatExistente.archivado) {
                setChats(prev => prev.map(c => c.id === chatExistente.id ? { ...c, archivado: false } : c));
            }
            return chatExistente.id;
        }

        const nuevoChat = {
            id: crypto.randomUUID(), nombre: contacto.nombre, tipo: contacto.tipo,
            avatar: contacto.avatar, mensajes: [], bloqueado: false,
            esFavorito: false, archivado: false
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

    // ✨ NUEVAS FUNCIONES
    const toggleFavorito = useCallback((chatId) => {
        setChats(prev => prev.map(c =>
            (c.id === Number(chatId) || c.id === chatId) ? { ...c, esFavorito: !c.esFavorito } : c
        ));
    }, []);

    const toggleArchivado = useCallback((chatId) => {
        setChats(prev => prev.map(c =>
            (c.id === Number(chatId) || c.id === chatId) ? { ...c, archivado: !c.archivado } : c
        ));
    }, []);

    const valorContexto = useMemo(() => ({
        chats, contactos, enviarMensaje, iniciarChatConContacto,
        agregarNuevoContacto, bloquearContacto, desbloquearContacto,
        eliminarChat, toggleFavorito, toggleArchivado, // ✨ Exportamos las nuevas funciones
        usuarioActual, setUsuarioActual
    }), [chats, contactos, usuarioActual, enviarMensaje, iniciarChatConContacto, agregarNuevoContacto, bloquearContacto, desbloquearContacto, eliminarChat, toggleFavorito, toggleArchivado]);

    return (
        <ChatContext.Provider value={valorContexto}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);