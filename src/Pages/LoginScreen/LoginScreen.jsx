import React, { useState, useEffect } from 'react';
import { useLottie } from 'lottie-react'; 
import blobAnimation from '../../assets/Animations/loading-blob.json'; 
import './IntroScreen.css';

const IntroScreen = ({ onTerminar }) => {
    const [progreso, setProgreso] = useState(0);
    const [mensaje, setMensaje] = useState("Cargando mensajes...");
    const [opacidadMensaje, setOpacidadMensaje] = useState(0);

    const opciones = {
        animationData: blobAnimation,
        loop: true,
        autoplay: true,
    };
    const { View } = useLottie(opciones);

    useEffect(() => {
        const fadeTextoIn = setTimeout(() => setOpacidadMensaje(1), 100);
        
        const fadeTextoOut = setTimeout(() => setOpacidadMensaje(0), 2000);

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
            clearTimeout(fadeTextoIn);
            clearTimeout(fadeTextoOut);
            clearInterval(intervaloProgreso);
        };
    }, []);

    useEffect(() => {
        if (progreso === 100) {
            setMensaje("Mensajes cargados");
            setOpacidadMensaje(1);
            
            const pasarALaApp = setTimeout(() => {
                onTerminar();
            }, 2000);
            
            return () => clearTimeout(pasarALaApp);
        }
    }, [progreso, onTerminar]);

    return (
        <div className="intro-container">
            <div className="lottie-wrapper">
                {View}
            </div>
            
            <h2 
                className="intro-text-animated" 
                style={{ opacity: opacidadMensaje }}
            >
                {mensaje}
            </h2>

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