import React, { useState } from "react";
import { useChat } from "../../Context/ChatContext";
import { useNavigate } from "react-router";
import Avatar from "../Avatar/Avatar";
import "./ForwardModal.css"; // Usa los mismos estilos que NewChatModal o crea uno simple

const ForwardModal = () => {
    const { mensajeAReenviar, setMensajeAReenviar, contactos, confirmarReenvio } = useChat();
    const navigate = useNavigate();
    const [busqueda, setBusqueda] = useState("");

    if (!mensajeAReenviar) return null;

    const contactosFiltrados = contactos.filter(c => c.nombre.toLowerCase().includes(busqueda.toLowerCase()));

    const handleEnviar = (contacto) => {
        const chatId = confirmarReenvio(contacto);
        navigate(`/chat/${chatId}`);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content forward-modal">
                <div className="modal-header">
                    <h3>Reenviar mensaje a...</h3>
                    <button className="btn-close" onClick={() => setMensajeAReenviar(null)}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <input
                    type="text"
                    placeholder="Buscar contacto..."
                    className="search-forward"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    autoFocus
                />

                <div className="contacts-list-forward">
                    {contactosFiltrados.map(contacto => (
                        <div key={contacto.id} className="contact-item" onClick={() => handleEnviar(contacto)}>
                            <Avatar imagen={contacto.avatar} nombre={contacto.nombre} />
                            <span className="contact-name">{contacto.nombre}</span>
                            <span className="material-symbols-outlined send-icon">send</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ForwardModal;