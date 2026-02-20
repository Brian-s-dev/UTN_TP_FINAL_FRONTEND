import React from "react";
import "./Avatar.css";

const Avatar = ({ imagen, nombre }) => {
    return (
        <div className="avatar-circle">
            {imagen ? (
                <img src={imagen} alt={`Avatar de ${nombre}`} className="avatar-img" />
            ) : (
                nombre?.charAt(0).toUpperCase() || "?"
            )}
        </div>
    );
};

export default Avatar;