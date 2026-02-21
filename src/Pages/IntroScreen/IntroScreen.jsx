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
        // 1. Cae rápidamente al inicio
        const entraTexto = setTimeout(() => setEstadoTexto("centro"), 100);
        
        // 2. Se va un poco antes de que la barra llegue a 100 (a los 4 segundos)
        const saleTexto = setTimeout(() => setEstadoTexto("abajo"), 4000);

        // 3. ✨ MAGIA DE TIEMPO: 50ms * 100 = 5000ms (5 segundos exactos de carga)
        const intervaloProgreso = setInterval(() => {
            setProgreso((prev) => {
                if (prev >= 100) {
                    clearInterval(intervaloProgreso);
                    return 100;
                }
                return prev + 1;
            });
        }, 50); 

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
            
            const saleNuevoTexto = setTimeout(() => {
                setEstadoTexto("abajo");
            }, 1500);

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