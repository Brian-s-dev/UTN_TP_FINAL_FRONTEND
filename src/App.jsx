import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router';
import { ChatProvider } from './Context/ChatContext';
import { ThemeProvider } from './Context/ThemeContext';
import AppRouter from './Router/AppRouter';
import IntroScreen from './Pages/IntroScreen/IntroScreen';

function App() {
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCargando(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (cargando) {
    return <IntroScreen />;
  }

  return (
    <BrowserRouter>
      <ThemeProvider>
        <ChatProvider>
          <AppRouter />
        </ChatProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;