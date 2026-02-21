import React, { useState } from "react";
import "./NewChatModal.css";

const NewChatModal = ({ isOpen, onClose, onCrear }) => {
    const [nombreNuevoChat, setNombreNuevoChat] = useState("");

    // Si no está abierto, no renderizamos nada
    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (nombreNuevoChat.trim() !== "") {
            onCrear(nombreNuevoChat);
            setNombreNuevoChat(""); // Limpiamos para el próximo uso
        }
    };

    const handleCancelar = () => {
        setNombreNuevoChat("");
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Nuevo Chat</h3>
                <p>Ingresa el nombre del nuevo contacto:</p>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        autoFocus
                        placeholder="Ej: Martín UX" 
                        value={nombreNuevoChat}
                        onChange={(e) => setNombreNuevoChat(e.target.value)}
                    />
                    <div className="modal-buttons">
                        <button type="button" className="btn-cancelar" onClick={handleCancelar}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-crear" disabled={!nombreNuevoChat.trim()}>
                            Crear
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewChatModal;