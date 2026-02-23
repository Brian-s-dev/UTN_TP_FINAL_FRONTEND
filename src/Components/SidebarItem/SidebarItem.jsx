import React from "react";
import { NavLink } from "react-router"; // (o react-router-dom, según tu versión)
import Avatar from "../Avatar/Avatar";
import { EMISOR } from "../../Utils/constants";

const SidebarItem = ({ chat }) => {
    // ✨ LÓGICA PARA OBTENER EL ÚLTIMO MENSAJE
    // Verificamos si hay mensajes en el array. Si hay, tomamos el texto del último.
    // Si no hay, mostramos un texto por defecto.
    const ultimoMensaje = chat.mensajes && chat.mensajes.length > 0 
        ? chat.mensajes[chat.mensajes.length - 1].texto 
        : "No hay mensajes aún";

    return (
        <NavLink 
            to={`/chat/${chat.id}`} 
            className={({ isActive }) => `chat-item ${isActive ? "active" : ""}`}
        >
            <Avatar 
                imagen={chat.avatar} 
                nombre={chat.nombre} 
                isIA={chat.tipo === EMISOR.IA} 
            />
            <div className="chat-info">
                <h4>{chat.nombre}</h4>
                {/* ✨ Aquí mostramos la previsualización dinámica */}
                <p>{ultimoMensaje}</p>
            </div>
        </NavLink>
    );
};

export default SidebarItem;