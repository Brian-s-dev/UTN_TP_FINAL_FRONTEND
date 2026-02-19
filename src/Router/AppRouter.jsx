import React from 'react'
import { Routes, Route } from 'react-router';
import Layout from '../Components/Layout/Layout';
import Welcome from '../Pages/Welcome/Welcome';
import ChatView from '../Pages/Chat/ChatView';

export default function AppRouter() {
  return (
    <Routes>
        <Route path="/" element={<Layout />}>
            <Route index element={<Welcome />} />
            <Route path="chat/:chatId" element={<ChatView />} />
        </Route>
    </Routes>
  )
}

