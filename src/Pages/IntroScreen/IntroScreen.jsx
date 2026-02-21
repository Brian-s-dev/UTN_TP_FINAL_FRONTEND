import React, { useState, useEffect } from 'react';
import { useLottie } from 'lottie-react'; 
import blobAnimation from '../../assets/Animations/loading-blob.json'; 
import './IntroScreen.css';

const IntroScreen = ({ onTerminar }) => {
    const [progreso, setProgreso] = useState(0);
    const [mensaje, setMensaje] = useState("Cargando mensajes...");
    
    // ✨ Controla en qué posición física está el texto
    const [estadoTexto, setEstadoTexto] = useState("arriba"); 

    const opciones = {
        animationData: blobAnimation,
        loop: true,
        autoplay: true,
    };
    const { View } = useLottie(opciones);

    // Animación del primer texto y la barra
    useEffect(() => {
        // 1. A los 100ms, el texto "cae" al centro
        const entraTexto = setTimeout(() => setEstadoTexto("centro"), 100);
        
        // 2. A los 2 segundos, el texto se "cae" hacia abajo y desaparece
        const saleTexto = setTimeout(() => setEstadoTexto("abajo"), 2000);

        const intervaloProgreso = setInterval(() => {
            setProgreso((prev) => {
                if (prev >= 100) {
                    clearInterval(intervaloProgreso);
                    return 100;
                }
                return prev + 1;
            });
        }, 30); 

        return () => {
            clearTimeout(entraTexto);
            clearTimeout(saleTexto);
            clearInterval(intervaloProgreso);
        };
    }, []);

    // Animación cuando la barra llega a 100%
    useEffect(() => {
        if (progreso === 100) {
            // Preparamos el nuevo texto y lo volvemos a poner arriba
            setMensaje("Mensajes cargados");
            setEstadoTexto("arriba"); 
            
            // Un instante después, lo hacemos bajar al centro
            const entraNuevoTexto = setTimeout(() => {
                setEstadoTexto("centro");
            }, 50);
            
            // A los 1.5 segundos, lo hacemos irse hacia abajo
            const saleNuevoTexto = setTimeout(() => {
                setEstadoTexto("abajo");
            }, 1500);

            // A los 2 segundos (cuando ya se ocultó), pasamos a la app principal
            const pasarALaApp = setTimeout(() => {
                onTerminar();
            }, 2000);
            
            return () => {
                clearTimeout(entraNuevoTexto);
                clearTimeout(saleNuevoTexto);
                clearTimeout(pasarALaApp);
            };
        }
    }, [progreso, onTerminar]);

    return (
        <div className="intro-container">
            <div className="lottie-wrapper">
                {View}
            </div>
            
            {/* ✨ Envolvemos el texto en una "caja" de altura fija para que no salte todo */}
            <div className="texto-animado-container">
                <h2 
                    key={mensaje} /* ¡EL TRUCO!: Reinicia la animación cuando cambia el mensaje */
                    className={`intro-text-animated estado-${estadoTexto}`}
                >
                    {mensaje}
                </h2>
            </div>

            <div className="progress-container">
                <div className="progress-bar-bg">
                    <div 
                        className="progress-bar-fill" 
                        style={{ width: `${progreso}%` }}
                    ></div>
                </div>
                <span className="progress-percent">{progreso}%</span>
            </div>
        </div>
    );
};

export default IntroScreen;