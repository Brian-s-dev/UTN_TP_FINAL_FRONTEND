import React from "react";
import { Outlet, NavLink } from "react-router";
import { useChat } from "../../Context/ChatContext";
import "./Layout.css";

const Layout = () => {
    const { chats } = useChat();

    return (
        <div className= "layout-container">
            <aside className= 'sidebar-container'>
                <div className= "sidebar-header">
                    <h2>Mis Chats</h2>
                </div>

                <nav className="sidebar-nav">
                    {
                        chats.map((chat) => (
                            <NavLink key={chat.id} to={`/chat/${chat.id}`}
                            className={({ isActive }) => isActive ? "chat-item active" : "chat-item"}>
                                <div className="avatar-circle">
                                    {chat.nombre.charAt(0)}
                                </div>
                                <div className="chat-info">
                                    <h4 className="chat-name">{chat.nombre}</h4>
                                    <p className="chat-preview">Haz clic para entrar</p>
                                </div>
                            </NavLink>
                        ))}
                </nav>
            </aside>
            <main className="component-wrapper">
                <Outlet />
            </main>
        </div >
    )
}

export default Layout;