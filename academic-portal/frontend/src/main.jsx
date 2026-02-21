import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' 
import { AuthProvider } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#18cae6',
            color: '#111',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
            borderRadius: '8px',
            fontSize: '14px',
          },
        }}
      />
    </AuthProvider>
  </React.StrictMode>,
)