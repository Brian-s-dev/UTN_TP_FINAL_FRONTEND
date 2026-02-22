import React from "react";
import { EMISOR } from "../../Utils/constants";
import Avatar from "../Avatar/Avatar";
import "./MessageBubble.css";

const MessageBubble = ({ texto, emisor, avatarContacto, nombreContacto, mostrarAvatar, hora, esGrupo }) => {
    const esMio = emisor === EMISOR.USUARIO;

    return (
        <div className={`mensaje-fila ${esMio ? "fila-mia" : "fila-suya"}`}>
            
            {!esMio && mostrarAvatar && (
                <div className="mensaje-avatar">
                    <Avatar imagen={avatarContacto} nombre={nombreContacto} isIA={emisor === EMISOR.IA} />
                </div>
            )}

            <div className={`mensaje-burbuja ${esMio ? "mi-mensaje" : "su-mensaje"}`}>
                
                {/* ✨ Si es un grupo y el mensaje no es mío, mostramos el nombre del autor */}
                {esGrupo && !esMio && (
                    <span className="mensaje-nombre-autor">{nombreContacto}</span>
                )}
                
                <span>{texto}</span>
                
                <div className="mensaje-meta">
                    <span className="mensaje-hora">{hora || "12:00"}</span>
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