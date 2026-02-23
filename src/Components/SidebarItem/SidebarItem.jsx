import React from "react";
import { NavLink } from "react-router";
import { EMISOR } from "../../Utils/constants"; 
import Avatar from "../Avatar/Avatar";

const SidebarItem = ({ chat }) => {
    const { id, nombre, avatar, tipo, mensajes } = chat;

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
                <p className="chat-preview">{ultimoMensaje}</p>
            </div>
        </NavLink>
    );
};

export default SidebarItem;