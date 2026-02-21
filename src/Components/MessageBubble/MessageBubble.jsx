import React from "react";
import { EMISOR } from "../../Utils/constants";
import Avatar from "../Avatar/Avatar";
import "./MessageBubble.css";

const MessageBubble = ({ texto, emisor, avatarContacto, nombreContacto, mostrarAvatar, hora }) => {
    // ✨ Usamos EMISOR.USUARIO como definimos en tus constantes
    const esMio = emisor === EMISOR.USUARIO;

    return (
        // ✨ Clases en español coincidiendo con MessageBubble.css
        <div className={`mensaje-fila ${esMio ? "fila-mia" : "fila-suya"}`}>
            
            {/* Avatar del contacto/IA */}
            {!esMio && mostrarAvatar && (
                <div className="mensaje-avatar">
                    <Avatar imagen={avatarContacto} nombre={nombreContacto} isIA={emisor === EMISOR.IA} />
                </div>
            )}

            {/* Burbuja de chat con su respectivo color */}
            <div className={`mensaje-burbuja ${esMio ? "mi-mensaje" : "su-mensaje"}`}>
                <span>{texto}</span>
                
                {/* Contenedor del horario y las tildes */}
                <div className="mensaje-meta">
                    <span className="mensaje-hora">{hora || "12:00"}</span>
                    
                    {/* Solo si es mío, mostramos la doble tilde azul */}
                    {esMio && (
                        <span className="material-symbols-outlined icono-leido">
                            done_all
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;