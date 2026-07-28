import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/tokens.css';
import Reis from '../pages/Reis';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Reis />
  </StrictMode>
);
