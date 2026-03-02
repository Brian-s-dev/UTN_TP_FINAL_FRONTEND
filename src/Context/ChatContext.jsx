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
    // ✨ FUNCIÓN ENVIAR MENSAJE (CON FALLBACK ROBUSTO)
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

            // A. ID y Hora IA
            const idMensajeIA = crypto.randomUUID();
            const horaIA = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            // B. Burbuja VACÍA (Indicador de carga)
            setChats(prevChats => prevChats.map(chat => {
                if (chat.id == chatId) {
                    return {
                        ...chat,
                        mensajes: [...chat.mensajes, {
                            id: idMensajeIA,
                            texto: "...",
                            emisor: EMISOR.IA,
                            hora: horaIA
                        }]
                    };
                }
                return chat;
            }));

            try {
                // ✨ ESTRATEGIA DE SUPERVIVENCIA:
                // Probamos modelos desde el más nuevo experimental hasta el más antiguo estable
                const modelosAProbar = [
                    "gemini-2.0-flash-exp",    // Experimental (Suele tener cuota aparte)
                    "gemini-1.5-flash-latest", // Última versión estable de flash
                    "gemini-pro",              // El alias "Evergreen" (siempre funciona)
                    "gemini-1.0-pro"           // El legacy (último recurso)
                ];

                let stream = null;
                let modeloUsado = "";
                let ultimoError = null;

                // C. Iterar modelos hasta que uno funcione
                for (const nombreModelo of modelosAProbar) {
                    try {
                        console.log(`Intentando conectar con modelo: ${nombreModelo}...`);
                        const model = genAI.getGenerativeModel({ model: nombreModelo });

                        // Intentamos generar el stream
                        const result = await model.generateContentStream(texto);

                        // Si llegamos aquí, NO falló. Guardamos el stream.
                        stream = result.stream;
                        modeloUsado = nombreModelo;
                        console.log(`✅ ¡Conectado con éxito a ${nombreModelo}!`);
                        break; // Rompemos el bucle for
                    } catch (e) {
                        console.warn(`❌ Falló ${nombreModelo}: ${e.message}`);
                        ultimoError = e;
                        // El bucle continuará con el siguiente modelo
                    }
                }

                if (!stream) {
                    throw ultimoError || new Error("Todos los modelos fallaron.");
                }

                let textoAcumulado = "";

                // D. Consumir el Stream (Escribir respuesta)
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

                let errorMsg = "No pude conectar con la IA. Intenta más tarde.";
                if (error.message.includes("429")) errorMsg = "Cuota excedida. Espera un momento.";
                if (error.message.includes("404")) errorMsg = "Modelos no disponibles (404).";

                setChats(prevChats => prevChats.map(chat => {
                    if (chat.id == chatId) {
                        return {
                            ...chat,
                            mensajes: chat.mensajes.map(msg =>
                                msg.id === idMensajeIA
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

    // ... (RESTO DEL CÓDIGO IGUAL: eliminarMensaje, iniciarChatConContacto, etc.) ...

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