import React, { useState, useRef, useEffect } from "react";
import "./FilterPills.css";

const FilterPills = ({ filtroActivo, setFiltroActivo }) => {
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

    const menuRef = useRef(null);
    const dropdownRef = useRef(null);

    const filtrosPrincipales = ["Todos", "No leídos", "Grupos"];
    const filtrosExtra = ["Favoritos", "Archivados"];

    // ✨ AJUSTE DE LÓGICA DE POSICIONAMIENTO
    const toggleMenu = () => {
        if (!menuAbierto && menuRef.current) {
            const rect = menuRef.current.getBoundingClientRect();
            const screenWidth = window.innerWidth;

            // Ancho estimado del menú (definido en CSS como min-width: 160px)
            const menuWidth = 170;

            let leftPos = rect.left;

            // Si es móvil (< 550px) o si el menú se saldría de la pantalla por la derecha
            if (screenWidth <= 550 || (rect.left + menuWidth > screenWidth)) {
                // Alineamos el borde derecho del menú con el borde derecho del botón
                // (Posición del botón + ancho del botón - ancho del menú)
                leftPos = (rect.left + rect.width) - menuWidth;

                // Pequeño ajuste de seguridad para que no quede pegado al borde exacto si es muy angosto
                if (leftPos + menuWidth > screenWidth - 10) {
                    leftPos = screenWidth - menuWidth - 10;
                }
            }

            setMenuPosition({
                top: rect.bottom + 5,
                left: leftPos
            });
        }
        setMenuAbierto(!menuAbierto);
    };

    // Cerrar al hacer clic fuera
    useEffect(() => {
        const handleClickFuera = (event) => {
            if (
                menuAbierto &&
                menuRef.current && !menuRef.current.contains(event.target) &&
                dropdownRef.current && !dropdownRef.current.contains(event.target)
            ) {
                setMenuAbierto(false);
            }
        };

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

            <div ref={menuRef}>
                <button
                    className={`filter-pill icon-pill ${filtrosExtra.includes(filtroActivo) ? "active" : ""}`}
                    title="Más filtros"
                    onClick={toggleMenu}
                >
                    <span className="material-symbols-outlined">expand_more</span>
                </button>
            </div>

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