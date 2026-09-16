import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SiteImagesProvider } from './context/SiteImagesContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SiteImagesProvider>
      <App />
    </SiteImagesProvider>
  </StrictMode>,
)
