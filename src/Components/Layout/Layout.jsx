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
import ForwardModal from "../ForwardModal/ForwardModal";

import "./Layout.css";

const Layout = () => {
    const { chats, usuarioActual } = useChat();
    const navigate = useNavigate();
    const location = useLocation();

    const sidebarRef = useRef(null);
    const profileSidebarRef = useRef(null);
    const prevWidthRef = useRef(window.innerWidth);

    const [busqueda, setBusqueda] = useState("");
    const [filtroActivo, setFiltroActivo] = useState("Todos");
    const [sidebarContactosAbierto, setSidebarContactosAbierto] = useState(false);
    const [perfilAbierto, setPerfilAbierto] = useState(false);
    const [sidebarColapsado, setSidebarColapsado] = useState(window.innerWidth <= 900);

    // =========================================
    // 🔍 LÓGICA DE FILTRADO DE CHATS
    // =========================================
    const chatsFiltrados = chats.filter(chat => {
        const coincideBusqueda = chat.nombre.toLowerCase().includes(busqueda.toLowerCase());
        let coincideFiltro = true;

        switch (filtroActivo) {
            case "Grupos":
                coincideFiltro = chat.tipo === EMISOR.GRUPO && !chat.archivado;
                break;
            case "No leídos":
                // ✨ FILTRO REAL: Solo si tiene contador > 0
                coincideFiltro = chat.noLeidos > 0 && !chat.archivado;
                break;
            case "Favoritos":
                coincideFiltro = chat.esFavorito && !chat.archivado;
                break;
            case "Archivados":
                coincideFiltro = chat.archivado;
                break;
            default: // "Todos"
                coincideFiltro = !chat.archivado;
        }
        return coincideBusqueda && coincideFiltro;
    });

    const misGrupos = chats.filter(chat => chat.tipo === EMISOR.GRUPO && !chat.archivado);

    const handleAbrirContactos = () => {
        setSidebarColapsado(false);
        setSidebarContactosAbierto(true);
    };

    const handleNavegarAGrupo = (chatId) => {
        setPerfilAbierto(false);
        navigate(`/chat/${chatId}`);
    };

    useEffect(() => {
        const handleResize = () => {
            const currentWidth = window.innerWidth;
            if (currentWidth !== prevWidthRef.current) {
                if (currentWidth > 900) {
                    setSidebarColapsado(false);
                } else {
                    setSidebarColapsado(true);
                }
                prevWidthRef.current = currentWidth;
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setPerfilAbierto(false);
        setSidebarContactosAbierto(false);
        if (window.innerWidth > 900) setSidebarColapsado(false);
        else setSidebarColapsado(true);
    }, [location.pathname]);

    useEffect(() => {
        const handleClickFuera = (event) => {
            if (perfilAbierto && profileSidebarRef.current && !profileSidebarRef.current.contains(event.target)) {
                if (!event.target.closest('.mi-perfil') && !event.target.closest('.mobile-header-avatar')) {
                    setPerfilAbierto(false);
                }
            }
            if (window.innerWidth <= 900 && !sidebarColapsado && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setSidebarColapsado(true);
                setSidebarContactosAbierto(false);
            }
        };
        document.addEventListener("mousedown", handleClickFuera);
        return () => document.removeEventListener("mousedown", handleClickFuera);
    }, [perfilAbierto, sidebarColapsado]);

    return (
        <div className="layout-container">
            <aside
                ref={sidebarRef}
                className={`sidebar-container ${sidebarColapsado ? 'colapsado' : ''} ${location.pathname.includes("/chat/") ? 'chat-abierto' : ''}`}
            >
                <SidebarHeader
                    sidebarColapsado={sidebarColapsado}
                    setSidebarColapsado={setSidebarColapsado}
                    handleAbrirContactos={handleAbrirContactos}
                    setPerfilAbierto={setPerfilAbierto}
                    usuarioActual={usuarioActual}
                    busqueda={busqueda}
                    setBusqueda={setBusqueda}
                />

                <FilterPills filtroActivo={filtroActivo} setFiltroActivo={setFiltroActivo} />

                <nav className="sidebar-nav">
                    {chatsFiltrados.length === 0 ? (
                        <p className="no-results">
                            {filtroActivo === "Archivados" ? "No tienes chats archivados." : "No se encontraron chats."}
                        </p>
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
            <ForwardModal />
        </div>
    );
};

export default Layout;