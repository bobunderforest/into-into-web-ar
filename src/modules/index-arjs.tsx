import { createRoot } from 'react-dom/client'
import { App } from './ui/app'
// @ts-expect-error
import '../styles/global.css'
// @ts-expect-error
import '../styles/recorder.css'

const root = createRoot(document.getElementById('app')!)

root.render(<App />)
