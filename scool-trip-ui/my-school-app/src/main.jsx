import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SocketProvider } from "./context/socketContext.jsx"
import { AppStateProvider } from './context/AppStateProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppStateProvider>
      <SocketProvider>
        <App />
      </SocketProvider>
    </AppStateProvider>
  </StrictMode>
)
