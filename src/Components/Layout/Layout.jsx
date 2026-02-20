import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { useChat } from "../../Context/ChatContext";
import SidebarItem from "../SidebarItem/SidebarItem";
import Avatar from "../Avatar/Avatar";
import "./Layout.css";

const Layout = () => {
    const { chats, agregarNuevoChat } = useChat();
    const navigate = useNavigate();
    const [busqueda, setBusqueda] = useState("");

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
                        <button className="btn-nuevo-chat" onClick={handleCrearChat} title="Nuevo Chat">+</button>
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
                        <Avatar nombre="Yo" />
                        <span className="mi-nombre">Yo</span>
                    </div>
                    <div className="config-btns">
                        <button title="Ajustes">⚙️</button>
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