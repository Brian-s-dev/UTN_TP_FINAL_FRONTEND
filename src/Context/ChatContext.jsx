import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { EMISOR } from "../Utils/constants";
import { chatsIniciales, contactosIniciales } from "../Data/ChatData";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ✨ Configuración de Gemini (Intenta obtener la clave, maneja error si no existe)
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
let genAI = null;

if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
} else {
    console.warn("⚠️ VITE_GEMINI_API_KEY no encontrada en .env. El chat con IA no responderá.");
}

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    // Inicializamos estado asegurando que 'noLeidos' exista
    const [chats, setChats] = useState(chatsIniciales.map(chat => ({
        ...chat,
        esFavorito: chat.esFavorito || false,
        archivado: chat.archivado || false,
        bloqueado: chat.bloqueado || false,
        noLeidos: chat.noLeidos || 0
    })));

    const [contactos, setContactos] = useState(contactosIniciales);
    const [usuarioActual, setUsuarioActual] = useState("Yo");

    const [mensajeCitado, setMensajeCitado] = useState(null);
    const [mensajeAReenviar, setMensajeAReenviar] = useState(null);

    // Resetea el contador al entrar al chat
    const marcarComoLeido = useCallback((chatId) => {
        setChats(prev => prev.map(chat => {
            if (chat.id == chatId && chat.noLeidos > 0) {
                return { ...chat, noLeidos: 0 };
            }
            return chat;
        }));
    }, []);

    // ========================================================================
    // ✨ FUNCIÓN ENVIAR MENSAJE (CON INTEGRACIÓN IA)
    // ========================================================================
    const enviarMensaje = useCallback(async (chatId, texto) => {

        // 1. Agregar mensaje del USUARIO inmediatamente
        setChats(prevChats => prevChats.map(chat => {
            if (chat.id == chatId) {
                const nuevoMensaje = {
                    id: crypto.randomUUID(),
                    texto,
                    emisor: EMISOR.USUARIO,
                    cita: mensajeCitado ? { ...mensajeCitado } : null,
                    hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };

                return {
                    ...chat,
                    archivado: false,
                    mensajes: [...chat.mensajes, nuevoMensaje]
                };
            }
            return chat;
        }));

        // Limpiamos la cita después de enviar
        setMensajeCitado(null);

        // 2. LÓGICA DE INTELIGENCIA ARTIFICIAL
        // Verificamos si el chat actual es el de la IA (ID 1)
        if (chatId == 1) {
            if (!genAI) return; // Si no hay API Key, no hace nada

            try {
                // Obtenemos el modelo
                const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

                // Generamos respuesta
                const result = await model.generateContent(texto);
                const response = await result.response;
                const textIA = response.text();

                // 3. Agregamos la respuesta de la IA al chat
                setChats(prevChats => prevChats.map(chat => {
                    if (chat.id == chatId) {
                        const mensajeIA = {
                            id: crypto.randomUUID(),
                            texto: textIA,
                            emisor: EMISOR.IA,
                            hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        };
                        return {
                            ...chat,
                            mensajes: [...chat.mensajes, mensajeIA]
                        };
                    }
                    return chat;
                }));

            } catch (error) {
                console.error("Error al obtener respuesta de Gemini:", error);

                // Opcional: Agregar mensaje de error al chat
                setChats(prevChats => prevChats.map(chat => {
                    if (chat.id == chatId) {
                        return {
                            ...chat,
                            mensajes: [...chat.mensajes, {
                                id: crypto.randomUUID(),
                                texto: "Lo siento, tuve un problema de conexión. Intenta de nuevo más tarde.",
                                emisor: EMISOR.IA,
                                hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            }]
                        };
                    }
                    return chat;
                }));
            }
        }
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
            archivado: false,
            noLeidos: 0
        };
        setChats(prev => [nuevoChat, ...prev]);
        return nuevoChat.id;
    }, [chats]);

    const agregarNuevoContacto = useCallback((nombre) => {
        const nuevo = {
            id: crypto.randomUUID(),
            nombre,
            tipo: EMISOR.CONTACTO,
            avatar: ""
        };
        setContactos(prev => [...prev, nuevo]);
        return nuevo;
    }, []);

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

    const confirmarReenvio = useCallback((contactoDestino) => {
        if (!mensajeAReenviar) return;

        let chatIdDestino = iniciarChatConContacto(contactoDestino);

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
                            esReenvio: true,
                            hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        }]
                    };
                }
                return chat;
            }));
        }, 0);

        setMensajeAReenviar(null);
        return chatIdDestino;
    }, [mensajeAReenviar, iniciarChatConContacto]);

    const valorContexto = useMemo(() => ({
        chats, contactos, usuarioActual, setUsuarioActual,
        enviarMensaje, eliminarMensaje, iniciarChatConContacto, agregarNuevoContacto,
        bloquearContacto, desbloquearContacto, eliminarChat, toggleFavorito, toggleArchivado,
        mensajeCitado, setMensajeCitado, mensajeAReenviar, setMensajeAReenviar, confirmarReenvio,
        marcarComoLeido
    }), [
        chats, contactos, usuarioActual, mensajeCitado, mensajeAReenviar,
        enviarMensaje, eliminarMensaje, iniciarChatConContacto, agregarNuevoContacto,
        bloquearContacto, desbloquearContacto, eliminarChat, toggleFavorito, toggleArchivado, confirmarReenvio,
        marcarComoLeido
    ]);

    return (
        <ChatContext.Provider value={valorContexto}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);