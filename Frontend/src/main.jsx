import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppRoutes from './AppRoutes.jsx'
import Effects from './Features/VisualEffects/Effects.jsx'

createRoot(document.getElementById('root')).render(
  <>
    <Effects />
    <AppRoutes>
      <App />
    </AppRoutes>
  </>
)
