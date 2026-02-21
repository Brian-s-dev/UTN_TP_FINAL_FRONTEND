import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { useChat } from "../../Context/ChatContext";
import { useTheme } from "../../Context/ThemeContext";
import SidebarItem from "../SidebarItem/SidebarItem";
import Avatar from "../Avatar/Avatar";
import NewChatModal from "../NewChatModal/NewChatModal"; // ✨ Importamos el Modal
import "./Layout.css";

const Layout = () => {
    const { chats, agregarNuevoChat, usuarioActual } = useChat();
    const { tema, toggleTema } = useTheme();
    const navigate = useNavigate();
    
    const [busqueda, setBusqueda] = useState("");
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [modalAbierto, setModalAbierto] = useState(false);

    const chatsFiltrados = chats.filter(chat => 
        chat.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    const handleAbrirModal = () => {
        setModalAbierto(true);
        setMenuAbierto(false); 
    };

    // ✨ Ahora esta función recibe el nombre directamente desde el Modal
    const confirmarCrearChat = (nombreNuevoChat) => {
        const nuevoId = agregarNuevoChat(nombreNuevoChat);
        setModalAbierto(false);
        navigate(`/chat/${nuevoId}`);
    };

    return (
        <div className="layout-container">
            <aside className="sidebar-container">
                <div className="sidebar-header">
                    <div className="sidebar-header-top">
                        <h2>Mensajes</h2>
                        <button className="btn-nuevo-chat" onClick={handleAbrirModal} title="Nuevo Chat">
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
                        <button 
                            className="btn-ajustes" 
                            title="Ajustes"
                            onClick={() => setMenuAbierto(!menuAbierto)}
                        >
                            <span className="material-symbols-outlined">settings</span>
                        </button>

                        {menuAbierto && (
                            <div className="menu-flotante">
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

            {/* ✨ Llamamos al componente limpio */}
            <NewChatModal 
                isOpen={modalAbierto} 
                onClose={() => setModalAbierto(false)} 
                onCrear={confirmarCrearChat} 
            />
        </div >
    );
};

export default Layout;