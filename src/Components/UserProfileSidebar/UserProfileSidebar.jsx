import React from "react";
import Avatar from "../Avatar/Avatar";
import "./UserProfileSidebar.css";

const UserProfileSidebar = ({ perfilAbierto, setPerfilAbierto, usuarioActual, misGrupos, handleNavegarAGrupo }) => {
    return (
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

                <div className="profile-info-card">
                    <span className="profile-label">Tus Grupos</span>
                    {misGrupos.length === 0 ? (
                        <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#667781' }}>No estás en ningún grupo aún.</p>
                    ) : (
                        <div className="profile-groups-list">
                            {misGrupos.map(grupo => (
                                <div
                                    key={grupo.id}
                                    className="profile-group-item clickable"
                                    onClick={() => handleNavegarAGrupo(grupo.id)}
                                >
                                    <Avatar imagen={grupo.avatar} nombre={grupo.nombre} />
                                    <span className="profile-group-name">{grupo.nombre}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default UserProfileSidebar;