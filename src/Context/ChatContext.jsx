import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = (
    { children}
) => {
    const [chats, setChats] = useState([
        {
            id: 1,
            nombre: "Chat IA",
            tipo: "ia",
            mensajes: [
                {
                    id: 1,
                    texto: "Hola, ¿en qué puedo ayudarte hoy?",
                    emisor: "ia"
                }
            ]
        },
        {
            id: 2,
            nombre: "Chat UTN Front-End",
            tipo: "grupo",
            mensajes: [
                {
                    id: 1,
                    texto: "Hoy cené empanadas de nuevo, todos los martes y jueves lo mismo -.-'",
                    emisor: "contacto"
                }
            ]
        }
    ]);

    const enviarMensaje = (chatId, texto) => {
        setChats(prevChats => prevChats.map(chat => {
            if (chat.id === Number(chatId)) {
                return {
                    ...chat,
                    mensajes: [
                        ...chat.mensajes,
                        {
                            id: Date.now(),
                            texto,
                            emisor: "usuario"
                        }
                    ]
                }
            }
            return chat;
        }))
    }

    return (
        <ChatContext.Provider value={{ chats, enviarMensaje }}>
            {children}
        </ChatContext.Provider> 
    )
}

export const useChat = () => useContext(ChatContext);

