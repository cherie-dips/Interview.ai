import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './embed.css'
import App from './App.jsx'

// Study AI is only shown inside Interview.ai's Study AI tab. Opened on its own (an old link, or a
// password-reset link), go to that tab instead, keeping the link's details. `npm run dev` shows it alone.
if (import.meta.env.PROD && window.top === window.self) {
  window.location.replace(`../${window.location.search}#study`)
} else {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
