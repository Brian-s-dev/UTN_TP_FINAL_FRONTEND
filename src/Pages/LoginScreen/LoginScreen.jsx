import React, { useState } from 'react';
import { useChat } from '../../Context/ChatContext';
import './LoginScreen.css';

const LoginScreen = ({ onLoginExitoso }) => {
    const [nombre, setNombre] = useState('');
    const [password, setPassword] = useState('');
    const { setUsuarioActual } = useChat();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (nombre.trim() && password.trim()) {
            setUsuarioActual(nombre);
            onLoginExitoso();
        }
    };

    const botonDeshabilitado = !nombre.trim() || !password.trim();

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h2>Bienvenido</h2>
                    <p>Ingresa tus datos para continuar</p>
                </div>
                
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <label>Nombre de Usuario</label>
                        <input 
                            type="text" 
                            placeholder="Ej: Facundo" 
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                    </div>
                    
                    <div className="input-group">
                        <label>Contraseña</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className={`btn-login ${botonDeshabilitado ? 'disabled' : ''}`}
                        disabled={botonDeshabilitado}
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginScreen;