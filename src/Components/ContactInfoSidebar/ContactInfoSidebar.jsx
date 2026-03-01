import React from "react";
import Avatar from "../Avatar/Avatar";
import "./ContactInfoSidebar.css";

const ContactInfoSidebar = ({
    infoAbierta, setInfoAbierta, chatActivo, esGrupo, estadoConexion,
    contactos, usuarioActual, handleBloquearToggle, handleEliminar,
    handleToggleFavorito, // ✨ Recibimos la función
    txtBotonBloquear, menuEditarRef, menuEditarAbierto, setMenuEditarAbierto
}) => {
    return (
        <div className={`contact-info-sidebar ${infoAbierta ? 'abierto' : ''}`}>
            <div className="contact-info-header">
                <button className="btn-icon" onClick={() => setInfoAbierta(false)} title="Cerrar info">
                    <span className="material-symbols-outlined">close</span>
                </button>
                <h3>{esGrupo ? 'Info. del grupo' : 'Info. del contacto'}</h3>

                <div className="edit-menu-wrapper" ref={menuEditarRef}>
                    <button className="btn-icon" onClick={() => setMenuEditarAbierto(!menuEditarAbierto)} title="Editar">
                        <span className="material-symbols-outlined">edit</span>
                    </button>

                    {menuEditarAbierto && (
                        <div className="menu-flotante-editar">
                            <button onClick={() => setMenuEditarAbierto(false)}>Editar {esGrupo ? 'grupo' : 'contacto'}</button>
                            <button onClick={() => setMenuEditarAbierto(false)}>Compartir enlace</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="contact-info-body">
                <div className="contact-profile-card">
                    <div className="avatar-large-container">
                        <Avatar imagen={chatActivo.avatar} nombre={chatActivo.nombre} isIA={chatActivo.tipo === "ia"} />
                    </div>
                    <h2>{chatActivo.nombre}</h2>
                    <p>{esGrupo ? `Grupo · ${contactos.slice(0, 4).length + 1} participantes` : estadoConexion}</p>
                </div>

                {/* ✨ LÓGICA DE FAVORITOS CORREGIDA */}
                {!esGrupo && (
                    <div className="contact-actions-card">
                        <button className="action-btn" onClick={handleToggleFavorito}>
                            <span
                                className="material-symbols-outlined"
                                // Si es favorito, pintamos la estrella de verde
                                style={{ color: chatActivo.esFavorito ? '#00a884' : 'inherit' }}
                            >
                                {/* Cambiamos entre estrella llena y borde */}
                                {chatActivo.esFavorito ? 'star' : 'star_border'}
                            </span>
                            <span>
                                {chatActivo.esFavorito ? "Quitar de favoritos" : "Añadir a favoritos"}
                            </span>
                        </button>
                    </div>
                )}

                {esGrupo && (
                    <div className="contact-actions-card">
                        <h4 className="card-subtitle">{contactos.slice(0, 4).length + 1} participantes</h4>
                        <div className="participant-list">
                            <div className="participant-item">
                                <Avatar nombre={usuarioActual} />
                                <div className="participant-info">
                                    <span className="participant-name">Tú</span>
                                    <span className="participant-role">Admin del grupo</span>
                                </div>
                            </div>
                            {contactos.slice(0, 4).map(c => (
                                <div key={c.id} className="participant-item">
                                    <Avatar imagen={c.avatar} nombre={c.nombre} />
                                    <div className="participant-info">
                                        <span className="participant-name">{c.nombre}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="contact-actions-card danger-zone">
                    <button className="action-btn text-danger" onClick={handleBloquearToggle}>
                        <span className="material-symbols-outlined">{esGrupo ? "logout" : "block"}</span>
                        <span>{txtBotonBloquear}</span>
                    </button>
                    <button className="action-btn text-danger" onClick={handleEliminar}>
                        <span className="material-symbols-outlined">delete</span>
                        <span>Eliminar chat</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
export default ContactInfoSidebar;