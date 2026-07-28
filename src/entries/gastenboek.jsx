import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/tokens.css';
import Gastenboek from '../pages/Gastenboek';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Gastenboek />
  </StrictMode>
);
