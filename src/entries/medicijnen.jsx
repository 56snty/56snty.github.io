import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/tokens.css';
import Medicijnen from '../pages/Medicijnen';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Medicijnen />
  </StrictMode>
);
