import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom'; // Ojo: asegúrate de usar react-router-dom
import { ChatProvider } from './Context/ChatContext';
import AppRouter from './Router/AppRouter';
import IntroScreen from './Pages/IntroScreen/IntroScreen';

function App() {
  // Estado que controla si la app está "cargando"
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Configuramos un temporizador de 3000 milisegundos (3 segundos)
    const timer = setTimeout(() => {
      setCargando(false); // Apagamos la pantalla de carga
    }, 3000);

    // Función de limpieza por buenas prácticas de React
    return () => clearTimeout(timer);
  }, []);

  // Si está cargando, mostramos la Intro con el Lottie Blob
  if (cargando) {
    return <IntroScreen />;
  }

  // Si ya cargó, mostramos tu aplicación principal
  return (
    <BrowserRouter>
      <ChatProvider>
        <AppRouter />
      </ChatProvider>
    </BrowserRouter>
  );
}

export default App;