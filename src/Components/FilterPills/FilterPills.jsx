import React, { useState, useRef, useEffect } from "react";
import "./FilterPills.css";

const FilterPills = ({ filtroActivo, setFiltroActivo }) => {
    const [menuAbierto, setMenuAbierto] = useState(false);
    const menuRef = useRef(null);

    // Filtros visibles principales
    const filtrosPrincipales = ["Todos", "No leídos", "Grupos"];

    // Filtros que van dentro del dropdown
    const filtrosExtra = ["Favoritos", "Archivados", "Bloqueados"];

    // Cerrar menú al hacer clic afuera
    useEffect(() => {
        const handleClickFuera = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuAbierto(false);
            }
        };
        document.addEventListener("mousedown", handleClickFuera);
        return () => document.removeEventListener("mousedown", handleClickFuera);
    }, []);

    const handleSelectFiltro = (filtro) => {
        setFiltroActivo(filtro);
        setMenuAbierto(false); // Cerramos el menú al seleccionar
    };

    return (
        <div className="filters-container">
            {filtrosPrincipales.map((filtro) => (
                <button
                    key={filtro}
                    className={`filter-pill ${filtroActivo === filtro ? "active" : ""}`}
                    onClick={() => setFiltroActivo(filtro)}
                >
                    {filtro}
                </button>
            ))}

            {/* Botón Dropdown */}
            <div style={{ position: 'relative' }} ref={menuRef}>
                <button
                    className={`filter-pill icon-pill ${filtrosExtra.includes(filtroActivo) ? "active" : ""}`}
                    title="Más filtros"
                    onClick={() => setMenuAbierto(!menuAbierto)}
                >
                    {/* Cambiamos el + por una flecha hacia abajo */}
                    <span className="material-symbols-outlined">expand_more</span>
                </button>

                {menuAbierto && (
                    <div className="filters-dropdown">
                        {filtrosExtra.map((filtro) => (
                            <button
                                key={filtro}
                                onClick={() => handleSelectFiltro(filtro)}
                                className={filtroActivo === filtro ? "active" : ""}
                            >
                                {filtro}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FilterPills;