import { EMISOR } from "../Utils/constants";

export const chatsIniciales = [
    { 
        id: 1, 
        nombre: "Chat IA", 
        tipo: EMISOR.IA, 
        avatar: "https://robohash.org/chat-ia?set=set3&bgset=bg1", 
        mensajes: [
            { 
                id: "msg-1", 
                texto: "Hola, ¿en qué puedo ayudarte hoy?", 
                emisor: EMISOR.IA 
            }
        ] 
    },
    { 
        id: 2, 
        nombre: "Chat UTN Front-End", 
        tipo: EMISOR.GRUPO, 
        avatar: "https://ui-avatars.com/api/?name=UTN+Front&background=00a884&color=fff", 
        mensajes: [
            {
                id: "msg-2", 
                texto: "Hoy cené empanadas de nuevo...", 
                emisor: EMISOR.CONTACTO 
            }
        ] 
    },
    { 
        id: 3, 
        nombre: "Juan Pérez", 
        tipo: EMISOR.CONTACTO, 
        avatar: "https://i.pravatar.cc/150?u=juan", 
        mensajes: [] 
    },
    { 
        id: 4, 
        nombre: "María Gómez UX", 
        tipo: EMISOR.CONTACTO, 
        avatar: "https://i.pravatar.cc/150?u=maria", 
        mensajes: [] 
    },
    { 
        id: 5, 
        nombre: "Equipo de Diseño", 
        tipo: EMISOR.GRUPO, 
        avatar: "https://ui-avatars.com/api/?name=Equipo+Diseño&background=6a1b9a&color=fff", 
        mensajes: [] 
    },
    { 
        id: 6, 
        nombre: "Soporte Técnico", 
        tipo: EMISOR.IA, 
        avatar: "https://robohash.org/soporte?set=set3", 
        mensajes: [] 
    },
    { 
        id: 7, 
        nombre: "Carlos Dev", 
        tipo: EMISOR.CONTACTO, 
        avatar: "https://i.pravatar.cc/150?u=carlos", 
        mensajes: [] 
    },
    { 
        id: 8, 
        nombre: "Ana Proyecto Final", 
        tipo: EMISOR.CONTACTO, 
        avatar: "https://i.pravatar.cc/150?u=ana", 
        mensajes: [] 
    },
    { 
        id: 9, 
        nombre: "Profe UTN", 
        tipo: EMISOR.CONTACTO, 
        avatar: "https://i.pravatar.cc/150?u=profe", 
        mensajes: [] 
    },
    { 
        id: 10, 
        nombre: "Laura QA", 
        tipo: EMISOR.CONTACTO, 
        avatar: "https://i.pravatar.cc/150?u=laura", 
        mensajes: [] 
    }
];