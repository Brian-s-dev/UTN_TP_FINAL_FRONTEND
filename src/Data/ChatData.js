import { EMISOR } from "../Utils/constants";

export const chatsIniciales = [
    {
        id: 1,
        nombre: "Chat IA",
        tipo: EMISOR.IA,
        avatar: "https://robohash.org/chat-ia?set=set3&bgset=bg1",
        mensajes: [
            { id: "msg-1-1", texto: "Hola, ¿en qué puedo ayudarte hoy?", emisor: EMISOR.IA, hora: "09:00" },
            { id: "msg-1-2", texto: "Necesito ayuda para centrar un div con CSS.", emisor: EMISOR.USUARIO, hora: "09:02" },
            { id: "msg-1-3", texto: "¡Claro! La forma más moderna es usar Flexbox. Solo aplícale al contenedor padre: display: flex; justify-content: center; align-items: center;", emisor: EMISOR.IA, hora: "09:03" }
        ]
    },
    {
        id: 2, 
        nombre: "Chat UTN Front-End", 
        tipo: EMISOR.GRUPO, 
        avatar: "https://ui-avatars.com/api/?name=UTN+Front&background=00a884&color=fff", 
        mensajes: [
            { id: "msg-2-1", texto: "Hoy cené empanadas de nuevo...", emisor: EMISOR.CONTACTO, hora: "21:30", remitenteNombre: "Matias", remitenteAvatar: "https://i.pravatar.cc/150?u=matias" },
            { id: "msg-2-2", texto: "Jajaja yo pedí una pizza, no tenía ganas de cocinar.", emisor: EMISOR.USUARIO, hora: "21:32" },
            { id: "msg-2-3", texto: "¡Qué rico! Guarden un poco para el grupo.", emisor: EMISOR.CONTACTO, hora: "21:35", remitenteNombre: "Sofía", remitenteAvatar: "https://i.pravatar.cc/150?u=sofia" },
            { id: "msg-2-4", texto: "Mañana a primera hora subo las notas del TP.", emisor: EMISOR.CONTACTO, hora: "21:40", remitenteNombre: "Profe Carlos", remitenteAvatar: "https://i.pravatar.cc/150?u=profe" }
        ]
    },
    {
        id: 3,
        nombre: "Juan Pérez",
        tipo: EMISOR.CONTACTO,
        avatar: "https://i.pravatar.cc/432?u=juan",
        mensajes: [
            { id: "msg-3-1", texto: "Hola Juan, ¿pudiste revisar el código que te pasé?", emisor: EMISOR.USUARIO, hora: "10:15" },
            { id: "msg-3-2", texto: "¡Hola! Sí, recién lo termino de ver.", emisor: EMISOR.CONTACTO, hora: "10:45" },
            { id: "msg-3-3", texto: "Quedó bárbaro, buen trabajo.", emisor: EMISOR.CONTACTO, hora: "10:46" },
            { id: "msg-3-4", texto: "¡Genial! Gracias por revisarlo.", emisor: EMISOR.USUARIO, hora: "10:50" }
        ]
    },
    {
        id: 4,
        nombre: "María Gómez UX",
        tipo: EMISOR.CONTACTO,
        avatar: "https://i.pravatar.cc/150?u=maria",
        mensajes: [
            { id: "msg-4-1", texto: "Hola, te dejé los nuevos diseños en Figma.", emisor: EMISOR.CONTACTO, hora: "11:00" },
            { id: "msg-4-2", texto: "¡Hola María! Perfecto, ahora los miro y te comento.", emisor: EMISOR.USUARIO, hora: "11:05" },
            { id: "msg-4-3", texto: "Me encantó la paleta de colores. Ya empiezo a maquetarlo.", emisor: EMISOR.USUARIO, hora: "11:20" }
        ]
    },
    {
        id: 5, 
        nombre: "Equipo de Diseño", 
        tipo: EMISOR.GRUPO, 
        avatar: "https://ui-avatars.com/api/?name=Equipo+Diseño&background=6a1b9a&color=fff", 
        mensajes: [
            { id: "msg-5-1", texto: "Chicos, la reunión semanal se pasa a las 15hs.", emisor: EMISOR.CONTACTO, hora: "14:00", remitenteNombre: "Valeria", remitenteAvatar: "https://i.pravatar.cc/150?u=valeria" },
            { id: "msg-5-2", texto: "Dale, agendado. Nos vemos ahí.", emisor: EMISOR.USUARIO, hora: "14:05" },
            { id: "msg-5-3", texto: "Yo me conecto 5 minutitos tarde, ¡espérenme!", emisor: EMISOR.CONTACTO, hora: "14:10", remitenteNombre: "Lucas", remitenteAvatar: "https://i.pravatar.cc/150?u=lucas" }
        ]
    },
    {
        id: 6,
        nombre: "Soporte Técnico",
        tipo: EMISOR.IA,
        avatar: "https://robohash.org/soporte?set=set3",
        mensajes: [
            { id: "msg-6-1", texto: "Bienvenido al soporte automatizado. ¿Cuál es tu problema?", emisor: EMISOR.IA, hora: "16:00" },
            { id: "msg-6-2", texto: "Tengo un error 500 al hacer fetch a la API.", emisor: EMISOR.USUARIO, hora: "16:02" },
            { id: "msg-6-3", texto: "Entendido. Un error 500 indica un problema en el servidor. Revisa los logs de tu backend para más detalles.", emisor: EMISOR.IA, hora: "16:03" }
        ]
    },
    {
        id: 7,
        nombre: "Carlos Dev",
        tipo: EMISOR.CONTACTO,
        avatar: "https://i.pravatar.cc/150?u=carlos",
        mensajes: [
            { id: "msg-7-1", texto: "Carlos, ¿te funciona el entorno local?", emisor: EMISOR.USUARIO, hora: "09:30" },
            { id: "msg-7-2", texto: "Sí, me anda joya. ¿A vos te tira error?", emisor: EMISOR.CONTACTO, hora: "09:35" },
            { id: "msg-7-3", texto: "Sí, un problema con las variables de entorno. Ya lo reviso, debe ser una pavada.", emisor: EMISOR.USUARIO, hora: "09:37" }
        ]
    },
    {
        id: 8,
        nombre: "Ana Proyecto Final",
        tipo: EMISOR.CONTACTO,
        avatar: "https://i.pravatar.cc/150?u=ana",
        mensajes: [
            { id: "msg-8-1", texto: "¿Nos juntamos hoy a avanzar con el proyecto?", emisor: EMISOR.CONTACTO, hora: "18:00" },
            { id: "msg-8-2", texto: "¡De una! Tipo 19hs me conecto al Discord.", emisor: EMISOR.USUARIO, hora: "18:15" },
            { id: "msg-8-3", texto: "Listo, te espero ahí.", emisor: EMISOR.CONTACTO, hora: "18:20" }
        ]
    },
    {
        id: 9,
        nombre: "Profe UTN",
        tipo: EMISOR.CONTACTO,
        avatar: "https://i.pravatar.cc/150?u=profe",
        mensajes: [
            { id: "msg-9-1", texto: "Profe, le mandé el TP por mail. ¿Me confirma si le llegó?", emisor: EMISOR.USUARIO, hora: "12:00" },
            { id: "msg-9-2", texto: "Hola. Sí, lo recibí correctamente. Lo corrijo el fin de semana.", emisor: EMISOR.CONTACTO, hora: "13:15" },
            { id: "msg-9-3", texto: "¡Muchas gracias! Buen fin de semana.", emisor: EMISOR.USUARIO, hora: "13:20" }
        ]
    },
    {
        id: 10,
        nombre: "Laura QA",
        tipo: EMISOR.CONTACTO,
        avatar: "https://i.pravatar.cc/150?u=laura",
        mensajes: [
            { id: "msg-10-1", texto: "Encontré un bug en la vista de login.", emisor: EMISOR.CONTACTO, hora: "15:40" },
            { id: "msg-10-2", texto: "Uh, ¿qué pasa?", emisor: EMISOR.USUARIO, hora: "15:42" },
            { id: "msg-10-3", texto: "Si le das doble clic al botón rápido, manda la petición dos veces.", emisor: EMISOR.CONTACTO, hora: "15:43" },
            { id: "msg-10-4", texto: "Uy, buenísimo el dato. Le agrego un 'disabled' al botón mientras carga. Gracias Laura.", emisor: EMISOR.USUARIO, hora: "15:45" }
        ]
    },

];

