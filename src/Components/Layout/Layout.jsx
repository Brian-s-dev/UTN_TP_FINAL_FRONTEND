import React, { useState, useEffect } from "react";
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
        setSidebarColapsado(false);
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
            <aside className={`sidebar-container ${sidebarColapsado ? 'colapsado' : ''} ${location.pathname.includes("/chat/") ? 'chat-abierto' : ''}`}>
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

            <UserProfileSidebar
                perfilAbierto={perfilAbierto} setPerfilAbierto={setPerfilAbierto}
                usuarioActual={usuarioActual} misGrupos={misGrupos}
                handleNavegarAGrupo={handleNavegarAGrupo}
            />
        </div>
    );
};
export default Layout;