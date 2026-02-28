import React from "react";
import { useNavigate, useLocation } from "react-router"; // Usamos hooks para navegar
import { EMISOR } from "../../Utils/constants";
import Avatar from "../Avatar/Avatar";
import OpcionesChatsMenu from "../OpcionesChatsMenu/OpcionesChatsMenu";
// Asegúrate de importar el CSS si no es global, o que SidebarItem.css exista
// import "./SidebarItem.css"; 

const SidebarItem = ({ chat }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const { id, nombre, avatar, tipo, mensajes, esFavorito } = chat;

    const ultimoMensaje = mensajes && mensajes.length > 0
        ? mensajes[mensajes.length - 1].texto
        : "No hay mensajes aún";

    // Verificamos si este chat es el activo
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 className="chat-name">{nombre}</h4>
                    {/* Icono de estrella visible si es favorito */}
                    {esFavorito && (
                        <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#00a884', marginLeft: '5px' }}>
                            star
                        </span>
                    )}
                </div>
                <p className="chat-preview">{ultimoMensaje}</p>
            </div>

            {/* Menú de opciones - Al hacer clic aquí, el stopPropagation dentro del menú evitará que se ejecute handleClick */}
            <div className="chat-options-wrapper">
                <OpcionesChatsMenu chat={chat} />
            </div>
        </div>
    );
};

export default SidebarItem;