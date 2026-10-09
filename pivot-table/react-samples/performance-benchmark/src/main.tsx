import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@syncfusion/ej2-fluent2-theme/styles/pivotview/index.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
