import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('Root element not found')

createRoot(rootEl).render(
  <StrictMode>
    <main className="p-gutter">
      <h1 className="font-display text-display">Confidence Card</h1>
    </main>
  </StrictMode>,
)
