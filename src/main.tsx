import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import UniversalTableExample from "./UniversalTableExample.tsx";
import './index.css'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <UniversalTableExample />
    </StrictMode>,
)