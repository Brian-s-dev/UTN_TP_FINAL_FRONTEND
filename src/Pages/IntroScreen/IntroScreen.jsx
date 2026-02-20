import React from 'react';
import Lottie from 'lottie-react'; 
import blobAnimation from '../../assets/animations/loading-blob.json'; 
import './IntroScreen.css';

const IntroScreen = () => {
    return (
        <div className="intro-container">
            <div className="lottie-wrapper">
                {/* Reproductor profesional de Lottie */}
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