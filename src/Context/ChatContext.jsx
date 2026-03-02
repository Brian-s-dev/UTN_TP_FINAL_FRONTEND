import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { EMISOR } from "../Utils/constants";
import { chatsIniciales, contactosIniciales } from "../Data/ChatData";

// Ya no necesitamos importar GoogleGenerativeAI porque usaremos fetch directo

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
    // ✨ FUNCIÓN ENVIAR MENSAJE (USANDO FETCH REST API DIRECTO)
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
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

            if (!apiKey) {
                console.error("Falta la API KEY");
                return;
            }

            // A. Ponemos mensaje de "Escribiendo..." (o cargando)
            const idMensajeIA = crypto.randomUUID();
            const horaIA = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            setChats(prevChats => prevChats.map(chat => {
                if (chat.id == chatId) {
                    return {
                        ...chat,
                        mensajes: [...chat.mensajes, {
                            id: idMensajeIA,
                            texto: "Escribiendo...", // Feedback visual
                            emisor: EMISOR.IA,
                            hora: horaIA
                        }]
                    };
                }
                return chat;
            }));

            try {
                // ✨ APLICANDO TU CÓDIGO DE LA DOCUMENTACIÓN AQUÍ

                // Usamos el modelo que viste en la doc: gemini-3-flash-preview
                // Si falla, cámbialo a: gemini-1.5-flash
                const MODEL_NAME = "gemini-2.5-flash";
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;

                const payload = {
                    contents: [
                        {
                            parts: [{ text: texto }]
                        }
                    ]
                };

                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error?.message || "Error en la petición fetch");
                }

                const data = await response.json();

                // Extraemos el texto según la estructura de Gemini
                const textoIA = data.candidates?.[0]?.content?.parts?.[0]?.text || "No entendí eso.";

                // B. Actualizamos el mensaje con la respuesta real
                setChats(prevChats => prevChats.map(chat => {
                    if (chat.id == chatId) {
                        return {
                            ...chat,
                            mensajes: chat.mensajes.map(msg =>
                                msg.id === idMensajeIA
                                    ? { ...msg, texto: textoIA } // Reemplazamos "Escribiendo..." por la respuesta
                                    : msg
                            )
                        };
                    }
                    return chat;
                }));

            } catch (error) {
                console.error("Error Fetch API:", error);

                let errorMsg = "Error de conexión.";
                if (error.message.includes("404")) errorMsg = "Modelo no encontrado (404).";
                if (error.message.includes("429")) errorMsg = "Cuota excedida o modelo muy ocupado.";
                if (error.message.includes("User location is not supported")) errorMsg = "Tu ubicación no permite usar esta IA.";

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

    // ... (RESTO DEL ARCHIVO IGUAL: eliminarMensaje, iniciarChatConContacto, etc.) ...

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