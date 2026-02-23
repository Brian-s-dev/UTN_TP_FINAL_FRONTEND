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
    
    // Estado inicial
    const [sidebarColapsado, setSidebarColapsado] = useState(window.innerWidth <= 900); 

    const chatsFiltrados = chats.filter(chat => 
        chat.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    // ✨ EL CEREBRO DE NAVEGACIÓN Y RESPONSIVE
    useEffect(() => {
        const ajustarLayout = () => {
            // 1. Siempre que cambiamos de ruta, cerramos los paneles superpuestos por precaución
            setPerfilAbierto(false);
            setSidebarContactosAbierto(false);

            // 2. Lógica según el tamaño de pantalla
            if (window.innerWidth <= 900) {
                // Si la pantalla es <= 900px y la URL dice "/chat/...", forzamos el colapso
                if (location.pathname.includes("/chat/")) {
                    setSidebarColapsado(true);
                } else {
                    // Si volvemos al inicio ("/"), expandimos la barra para ver los chats
                    setSidebarColapsado(false);
                }
            } else {
                // En PC (> 900px), la barra principal siempre está expandida por defecto
                setSidebarColapsado(false);
            }
        };

        // Ejecutamos la validación cada vez que la URL cambie
        ajustarLayout();

    }, [location.pathname]); // ✨ Escucha atentamente los cambios de ruta

    // ✨ Escuchamos también si el usuario arrastra la ventana del navegador manualmente
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 900 && location.pathname.includes("/chat/")) {
                setSidebarColapsado(true);
            } else if (window.innerWidth > 900) {
                setSidebarColapsado(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [location.pathname]);

    const handleAbrirContactos = () => {
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
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Layout;