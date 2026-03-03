import React from "react";
import { useNavigate, useLocation } from "react-router";
import { EMISOR } from "../../Utils/constants";
import Avatar from "../Avatar/Avatar";
import OpcionesChatsMenu from "../OpcionesChatsMenu/OpcionesChatsMenu";
import "./SidebarItem.css";

const SidebarItem = ({ chat }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const { id, nombre, avatar, tipo, mensajes, esFavorito, noLeidos } = chat;

    const ultimoMensaje = mensajes && mensajes.length > 0
        ? mensajes[mensajes.length - 1].texto
        : "No hay mensajes aún";

    const ultimoObj = mensajes && mensajes.length > 0 ? mensajes[mensajes.length - 1] : null;
    const horaMensaje = ultimoObj ? ultimoObj.hora : "";

    const isActive = location.pathname === `/chat/${id}`;

    const handleClick = () => {
        navigate(`/chat/${id}`);
    };

    return (
        <div
            onClick={handleClick}
            className={`chat-item ${isActive ? "active" : ""}`}
        >
            <Avatar imagen={avatar} nombre={nombre} isIA={tipo === EMISOR.IA} />

            <div className="chat-info">
                <div className="chat-info-header">
                    <h4 className="chat-name">{nombre}</h4>
                    <span className={`chat-time ${noLeidos > 0 ? 'unread-time' : ''}`}>
                        {horaMensaje}
                    </span>
                </div>

                <div className="chat-info-bottom">
                    <p className="chat-preview">
                        {esFavorito && (
                            <span className="material-symbols-outlined icon-star">star</span>
                        )}
                        {ultimoMensaje}
                    </p>

                    {noLeidos > 0 && (
                        <div className="unread-badge">
                            {noLeidos}
                        </div>
                    )}
                </div>
            </div>

            <div className="chat-options-wrapper">
                <OpcionesChatsMenu chat={chat} />
            </div>
        </div>
    );
};

export default SidebarItem;