import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/tokens.css';
import { ToastProvider } from '../components/feedback';
import { Ambient } from '../components/primitives';
import Gate from '../pages/Gate';

/* The gate has no page chrome — it is one centred card — so it mounts
   the ambient layer and toast provider directly rather than through
   PageShell. */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <Ambient />
      <Gate />
    </ToastProvider>
  </StrictMode>
);

console.log('%cPatiëntportaal', 'color:#d8674a;font:600 22px Georgia,serif');
console.log('%cJe zoekt de broncode? Braaf. Er zit hier niks engs — alleen een afscheid.\nGemaakt door 56 · instagram @56isk · github.com/56snty', 'color:#828d94;font:13px monospace');
console.log('%cPsst: ↑↑↓↓←→←→ B A', 'color:#d8674a;font:12px monospace');
