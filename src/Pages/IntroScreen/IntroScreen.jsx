import React from 'react';
import Lottie from 'lottie-react'; 
// ✨ CORRECCIÓN DE RUTA: Apuntando a la carpeta "Animations" con mayúscula
import blobAnimation from '../../assets/Animations/loading-blob.json'; 
import './IntroScreen.css';

const IntroScreen = () => {
    return (
        <div className="intro-container">
            <div className="lottie-wrapper">
                <Lottie 
                    animationData={blobAnimation} 
                    loop={true} 
                    autoplay={true}
                />
            </div>
            <h2 className="intro-text">Cargando mensajes...</h2>
        </div>
    );
};

export default IntroScreen;