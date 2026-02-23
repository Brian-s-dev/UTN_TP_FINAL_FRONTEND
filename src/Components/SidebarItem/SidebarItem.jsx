import React from "react";
import { NavLink } from "react-router";
import { EMISOR } from "../../Utils/constants"; 
import Avatar from "../Avatar/Avatar";

const SidebarItem = ({ chat }) => {
    // ✨ Desestructuramos también los "mensajes"
    const { id, nombre, avatar, tipo, mensajes } = chat;

    // ✨ Lógica para obtener el último mensaje:
    // Revisamos si el array de mensajes existe y tiene al menos un elemento.
    // Si es así, tomamos el texto del último elemento. Si no, mostramos un texto por defecto.
    const ultimoMensaje = mensajes && mensajes.length > 0 
        ? mensajes[mensajes.length - 1].texto 
        : "No hay mensajes aún";

    return (
        <NavLink 
            to={`/chat/${id}`}
            className={({ isActive }) => isActive ? "chat-item active" : "chat-item"}
        >
            <Avatar imagen={avatar} nombre={nombre} isIA={tipo === EMISOR.IA} />
            <div className="chat-info">
                <h4 className="chat-name">{nombre}</h4>
                {/* ✨ Mostramos la variable dinámica aquí */}
                <p className="chat-preview">{ultimoMensaje}</p>
            </div>
        </NavLink>
    );
};

export default SidebarItem;