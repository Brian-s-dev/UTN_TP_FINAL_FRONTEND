import React from 'react'
import { BrowserRouter } from 'react-router'; // El motor de navegación
import { ChatProvider } from './Context/ChatContext'; // Tu base de datos
import AppRouter from './Router/AppRouter'; // Tu mapa de rutas

function App() {
  return (
    // 1. Encendemos el motor de navegación
    <BrowserRouter>
      
      {/* 2. Proveemos los datos de los chats a toda la app */}
      <ChatProvider>
        
        {/* 3. Renderizamos las pantallas según la URL */}
        <AppRouter />
        
      </ChatProvider>
      
    </BrowserRouter>
  )
}

export default App