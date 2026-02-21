import React, { useState, useEffect } from 'react';
import { useLottie } from 'lottie-react'; 
import blobAnimation from '../../assets/Animations/loading-blob.json'; 
import './IntroScreen.css';

const IntroScreen = ({ onTerminar }) => {
    const [progreso, setProgreso] = useState(0);
    const [mensaje, setMensaje] = useState("Cargando mensajes...");
    const [estadoTexto, setEstadoTexto] = useState("arriba"); 

    const opciones = {
        animationData: blobAnimation,
        loop: true,
        autoplay: true,
    };
    const { View } = useLottie(opciones);

    useEffect(() => {
        const entraTexto = setTimeout(() => setEstadoTexto("centro"), 100);
        
        const saleTexto = setTimeout(() => setEstadoTexto("abajo"), 3700);

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
            clearTimeout(entraTexto);
            clearTimeout(saleTexto);
            clearInterval(intervaloProgreso);
        };
    }, []);

    useEffect(() => {
        if (progreso === 100) {
            setMensaje("Mensajes cargados");
            setEstadoTexto("arriba"); 
            
            const entraNuevoTexto = setTimeout(() => {
                setEstadoTexto("centro");
            }, 50);
            
            const pasarALaApp = setTimeout(() => {
                onTerminar();
            }, 1000);
            
            return () => {
                clearTimeout(entraNuevoTexto);
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