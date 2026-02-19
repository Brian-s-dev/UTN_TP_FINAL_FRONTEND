import React from 'react'
import { BrowserRouter } from 'react-router';
import { ChatProvider } from './Context/ChatContext';
import AppRouter from './Router/AppRouter';

function App() {
  return (
    <BrowserRouter>
      <ChatProvider>
        <AppRouter />
      </ChatProvider>
    </BrowserRouter>
  )
}

export default App