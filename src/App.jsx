import React, { useState } from 'react';
import { BrowserRouter } from 'react-router';
import { ChatProvider } from './Context/ChatContext';
import { ThemeProvider } from './Context/ThemeContext';
import AppRouter from './Router/AppRouter';
import IntroScreen from './Pages/IntroScreen/IntroScreen';
import LoginScreen from './Pages/LoginScreen/LoginScreen';

const AppContent = () => {
  // Etapas: 'login' -> 'intro' -> 'app'
  const [etapa, setEtapa] = useState('login');

  if (etapa === 'login') {
    return <LoginScreen onLoginExitoso={() => setEtapa('intro')} />;
  }

  if (etapa === 'intro') {
    // Cuando la intro termine (100% + 2 seg), pasa a 'app'
    return <IntroScreen onTerminar={() => setEtapa('app')} />;
  }

  return (
    <AppRouter />
  );
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        {/* ChatProvider envuelve desde el Login para guardar el usuario */}
        <ChatProvider> 
          <AppContent />
        </ChatProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;