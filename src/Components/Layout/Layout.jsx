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
    const [perfilAbierto, setPerfilAbierto] = useState(false);
    
    // Inicializamos asumiendo la vista correcta según pantalla
    const [sidebarColapsado, setSidebarColapsado] = useState(window.innerWidth <= 900 && location.pathname !== "/"); 

    const chatsFiltrados = chats.filter(chat => 
        chat.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    // ✨ EL CEREBRO DEFINITIVO
    useEffect(() => {
        const checkLayout = () => {
            setPerfilAbierto(false); 

            if (window.innerWidth <= 900) {
                // TABLET Y MÓVIL (<= 900px)
                if (location.pathname === "/") {
                    setSidebarColapsado(false); // Expandido: Muestra 100% la lista de chats
                } else {
                    setSidebarColapsado(true);  // Colapsado: Entró a un chat, colapsa la barra
                    setSidebarContactosAbierto(false); 
                }
            } else {
                // ESCRITORIO (> 900px)
                if (location.pathname === "/") {
                    setSidebarColapsado(false); // En PC la barra arranca abierta
                }
                if (location.pathname.includes("/chat/")) {
                    setSidebarContactosAbierto(false);
                }
            }
        };

        checkLayout(); // Ejecuta al montar/cambiar ruta
        window.addEventListener('resize', checkLayout); // Ejecuta si arrastras la ventana
        return () => window.removeEventListener('resize', checkLayout);
    }, [location.pathname]);

    const handleAbrirContactos = () => {
        setSidebarColapsado(false); 
        setSidebarContactosAbierto(true);
    };

    return (
        <div className="layout-container">
            <aside className={`sidebar-container ${sidebarColapsado ? 'colapsado' : ''}`}>
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
                    <div className="mi-perfil clickable" onClick={() => setPerfilAbierto(true)} title="Ver Perfil">
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
            
            <main className="component-wrapper">
                <Outlet />
            </main>

            {/* SIDEBAR DERECHO DE MI PERFIL */}
            <div className={`profile-sidebar ${perfilAbierto ? 'abierto' : ''}`}>
                <div className="profile-sidebar-header">
                    <button className="btn-icon" onClick={() => setPerfilAbierto(false)} title="Cerrar info">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    <h3>Perfil</h3>
                </div>

                <div className="profile-sidebar-body">
                    <div className="profile-avatar-wrapper">
                        <Avatar nombre={usuarioActual} />
                    </div>
                    <div className="profile-info-card">
                        <span className="profile-label">Tu nombre</span>
                        <div className="profile-value-row">
                            <span className="profile-value">{usuarioActual}</span>
                            <button className="btn-icon-small" title="Editar nombre">
                                <span className="material-symbols-outlined">edit</span>
                            </button>
                        </div>
                        <p className="profile-disclaimer">Este no es tu nombre de usuario ni tu PIN. Este nombre será visible para tus contactos de la aplicación.</p>
                    </div>
                    <div className="profile-info-card">
                        <span className="profile-label">Info.</span>
                        <div className="profile-value-row">
                            <span className="profile-value">¡Hola! Estoy usando React.</span>
                            <button className="btn-icon-small" title="Editar info">
                                <span className="material-symbols-outlined">edit</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Layout;