export const contactosIniciales = [
    {
        id: "c1", 
        nombre: "Juan Pérez", 
        avatar: "https://i.pravatar.cc/150?u=juan", 
        tipo: EMISOR.CONTACTO 
    },
    { 
        id: "c2", 
        nombre: "María Gómez UX", 
        avatar: "https://i.pravatar.cc/150?u=maria", 
        tipo: EMISOR.CONTACTO 
    },
    { 
        id: "c3", 
        nombre: "Carlos Dev", 
        avatar: "https://i.pravatar.cc/150?u=carlos", 
        tipo: EMISOR.CONTACTO 
    },
    {
        id: "c4", 
        nombre: "Ana Proyecto Final", 
        avatar: "https://i.pravatar.cc/150?u=ana", 
        tipo: EMISOR.CONTACTO 
    },
    { 
        id: "c5", 
        nombre: "Profe UTN", 
        avatar: "https://i.pravatar.cc/150?u=profe", 
        tipo: EMISOR.CONTACTO 
    },
    { 
        id: "c6", 
        nombre: "Laura QA", 
        avatar: "https://i.pravatar.cc/150?u=laura", 
        tipo: EMISOR.CONTACTO 
    },
    { 
        id: "c7", 
        nombre: "Marcos Backend", 
        avatar: "https://i.pravatar.cc/150?u=marcos", 
        tipo: EMISOR.CONTACTO 
    },
];