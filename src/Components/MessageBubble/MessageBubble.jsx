import React from "react";
import { EMISOR } from "../../Utils/constants";
import Avatar from "../Avatar/Avatar";
import "./MessageBubble.css";

const MessageBubble = ({ texto, emisor, avatarContacto, nombreContacto, mostrarAvatar }) => {
    const esMio = emisor === EMISOR.USUARIO;
    const claseBurbuja = esMio ? 'mi-mensaje' : 'su-mensaje';

    return (
        <div className={`mensaje-fila ${esMio ? 'fila-mia' : 'fila-suya'}`}>
            {!esMio && mostrarAvatar && (
                <div className="mensaje-avatar">
                    <Avatar imagen={avatarContacto} nombre={nombreContacto} />
                </div>
            )}
            <div className={`mensaje-burbuja ${claseBurbuja}`}>
                {texto}
            </div>
        </div>
    );
};

export default MessageBubble;