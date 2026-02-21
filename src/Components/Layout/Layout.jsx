import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { useChat } from "../../Context/ChatContext";
import { useTheme } from "../../Context/ThemeContext";
import SidebarItem from "../SidebarItem/SidebarItem";
import Avatar from "../Avatar/Avatar";
import "./Layout.css";

const Layout = () => {
    const { chats, agregarNuevoChat, usuarioActual } = useChat();
    const { tema, toggleTema } = useTheme();
    const navigate = useNavigate();
    
    const [busqueda, setBusqueda] = useState("");
    const [menuAbierto, setMenuAbierto] = useState(false);

    const chatsFiltrados = chats.filter(chat => 
        chat.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    const handleCrearChat = () => {
        const nombre = prompt("Ingresa el nombre del nuevo contacto:");
        if (nombre && nombre.trim() !== "") {
            const nuevoId = agregarNuevoChat(nombre);
            navigate(`/chat/${nuevoId}`);
        }
    };

    return (
        <div className="layout-container">
            <aside className="sidebar-container">
                <div className="sidebar-header">
                    <div className="sidebar-header-top">
                        <h2>Mensajes</h2>
                        {/* ✨ Cambiamos el "+" por el icono de nuevo chat */}
                        <button className="btn-nuevo-chat" onClick={handleCrearChat} title="Nuevo Chat">
                            <span className="material-symbols-outlined">chat</span>
                        </button>
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

                <nav className="sidebar-nav">
                    {chatsFiltrados.length === 0 ? (
                        <p className="no-results">No se encontraron chats.</p>
                    ) : (
                        chatsFiltrados.map((chat) => (
                            <SidebarItem key={chat.id} chat={chat} />
                        ))
                    )}
                </nav>

                <div className="sidebar-footer">
                    <div className="mi-perfil">
                        <Avatar nombre={usuarioActual} />
                        <span className="mi-nombre">{usuarioActual}</span>
                    </div>
                    
                    <div className="config-container">
                        {/* ✨ Cambiamos el "⚙️" por el icono de ajustes */}
                        <button 
                            className="btn-ajustes" 
                            title="Ajustes"
                            onClick={() => setMenuAbierto(!menuAbierto)}
                        >
                            <span className="material-symbols-outlined">settings</span>
                        </button>

                        {menuAbierto && (
                            <div className="menu-flotante">
                                {/* ✨ Cambiamos los emojis por iconos y los alineamos */}
                                <button 
                                    onClick={() => {
                                        toggleTema();
                                        setMenuAbierto(false);
                                    }}
                                    style={{ display: "flex", alignItems: "center", gap: "8px" }}
                                >
                                    <span className="material-symbols-outlined">
                                        {tema === "dark" ? "light_mode" : "dark_mode"}
                                    </span>
                                    {tema === "dark" ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </aside>
            <main className="component-wrapper">
                <Outlet />
            </main>
        </div >
    );
};

export default Layout;