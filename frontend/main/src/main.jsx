import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import Navmenu from "./Navmenu.jsx"

function Root() {
  const [navKey, setNavKey] = useState(0);

  // Listen for localStorage changes (login/logout)
  useEffect(() => {
    const handler = () => setNavKey(k => k + 1);
    window.addEventListener('storage', handler);
    // Also listen for changes in this tab
    const origSetItem = localStorage.setItem;
    localStorage.setItem = function (...args) {
      origSetItem.apply(this, args);
      handler();
    };
    return () => {
      window.removeEventListener('storage', handler);
      localStorage.setItem = origSetItem;
    };
  }, []);

  return (
    <BrowserRouter>
      <Navmenu key={navKey} />
      <App />
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
