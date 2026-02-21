import React from "react";
import { EMISOR } from "../../Utils/constants";
import Avatar from "../Avatar/Avatar";
import "./MessageBubble.css";

const MessageBubble = ({ texto, emisor, avatarContacto, nombreContacto, mostrarAvatar, hora }) => {
    const esMio = emisor === EMISOR.YO;

    return (
        <div className={`message-wrapper ${esMio ? "is-mine" : "is-other"}`}>
            {/* Si no es mío y debe mostrar avatar (grupos/IA), lo mostramos */}
            {!esMio && mostrarAvatar && (
                <div className="message-avatar-container">
                    <Avatar imagen={avatarContacto} nombre={nombreContacto} isIA={emisor === EMISOR.IA} />
                </div>
            )}

            <div className="message-bubble">
                <span className="message-text">{texto}</span>
                
                {/* ✨ Contenedor del horario y las tildes */}
                <div className="message-meta">
                    <span className="message-time">{hora || "12:00"}</span>
                    
                    {/* Solo si el mensaje es mío, mostramos la doble tilde azul */}
                    {esMio && (
                        <span className="material-symbols-outlined icon-read">
                            done_all
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;