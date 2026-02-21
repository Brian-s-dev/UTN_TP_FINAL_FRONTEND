import React from "react";
import { NavLink } from "react-router";
import { EMISOR } from "../../Utils/constants"; // Importamos la constante
import Avatar from "../Avatar/Avatar";

const SidebarItem = ({ chat }) => {
    const { id, nombre, avatar, tipo } = chat;

    return (
        <NavLink 
            to={`/chat/${id}`}
            className={({ isActive }) => isActive ? "chat-item active" : "chat-item"}
        >
            {/* ✨ Le avisamos al Avatar si este chat es de tipo IA */}
            <Avatar imagen={avatar} nombre={nombre} isIA={tipo === EMISOR.IA} />
            <div className="chat-info">
                <h4 className="chat-name">{nombre}</h4>
                <p className="chat-preview">Haz clic para entrar</p>
            </div>
        </NavLink>
    );
};

export default SidebarItem;