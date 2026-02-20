import React from "react";
import { NavLink } from "react-router";
import Avatar from "../Avatar/Avatar";

const SidebarItem = ({ chat }) => {
    const { id, nombre, avatar } = chat;

    return (
        <NavLink 
            to={`/chat/${id}`}
            className={({ isActive }) => isActive ? "chat-item active" : "chat-item"}
        >
            <Avatar imagen={avatar} nombre={nombre} />
            <div className="chat-info">
                <h4 className="chat-name">{nombre}</h4>
                <p className="chat-preview">Haz clic para entrar</p>
            </div>
        </NavLink>
    );
};

export default SidebarItem;