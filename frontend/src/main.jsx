import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

console.log('Main.jsx is executing...');

const rootElement = document.getElementById('root');
if (rootElement) {
  console.log('Found root element, rendering App...');
  createRoot(rootElement).render(<App />);
} else {
  console.error('Root element not found!');
}
