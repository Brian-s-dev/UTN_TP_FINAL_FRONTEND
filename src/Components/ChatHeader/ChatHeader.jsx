import React from "react";
import Avatar from "../Avatar/Avatar";
import "./ChatHeader.css";

const ChatHeader = ({ chatActivo, estadoConexion, setInfoAbierta, navigate }) => {
    return (
        <div className="chat-header-placeholder">
            <div className="chat-header-info clickable" onClick={() => setInfoAbierta(true)} title="Ver información">
                <Avatar imagen={chatActivo.avatar} nombre={chatActivo.nombre} isIA={chatActivo.tipo === "ia"} />
                <div className="chat-header-texto">
                    <h2>{chatActivo.nombre}</h2>
                    {estadoConexion && <span className="chat-status">{estadoConexion}</span>}
                </div>
            </div>

            <button className="btn-volver" onClick={() => navigate("/")} title="Cerrar chat">
                <span className="material-symbols-outlined">arrow_back</span>
            </button>
        </div>
    );
};
export default ChatHeader;