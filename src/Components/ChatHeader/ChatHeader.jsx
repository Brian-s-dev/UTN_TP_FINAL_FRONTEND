import React, { useState, useRef, useEffect } from "react";
import Avatar from "../Avatar/Avatar";
import OpcionesChatsMenu from "../OpcionesChatsMenu/OpcionesChatsMenu";
import "./ChatHeader.css";

// Agregamos setBusquedaMensajes a las props para pasar el texto hacia arriba
const ChatHeader = ({ chatActivo, estadoConexion, setInfoAbierta, navigate, setBusquedaMensajes }) => {
    const [busquedaActiva, setBusquedaActiva] = useState(false);
    const [textoBusqueda, setTextoBusqueda] = useState("");
    const searchRef = useRef(null);
    const inputRef = useRef(null);

    // Abrir buscador
    const handleOpenSearch = () => {
        setBusquedaActiva(true);
        // Esperamos un tick para enfocar el input
        setTimeout(() => {
            if (inputRef.current) inputRef.current.focus();
        }, 100);
    };

    // Cerrar buscador y limpiar
    const handleCloseSearch = () => {
        setBusquedaActiva(false);
        setTextoBusqueda("");
        if (setBusquedaMensajes) setBusquedaMensajes(""); // Limpiamos el filtro real
    };

    // Manejar escritura
    const handleChange = (e) => {
        setTextoBusqueda(e.target.value);
        if (setBusquedaMensajes) setBusquedaMensajes(e.target.value);
    };

    // Detectar clic fuera para cerrar
    useEffect(() => {
        const handleClickFuera = (event) => {
            // Si el buscador está activo y el clic NO fue dentro del contenedor del header
            if (busquedaActiva && searchRef.current && !searchRef.current.contains(event.target)) {
                handleCloseSearch();
            }
        };

        document.addEventListener("mousedown", handleClickFuera);
        return () => document.removeEventListener("mousedown", handleClickFuera);
    }, [busquedaActiva]);

    return (
        <div className="chat-header-placeholder" ref={searchRef}>
            {/* ✨ LOGICA VISUAL: 
               Si la búsqueda está activa, mostramos la BARRA.
               Si no, mostramos la INFO normal.
            */}

            {busquedaActiva ? (
                <div className="chat-header-search-bar animate-search">
                    <button className="btn-icon-search-back" onClick={handleCloseSearch}>
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>

                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Buscar en este chat..."
                        value={textoBusqueda}
                        onChange={handleChange}
                        className="header-search-input"
                    />

                    {textoBusqueda && (
                        <button className="btn-icon-clear" onClick={() => {
                            setTextoBusqueda("");
                            if (setBusquedaMensajes) setBusquedaMensajes("");
                            inputRef.current.focus();
                        }}>
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    )}
                </div>
            ) : (
                <>
                    {/* INFO NORMAL DEL CHAT */}
                    <div className="chat-header-info clickable" onClick={() => setInfoAbierta(true)} title="Ver información">
                        <Avatar imagen={chatActivo.avatar} nombre={chatActivo.nombre} isIA={chatActivo.tipo === "ia"} />
                        <div className="chat-header-texto">
                            <h2>{chatActivo.nombre}</h2>
                            {estadoConexion && <span className="chat-status">{estadoConexion}</span>}
                        </div>
                    </div>

                    {/* ACCIONES DERECHA */}
                    <div className="chat-header-actions">
                        {/* ✨ NUEVO BOTÓN LUPA */}
                        <button className="btn-action-icon" onClick={handleOpenSearch} title="Buscar mensajes">
                            <span className="material-symbols-outlined">search</span>
                        </button>

                        <OpcionesChatsMenu chat={chatActivo} />

                        <button className="btn-volver" onClick={() => navigate("/")} title="Cerrar chat">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ChatHeader;