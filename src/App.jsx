import React, { useState } from 'react';
import { BrowserRouter } from 'react-router';
import { ChatProvider } from './Context/ChatContext';
import { ThemeProvider } from './Context/ThemeContext';
import AppRouter from './Router/AppRouter';
import IntroScreen from './Pages/IntroScreen/IntroScreen';
import LoginScreen from './Pages/LoginScreen/LoginScreen';

const AppContent = () => {
  const [etapa, setEtapa] = useState('login');

  if (etapa === 'login') {
    return <LoginScreen onLoginExitoso={() => setEtapa('intro')} />;
  }

  if (etapa === 'intro') {
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
        <ChatProvider> 
          <AppContent />
        </ChatProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;