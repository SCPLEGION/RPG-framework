import React, { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import Navmenu from "./Navmenu.jsx";
import { CustomThemeProvider } from './ThemeContext.jsx'

function Root() {
  const [navKey, setNavKey] = useState(0);
  const [leftOpen, setLeftOpen] = useState(false);

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
    <CustomThemeProvider>
      <BrowserRouter>
        <Navmenu key={navKey} onLeftDrawerChange={setLeftOpen} />
        <div
          style={{
            transition: "transform 0.3s cubic-bezier(.4,2,.6,1)",
            transform: leftOpen ? "scale(0.95)" : "scale(1)",
            filter: leftOpen ? "blur(0.5px)" : "none",
          }}
        >
          <App />
        </div>
      </BrowserRouter>
    </CustomThemeProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
