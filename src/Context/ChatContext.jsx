import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { EMISOR } from "../Utils/constants";
import { chatsIniciales, contactosIniciales } from "../Data/ChatData";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ✨ Configuración de Gemini
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
let genAI = null;

if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
} else {
    console.warn("⚠️ VITE_GEMINI_API_KEY no encontrada. El chat con IA no responderá.");
}

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    // Inicializamos estado
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

    const marcarComoLeido = useCallback((chatId) => {
        setChats(prev => prev.map(chat => {
            if (chat.id == chatId && chat.noLeidos > 0) {
                return { ...chat, noLeidos: 0 };
            }
            return chat;
        }));
    }, []);

    // ========================================================================
    // ✨ FUNCIÓN ENVIAR MENSAJE (CON FALLBACK DE MODELOS)
    // ========================================================================
    const enviarMensaje = useCallback(async (chatId, texto) => {

        // 1. Agregar mensaje del USUARIO
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

        setMensajeCitado(null);

        // 2. LÓGICA IA
        if (chatId == 1) {
            if (!genAI) return;

            try {
                // ✨ ESTRATEGIA DE RESPALDO:
                // Intentaremos estos modelos en orden. Si uno falla (404 o 429), probamos el siguiente.
                const modelosAProbar = [
                    "gemini-1.5-flash", // El más rápido y estable (Free Tier)
                    "gemini-1.5-pro",   // Alternativa potente
                    "gemini-pro"        // El clásico (máxima compatibilidad)
                ];

                let stream = null;
                let modeloUsado = "";

                // A. ID y Hora IA
                const idMensajeIA = crypto.randomUUID();
                const horaIA = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                // B. Burbuja VACÍA
                setChats(prevChats => prevChats.map(chat => {
                    if (chat.id == chatId) {
                        return {
                            ...chat,
                            mensajes: [...chat.mensajes, {
                                id: idMensajeIA,
                                texto: "...", // Indicador de carga
                                emisor: EMISOR.IA,
                                hora: horaIA
                            }]
                        };
                    }
                    return chat;
                }));

                // C. Intentar conectar con algún modelo
                for (const nombreModelo of modelosAProbar) {
                    try {
                        const model = genAI.getGenerativeModel({ model: nombreModelo });
                        const result = await model.generateContentStream(texto);
                        stream = result.stream;
                        modeloUsado = nombreModelo;
                        console.log(`✅ Conectado exitosamente con: ${nombreModelo}`);
                        break; // ¡Éxito! Salimos del bucle
                    } catch (e) {
                        console.warn(`❌ Falló modelo ${nombreModelo}:`, e.message);
                        // Continuamos al siguiente modelo...
                    }
                }

                if (!stream) {
                    throw new Error("Ningún modelo disponible funcionó.");
                }

                let textoAcumulado = "";

                // D. Bucle de escritura (Streaming)
                for await (const chunk of stream) {
                    const chunkText = chunk.text();
                    textoAcumulado += chunkText;

                    setChats(prevChats => prevChats.map(chat => {
                        if (chat.id == chatId) {
                            return {
                                ...chat,
                                mensajes: chat.mensajes.map(msg =>
                                    msg.id === idMensajeIA
                                        ? { ...msg, texto: textoAcumulado }
                                        : msg
                                )
                            };
                        }
                        return chat;
                    }));
                }

            } catch (error) {
                console.error("Error fatal en IA:", error);

                let errorMsg = "No pude conectar con ningún modelo de IA disponible.";
                if (error.message.includes("429")) errorMsg = "Has excedido tu cuota gratuita de hoy.";

                setChats(prevChats => prevChats.map(chat => {
                    if (chat.id == chatId) {
                        return {
                            ...chat,
                            mensajes: chat.mensajes.map(msg =>
                                // Reemplazamos el mensaje de carga con el error
                                msg.emisor === EMISOR.IA && msg.texto === "..."
                                    ? { ...msg, texto: errorMsg }
                                    : msg
                            )
                        };
                    }
                    return chat;
                }));
            }
        }
    }, [mensajeCitado]);

    // ... (El resto de funciones: eliminarMensaje, iniciarChat, etc. siguen igual) ...

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