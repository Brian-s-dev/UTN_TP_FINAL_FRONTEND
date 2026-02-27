import React from "react";
import { NavLink } from "react-router";
import { EMISOR } from "../../Utils/constants";
import Avatar from "../Avatar/Avatar";
import OpcionesChatsMenu from "../OpcionesChatsMenu/OpcionesChatsMenu";
import "./SidebarItem.css"; // (Asegúrate de que exista o usa el CSS global si prefieres)

const SidebarItem = ({ chat }) => {
    const { id, nombre, avatar, tipo, mensajes, esFavorito } = chat;

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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 className="chat-name">{nombre}</h4>
                    {esFavorito && <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#00a884', marginLeft: '5px' }}>star</span>}
                </div>
                <p className="chat-preview">{ultimoMensaje}</p>
            </div>

            {/* ✨ Aquí va el menú de 3 puntos */}
            <div className="chat-options-wrapper">
                <OpcionesChatsMenu chat={chat} />
            </div>
        </NavLink>
    );
};

export default SidebarItem;