import React from "react";
import { EMISOR } from "../../Utils/constants";
import Avatar from "../Avatar/Avatar";
import MessageOptionsMenu from "../MessageOptionsMenu/MessageOptionsMenu"; // ✨ Importar menú
import "./MessageBubble.css";

const MessageBubble = ({ texto, emisor, avatarContacto, nombreContacto, mostrarAvatar, hora, esGrupo, cita, id }) => {
    const esMio = emisor === EMISOR.USUARIO;

    // Objeto mensaje completo para pasar al menú
    const objetoMensaje = { id, texto, emisor, nombreContacto, cita };

    return (
        <div className={`mensaje-fila ${esMio ? "fila-mia" : "fila-suya"}`}>

            {!esMio && mostrarAvatar && (
                <div className="mensaje-avatar">
                    <Avatar imagen={avatarContacto} nombre={nombreContacto} isIA={emisor === EMISOR.IA} />
                </div>
            )}

            <div className={`mensaje-burbuja ${esMio ? "mi-mensaje" : "su-mensaje"}`}>
                {/* ✨ Flechita de menú desplegable */}
                <MessageOptionsMenu mensaje={objetoMensaje} />

                {/* ✨ VISUALIZACIÓN DE CITA (REPLY) */}
                {cita && (
                    <div className="mensaje-citado-bloque">
                        <span className="citado-autor">
                            {cita.emisor === EMISOR.USUARIO ? "Tú" : cita.nombreContacto || "Contacto"}
                        </span>
                        <p className="citado-texto">{cita.texto}</p>
                    </div>
                )}

                {esGrupo && !esMio && (
                    <span className="mensaje-nombre-autor">{nombreContacto}</span>
                )}

                <span>{texto}</span>

                <div className="mensaje-meta">
                    <span className="mensaje-hora">{hora || "12:00"}</span>
                    {esMio && (
                        <span className="material-symbols-outlined icono-leido">done_all</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;