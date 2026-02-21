import React, { useState, useEffect } from 'react';
import { useLottie } from 'lottie-react'; 
import blobAnimation from '../../assets/Animations/loading-blob.json'; 
import './IntroScreen.css';

const IntroScreen = ({ onTerminar }) => {
    const [progreso, setProgreso] = useState(0);
    const [mensaje, setMensaje] = useState("Cargando mensajes...");
    const [estadoTexto, setEstadoTexto] = useState("entrando"); 

    const opciones = {
        animationData: blobAnimation,
        loop: true,
        autoplay: true,
        // ✨ LA MISMA MAGIA: Cortamos los frames vacíos del final para un loop perfecto
        initialSegment: [0, 120] 
    };
    const { View } = useLottie(opciones);

    useEffect(() => {
        // A los 3.6s el primer texto se va para abajo
        const saleTexto = setTimeout(() => setEstadoTexto("saliendo"), 3600);

        // La barra se llena en exactamente 4 segundos (40ms * 100)
        const intervaloProgreso = setInterval(() => {
            setProgreso((prev) => {
                if (prev >= 100) {
                    clearInterval(intervaloProgreso);
                    return 100;
                }
                return prev + 1;
            });
        }, 40); 

        return () => {
            clearTimeout(saleTexto);
            clearInterval(intervaloProgreso);
        };
    }, []);

    useEffect(() => {
        if (progreso === 100) {
            // La magia de React: Al cambiar el mensaje, la "key" reinicia 
            // la animación de CSS automáticamente desde arriba.
            setMensaje("Mensajes cargados");
            setEstadoTexto("entrando"); 
            
            // A los 600ms (4.6s en total) mandamos el texto hacia abajo
            const saleNuevoTexto = setTimeout(() => {
                setEstadoTexto("saliendo");
            }, 600);
            
            // A los 1000ms (5s exactos en total) pasamos a la App
            const pasarALaApp = setTimeout(() => {
                onTerminar();
            }, 1000);
            
            return () => {
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
            
            <div className="texto-animado-container">
                <h2 
                    key={mensaje} 
                    className={`intro-text-animated ${estadoTexto}`}
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