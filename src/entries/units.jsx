import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/tokens.css';
import Dossier from '../pages/Dossier';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Dossier />
  </StrictMode>
);
