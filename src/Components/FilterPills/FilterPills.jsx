import React, { useState, useRef, useEffect } from "react";
import "./FilterPills.css";

const FilterPills = ({ filtroActivo, setFiltroActivo }) => {
    const [menuAbierto, setMenuAbierto] = useState(false);
    // ✨ Nuevo estado para guardar las coordenadas del botón
    const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });

    const menuRef = useRef(null); // Ref del contenedor del botón
    const dropdownRef = useRef(null); // Ref del menú flotante

    const filtrosPrincipales = ["Todos", "No leídos", "Grupos"];
    const filtrosExtra = ["Favoritos", "Archivados"];

    // Calcular posición y abrir/cerrar
    const toggleMenu = () => {
        if (!menuAbierto && menuRef.current) {
            const rect = menuRef.current.getBoundingClientRect();
            // Guardamos la posición: Debajo del botón y alineado a su derecha
            setMenuPosition({
                top: rect.bottom + 5, // 5px de separación vertical
                left: rect.left // Alineado a la izquierda del botón
            });
        }
        setMenuAbierto(!menuAbierto);
    };

    // Cerrar al hacer clic fuera (Lógica mejorada para Fixed)
    useEffect(() => {
        const handleClickFuera = (event) => {
            // Si el clic no fue en el botón (menuRef) NI en el menú flotante (dropdownRef)
            if (
                menuAbierto &&
                menuRef.current && !menuRef.current.contains(event.target) &&
                dropdownRef.current && !dropdownRef.current.contains(event.target)
            ) {
                setMenuAbierto(false);
            }
        };

        // Escuchamos el scroll también para cerrar el menú si el usuario scrollea la app
        window.addEventListener("mousedown", handleClickFuera);
        window.addEventListener("scroll", handleClickFuera, true);

        return () => {
            window.removeEventListener("mousedown", handleClickFuera);
            window.removeEventListener("scroll", handleClickFuera, true);
        };
    }, [menuAbierto]);

    const handleSelectFiltro = (filtro) => {
        setFiltroActivo(filtro);
        setMenuAbierto(false);
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

            {/* Referencia en el botón */}
            <div ref={menuRef}>
                <button
                    className={`filter-pill icon-pill ${filtrosExtra.includes(filtroActivo) ? "active" : ""}`}
                    title="Más filtros"
                    onClick={toggleMenu}
                >
                    <span className="material-symbols-outlined">expand_more</span>
                </button>
            </div>

            {/* ✨ El menú ahora se renderiza fuera del flujo relativo usando FIXED */}
            {menuAbierto && (
                <div
                    className="filters-dropdown"
                    ref={dropdownRef}
                    style={{
                        top: menuPosition.top,
                        left: menuPosition.left
                    }}
                >
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
    );
};

export default FilterPills;