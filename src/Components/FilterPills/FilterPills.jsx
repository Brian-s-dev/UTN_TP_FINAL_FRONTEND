import React, { useState, useRef, useEffect } from "react";
import "./FilterPills.css";

const FilterPills = ({ filtroActivo, setFiltroActivo }) => {
    const [menuAbierto, setMenuAbierto] = useState(false);
    const menuRef = useRef(null);

    // Filtros visibles directos
    const filtrosPrincipales = ["Todos", "No leídos", "Grupos"];

    // Filtros ocultos en el dropdown
    const filtrosExtra = ["Favoritos", "Archivados"];

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
        setMenuAbierto(false);
    };

    return (
        <div className="filters-container">
            {/* Píldoras principales */}
            {filtrosPrincipales.map((filtro) => (
                <button
                    key={filtro}
                    className={`filter-pill ${filtroActivo === filtro ? "active" : ""}`}
                    onClick={() => setFiltroActivo(filtro)}
                >
                    {filtro}
                </button>
            ))}

            {/* Botón Dropdown (Flecha) */}
            <div style={{ position: 'relative' }} ref={menuRef}>
                <button
                    className={`filter-pill icon-pill ${filtrosExtra.includes(filtroActivo) ? "active" : ""}`}
                    title="Más filtros"
                    onClick={() => setMenuAbierto(!menuAbierto)}
                >
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