import React from "react";
import { useParams } from "react-router";
import "./ChatView.css";

const ChatView = () => {
    const { chatId } = useParams();

    return (
        <div className="chat-view-container">
            <div className="chat-header-placeholder">
                <h2>Chat ID: {chatId}</h2>
            </div>
            <div className="chat-messages-placeholder">
                <p>Acá se cargarán los mensajes...</p>
            </div>
        </div>
    );
}

export default ChatView;