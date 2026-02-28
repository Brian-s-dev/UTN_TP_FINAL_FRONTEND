import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { EMISOR } from "../Utils/constants";
import { chatsIniciales, contactosIniciales } from "../Data/ChatData";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    // ✨ CORRECCIÓN: Inicializamos los chats asegurando que las propiedades booleanas existan.
    // Esto evita errores la primera vez que se intenta cambiar el estado.
    const [chats, setChats] = useState(chatsIniciales.map(chat => ({
        ...chat,
        esFavorito: chat.esFavorito || false,
        archivado: chat.archivado || false,
        bloqueado: chat.bloqueado || false
    })));

    const [contactos, setContactos] = useState(contactosIniciales);
    const [usuarioActual, setUsuarioActual] = useState("Yo");

    // Estados para funciones avanzadas (Citar y Reenviar)
    const [mensajeCitado, setMensajeCitado] = useState(null);
    const [mensajeAReenviar, setMensajeAReenviar] = useState(null);

    // ========================================================================
    // FUNCIONES PRINCIPALES DE CHAT
    // ========================================================================

    const enviarMensaje = useCallback((chatId, texto) => {
        setChats(prevChats => prevChats.map(chat => {
            // Comparamos con == para que sirva tanto '1' (string) como 1 (number)
            if (chat.id == chatId) {
                const nuevoMensaje = {
                    id: crypto.randomUUID(),
                    texto,
                    emisor: EMISOR.USUARIO,
                    cita: mensajeCitado ? { ...mensajeCitado } : null
                };

                return {
                    ...chat,
                    archivado: false, // Si envías mensaje, se desarchiva
                    mensajes: [...chat.mensajes, nuevoMensaje]
                };
            }
            return chat;
        }));
        setMensajeCitado(null);
    }, [mensajeCitado]);

    const eliminarMensaje = useCallback((chatId, mensajeId) => {
        setChats(prev => prev.map(chat => {
            if (chat.id == chatId) {
                return {
                    ...chat,
                    mensajes: chat.mensajes.filter(m => m.id !== mensajeId)
                };
            }
            return chat;
        }));
    }, []);

    // ========================================================================
    // GESTIÓN DE CONTACTOS Y CHATS
    // ========================================================================

    const iniciarChatConContacto = useCallback((contacto) => {
        const chatExistente = chats.find(c => c.nombre === contacto.nombre);
        if (chatExistente) return chatExistente.id;

        const nuevoChat = {
            id: crypto.randomUUID(),
            nombre: contacto.nombre,
            tipo: contacto.tipo,
            avatar: contacto.avatar,
            mensajes: [],
            bloqueado: false,
            esFavorito: false,
            archivado: false
        };
        setChats(prev => [nuevoChat, ...prev]);
        return nuevoChat.id;
    }, [chats]);

    const agregarNuevoContacto = useCallback((nombre) => {
        const nuevo = {
            id: crypto.randomUUID(),
            nombre,
            tipo: EMISOR.CONTACTO,
            avatar: "" // Sin avatar por defecto
        };
        setContactos(prev => [...prev, nuevo]);
        return nuevo;
    }, []);

    // ========================================================================
    // ACCIONES DE MENÚ (FAVORITO, ARCHIVAR, ELIMINAR, BLOQUEAR)
    // ========================================================================

    const toggleFavorito = useCallback((id) => {
        setChats(prev => prev.map(chat => {
            if (chat.id == id) {
                return { ...chat, esFavorito: !chat.esFavorito };
            }
            return chat;
        }));
    }, []);

    const toggleArchivado = useCallback((id) => {
        setChats(prev => prev.map(chat => {
            if (chat.id == id) {
                return { ...chat, archivado: !chat.archivado };
            }
            return chat;
        }));
    }, []);

    const eliminarChat = useCallback((id) => {
        setChats(prev => prev.filter(chat => chat.id != id));
    }, []);

    const bloquearContacto = useCallback((id) => {
        setChats(prev => prev.map(c => c.id == id ? { ...c, bloqueado: true } : c));
    }, []);

    const desbloquearContacto = useCallback((id) => {
        setChats(prev => prev.map(c => c.id == id ? { ...c, bloqueado: false } : c));
    }, []);

    // ========================================================================
    // LÓGICA DE REENVÍO
    // ========================================================================

    const confirmarReenvio = useCallback((contactoDestino) => {
        if (!mensajeAReenviar) return;

        let chatIdDestino = iniciarChatConContacto(contactoDestino);

        // setTimeout para asegurar que el estado se actualice si el chat era nuevo
        setTimeout(() => {
            setChats(prevChats => prevChats.map(chat => {
                if (chat.id == chatIdDestino) {
                    return {
                        ...chat,
                        archivado: false,
                        mensajes: [...chat.mensajes, {
                            id: crypto.randomUUID(),
                            texto: mensajeAReenviar.texto,
                            emisor: EMISOR.USUARIO,
                            esReenvio: true
                        }]
                    };
                }
                return chat;
            }));
        }, 0);

        setMensajeAReenviar(null);
        return chatIdDestino;
    }, [mensajeAReenviar, iniciarChatConContacto]);

    // ========================================================================
    // PROVIDER VALUE
    // ========================================================================

    const valorContexto = useMemo(() => ({
        chats, contactos, usuarioActual, setUsuarioActual,
        enviarMensaje, eliminarMensaje,
        iniciarChatConContacto, agregarNuevoContacto,
        bloquearContacto, desbloquearContacto,
        eliminarChat, toggleFavorito, toggleArchivado,
        mensajeCitado, setMensajeCitado,
        mensajeAReenviar, setMensajeAReenviar, confirmarReenvio
    }), [
        chats, contactos, usuarioActual, mensajeCitado, mensajeAReenviar,
        enviarMensaje, eliminarMensaje, iniciarChatConContacto, agregarNuevoContacto,
        bloquearContacto, desbloquearContacto, eliminarChat, toggleFavorito, toggleArchivado, confirmarReenvio
    ]);

    return (
        <ChatContext.Provider value={valorContexto}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);