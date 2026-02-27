import React, { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { useChat } from "../../Context/ChatContext";
import { EMISOR } from "../../Utils/constants";
import SidebarItem from "../SidebarItem/SidebarItem";
import ContactsSidebar from "../ContactsSidebar/ContactsSidebar";
import SidebarHeader from "../SidebarHeader/SidebarHeader";
import FilterPills from "../FilterPills/FilterPills";
import SidebarFooter from "../SidebarFooter/SidebarFooter";
import UserProfileSidebar from "../UserProfileSidebar/UserProfileSidebar";
import "./Layout.css";

const Layout = () => {
    const { chats, usuarioActual } = useChat();
    const navigate = useNavigate();
    const location = useLocation();

    // Referencias para detectar clics afuera
    const sidebarRef = useRef(null);
    const profileSidebarRef = useRef(null);

    const [busqueda, setBusqueda] = useState("");
    const [filtroActivo, setFiltroActivo] = useState("Todos");
    const [sidebarContactosAbierto, setSidebarContactosAbierto] = useState(false);
    const [perfilAbierto, setPerfilAbierto] = useState(false);
    const [sidebarColapsado, setSidebarColapsado] = useState(window.innerWidth <= 900);

    const chatsFiltrados = chats.filter(chat => {
        const coincideBusqueda = chat.nombre.toLowerCase().includes(busqueda.toLowerCase());
        let coincideFiltro = true;
        if (filtroActivo === "Grupos") coincideFiltro = chat.tipo === EMISOR.GRUPO;
        else if (filtroActivo === "Mensajes no leídos") coincideFiltro = false;
        return coincideBusqueda && coincideFiltro;
    });

    const misGrupos = chats.filter(chat => chat.tipo === EMISOR.GRUPO);

    const handleAbrirContactos = () => {
        setSidebarColapsado(false); // Expande el sidebar para ver los contactos
        setSidebarContactosAbierto(true);
    };

    const handleNavegarAGrupo = (chatId) => {
        setPerfilAbierto(false);
        navigate(`/chat/${chatId}`);
    };

    const ajustarLayout = () => {
        if (window.innerWidth > 900) setSidebarColapsado(false);
        else setSidebarColapsado(true);
    };

    // ✨ EFECTO MÁGICO: Clics fuera de los menús
    useEffect(() => {
        const handleClickFuera = (event) => {
            // 1. Cerrar Panel de Perfil si clic afuera
            if (perfilAbierto && profileSidebarRef.current && !profileSidebarRef.current.contains(event.target)) {
                // Evitamos cerrar si el clic fue en el botón que lo abre
                if (!event.target.closest('.mi-perfil') && !event.target.closest('.mobile-header-avatar')) {
                    setPerfilAbierto(false);
                }
            }

            // 2. Colapsar Sidebar Principal (y cerrar Contactos) si clic afuera
            if (window.innerWidth <= 900 && !sidebarColapsado && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setSidebarColapsado(true);
                setSidebarContactosAbierto(false); // ✨ Esto cierra el panel de contactos al mismo tiempo
            }
        };

        document.addEventListener("mousedown", handleClickFuera);
        return () => document.removeEventListener("mousedown", handleClickFuera);
    }, [perfilAbierto, sidebarColapsado]);

    useEffect(() => {
        setPerfilAbierto(false);
        setSidebarContactosAbierto(false);
        ajustarLayout();
    }, [location.pathname]);

    useEffect(() => {
        const handleResize = () => ajustarLayout();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [location.pathname]);

    return (
        <div className="layout-container">
            <aside
                ref={sidebarRef}
                className={`sidebar-container ${sidebarColapsado ? 'colapsado' : ''} ${location.pathname.includes("/chat/") ? 'chat-abierto' : ''}`}
            >
                <SidebarHeader
                    sidebarColapsado={sidebarColapsado} setSidebarColapsado={setSidebarColapsado}
                    handleAbrirContactos={handleAbrirContactos}
                    setPerfilAbierto={setPerfilAbierto} usuarioActual={usuarioActual}
                    busqueda={busqueda} setBusqueda={setBusqueda}
                />
                <FilterPills filtroActivo={filtroActivo} setFiltroActivo={setFiltroActivo} />

                <nav className="sidebar-nav">
                    {chatsFiltrados.length === 0 ? (
                        <p className="no-results">No se encontraron chats.</p>
                    ) : (
                        chatsFiltrados.map((chat) => <SidebarItem key={chat.id} chat={chat} />)
                    )}
                </nav>

                <SidebarFooter usuarioActual={usuarioActual} setPerfilAbierto={setPerfilAbierto} />

                <ContactsSidebar
                    isOpen={sidebarContactosAbierto}
                    onClose={() => setSidebarContactosAbierto(false)}
                />
            </aside>

            <main className="component-wrapper">
                <Outlet />
            </main>

            <div ref={profileSidebarRef}>
                <UserProfileSidebar
                    perfilAbierto={perfilAbierto} setPerfilAbierto={setPerfilAbierto}
                    usuarioActual={usuarioActual} misGrupos={misGrupos}
                    handleNavegarAGrupo={handleNavegarAGrupo}
                />
            </div>
        </div>
    );
};

export default Layout;