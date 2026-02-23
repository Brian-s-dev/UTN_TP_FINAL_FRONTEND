import React, { useState } from "react";
import { useChat } from "../../Context/ChatContext";
import { useNavigate } from "react-router";
import Avatar from "../Avatar/Avatar";
import NewChatModal from "../NewChatModal/NewChatModal";
import "./ContactsSidebar.css";

const ContactsSidebar = ({ isOpen, onClose }) => {
    const { contactos, iniciarChatConContacto, agregarNuevoContacto } = useChat();
    const navigate = useNavigate();
    
    const [busqueda, setBusqueda] = useState("");
    const [modalAbierto, setModalAbierto] = useState(false);

    const contactosFiltrados = contactos.filter(c => 
        c.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    const handleContactoClick = (contacto) => {
        const chatId = iniciarChatConContacto(contacto);
        onClose();
        navigate(`/chat/${chatId}`);
    };

    const handleCrearContacto = (nombre) => {
        const nuevoContacto = agregarNuevoContacto(nombre);
        const chatId = iniciarChatConContacto(nuevoContacto);
        setModalAbierto(false);
        onClose();
        navigate(`/chat/${chatId}`);
    };

    return (
        <>
            <div className={`contacts-sidebar-container ${isOpen ? 'open' : ''}`}>
                <div className="contacts-header">
                    <button className="btn-back" onClick={onClose}>
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h2>Nuevo Chat</h2>
                </div>

                <div className="contacts-search-container">
                    <input 
                        type="text" 
                        placeholder="Buscar contactos..." 
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>

                <div className="contacts-list">
                    <div className="contact-item add-new" onClick={() => setModalAbierto(true)}>
                        <div className="add-icon">
                            <span className="material-symbols-outlined">person_add</span>
                        </div>
                        <span className="contact-name">Nuevo contacto</span>
                    </div>

                    {contactosFiltrados.map((contacto) => (
                        <div key={contacto.id} className="contact-item" onClick={() => handleContactoClick(contacto)}>
                            <Avatar imagen={contacto.avatar} nombre={contacto.nombre} />
                            <div className="contact-info">
                                <span className="contact-name">{contacto.nombre}</span>
                                <span className="contact-status">Disponible</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <NewChatModal 
                isOpen={modalAbierto} 
                onClose={() => setModalAbierto(false)} 
                onCrear={handleCrearContacto} 
            />
        </>
    );
};

export default ContactsSidebar;