import { MotiaStreamProvider } from '@motiadev/stream-client-react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <MotiaStreamProvider address="ws://localhost:3112">
      <App />
    </MotiaStreamProvider>
  </StrictMode>,
)
