import React from "react";
import Avatar from "../Avatar/Avatar";
import "./SidebarHeader.css";

const SidebarHeader = ({
    sidebarColapsado, setSidebarColapsado, handleAbrirContactos,
    setPerfilAbierto, usuarioActual, busqueda, setBusqueda
}) => {
    return (
        <div className="sidebar-header">
            <div className="sidebar-header-top">
                <h2>Mensajes</h2>
                <div className="header-buttons">
                    <button
                        className="btn-colapsar"
                        onClick={() => setSidebarColapsado(!sidebarColapsado)}
                        title={sidebarColapsado ? "Expandir panel" : "Colapsar panel"}
                    >
                        <span className="material-symbols-outlined">
                            {sidebarColapsado ? 'menu' : 'keyboard_double_arrow_left'}
                        </span>
                    </button>

                    <button className="btn-nuevo-chat" onClick={handleAbrirContactos} title="Nuevo Chat">
                        <span className="material-symbols-outlined icon-small">chat</span>
                    </button>

                    <div className="mobile-header-avatar clickable" onClick={() => setPerfilAbierto(true)} title="Ver Perfil">
                        <Avatar nombre={usuarioActual} />
                    </div>
                </div>
            </div>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Buscar un chat..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
            </div>
        </div>
    );
};
export default SidebarHeader;