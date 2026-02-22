import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { useChat } from "../../Context/ChatContext";
import { useTheme } from "../../Context/ThemeContext";
import SidebarItem from "../SidebarItem/SidebarItem";
import Avatar from "../Avatar/Avatar";
import ContactsSidebar from "../ContactsSidebar/ContactsSidebar";
import "./Layout.css";

const Layout = () => {
    const { chats, usuarioActual } = useChat();
    const { tema, toggleTema } = useTheme();
    const navigate = useNavigate();
    const location = useLocation(); 
    
    const [busqueda, setBusqueda] = useState("");
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [sidebarContactosAbierto, setSidebarContactosAbierto] = useState(false);
    
    // ✨ Inicializamos el estado dependiendo del tamaño de pantalla
    const [sidebarColapsado, setSidebarColapsado] = useState(window.innerWidth <= 900); 

    const chatsFiltrados = chats.filter(chat => 
        chat.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    // ✨ UX MÁGICA PARA MÓVILES: Auto-colapsar o expandir según dónde estemos
    useEffect(() => {
        if (window.innerWidth <= 900) {
            if (location.pathname === "/") {
                setSidebarColapsado(false); // Si vamos al inicio, expandimos la lista
            } else if (location.pathname.includes("/chat/")) {
                setSidebarColapsado(true); // Si entramos a un chat, colapsamos la lista a 85px
            }
        }
    }, [location.pathname]);

    const handleAbrirContactos = () => {
        setSidebarColapsado(false); 
        setSidebarContactosAbierto(true);
    };

    return (
        <div className="layout-container">
            {/* ✨ Quitamos la lógica destructiva de ocultar, ahora todo depende de "colapsado" */}
            <aside className={`sidebar-container ${sidebarColapsado ? 'colapsado' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-header-top">
                        <h2>Mensajes</h2>
                        
                        <div className="header-buttons">
                            {/* EL BOTÓN AHORA ES VISIBLE SIEMPRE */}
                            <button 
                                className="btn-colapsar" 
                                onClick={() => setSidebarColapsado(!sidebarColapsado)} 
                                title={sidebarColapsado ? "Expandir panel" : "Colapsar panel"}
                            >
                                <span className="material-symbols-outlined">
                                    {sidebarColapsado ? 'menu' : 'keyboard_double_arrow_left'}
                                </span>
                            </button>
                            
                            <button 
                                className="btn-nuevo-chat" 
                                onClick={handleAbrirContactos} 
                                title="Nuevo Chat"
                            >
                                <span className="material-symbols-outlined">chat</span>
                            </button>
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

                <ContactsSidebar 
                    isOpen={sidebarContactosAbierto} 
                    onClose={() => setSidebarContactosAbierto(false)} 
                />
            </aside>
            
            {/* ✨ El chat ahora está siempre renderizado, ocupando el espacio que la barra le deja */}
            <main className="component-wrapper">
                <Outlet />
            </main>
        </div >
    );
};

export default Layout;