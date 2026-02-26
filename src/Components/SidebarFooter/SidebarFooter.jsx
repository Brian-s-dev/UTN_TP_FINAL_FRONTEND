import React, { useState } from "react";
import { useTheme } from "../../Context/ThemeContext";
import Avatar from "../Avatar/Avatar";
import "./SidebarFooter.css";

const SidebarFooter = ({ usuarioActual, setPerfilAbierto }) => {
    const [menuAbierto, setMenuAbierto] = useState(false);
    const { tema, toggleTema } = useTheme();

    return (
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
    );
};
export default SidebarFooter;