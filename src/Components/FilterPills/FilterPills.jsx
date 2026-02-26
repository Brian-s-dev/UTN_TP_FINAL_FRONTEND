import React from "react";
import "./FilterPills.css";

const FilterPills = ({ filtroActivo, setFiltroActivo }) => {
    const filtros = ["Todos", "Mensajes no leídos", "Grupos"];

    return (
        <div className="filters-container">
            {filtros.map((filtro) => (
                <button
                    key={filtro}
                    className={`filter-pill ${filtroActivo === filtro ? "active" : ""}`}
                    onClick={() => setFiltroActivo(filtro)}
                >
                    {filtro}
                </button>
            ))}
            <button className="filter-pill icon-pill" title="Añadir filtro personalizado">
                <span className="material-symbols-outlined">add</span>
            </button>
        </div>
    );
};
export default FilterPills;