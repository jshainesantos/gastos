import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

function hideSplash() {
  const splash = document.getElementById('splash')
  if (splash) {
    splash.classList.add('hidden')
    splash.addEventListener('transitionend', () => splash.remove(), { once: true })
  }
}

const root = document.getElementById('root')!
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
)

// Give React one frame to paint before fading out splash
requestAnimationFrame(() => requestAnimationFrame(hideSplash))
