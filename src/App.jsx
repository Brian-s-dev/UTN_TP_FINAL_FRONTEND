import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router';
import { ChatProvider } from './Context/ChatContext';
import { ThemeProvider, useTheme } from './Context/ThemeContext';
import AppRouter from './Router/AppRouter';
import IntroScreen from './Pages/IntroScreen/IntroScreen';

const AppContent = () => {
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCargando(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (cargando) return <IntroScreen />;

  return (
    <ChatProvider>
      <AppRouter />
    </ChatProvider>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;