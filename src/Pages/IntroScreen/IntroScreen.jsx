import React from 'react';
// 1. IMPORTANTE: Ahora importamos "useLottie" entre llaves
import { useLottie } from 'lottie-react'; 
import blobAnimation from '../../assets/Animations/loading-blob.json'; 
import './IntroScreen.css';

const IntroScreen = () => {
    // 2. Le pasamos tus configuraciones al Lottie
    const opciones = {
        animationData: blobAnimation,
        loop: true,
        autoplay: true,
    };

    // 3. El Hook procesa la animación y nos devuelve un elemento visual listo para usar llamado "View"
    const { View } = useLottie(opciones);

    return (
        <div className="intro-container">
            <div className="lottie-wrapper">
                {/* 4. En lugar de usar <Lottie />, inyectamos el View directamente */}
                {View}
            </div>
            <h2 className="intro-text">Cargando mensajes...</h2>
        </div>
    );
};

export default IntroScreen;