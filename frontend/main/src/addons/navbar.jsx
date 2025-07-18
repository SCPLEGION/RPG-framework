import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Stack from '@mui/material/Stack';
import { createTheme } from '@mui/material/styles';


// --- Navbar context ---
const NavbarContext = createContext();

export function useNavbar() {
  return useContext(NavbarContext);
}

export function NavbarProvider({ children }) {
  const [option, setOption] = useState(() => localStorage.getItem('navbarOption') || 'default');
  const [theme, setTheme] = useState(() => localStorage.getItem('navbarTheme') || 'dark');
  const [contentleft, setContentLeft] = useState(null);
  const [contentRight, setContentRight] = useState(null);
  const [sidebarleftdisabled, setSidebarLeftDisabled] = useState(false);
  const [sidebarrightdisabled, setSidebarRightDisabled] = useState(false);
  const [middlecontent, setMiddleContent] = useState(null);

  useEffect(() => {
    localStorage.setItem('navbarOption', option);
    document.title = `${option}`;
  }, [option]);

  useEffect(() => {
    localStorage.setItem('navbarTheme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <NavbarContext.Provider value={{ option, setOption, theme, toggleTheme,contentRight, setContentRight, contentleft, setContentLeft, sidebarleftdisabled, setSidebarLeftDisabled, sidebarrightdisabled, setSidebarRightDisabled, middlecontent, setMiddleContent }}>
      {children}
    </NavbarContext.Provider>
  );
}

// --- Navbar component ---
const defaultSidebarWidth = 200;
const maxSidebarWidth = 400;
const sidebarZIndex = 1201;

function getStoredSidebarWidth(key, fallback) {
  const val = localStorage.getItem(key);
  return val ? parseInt(val, 10) : fallback;
}

async function saveSidebarWidthToBackend(side, width) {
  console.log(`Saving ${side} sidebar width: ${width}px`);
}

const Navbar = ({
  children,
  minSidebarWidthProp = 120,
}) => {
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [leftWidth, setLeftWidth] = useState(() => getStoredSidebarWidth('leftSidebarWidth', defaultSidebarWidth));
  const [rightWidth, setRightWidth] = useState(() => getStoredSidebarWidth('rightSidebarWidth', defaultSidebarWidth));
  const resizing = useRef({ side: null, startX: 0, startWidth: 0 });
  const { option,sidebarleftdisabled,sidebarrightdisabled,leftSidebarContent,rightSidebarContent, theme, toggleTheme,middlecontent } = useNavbar();

  const colors = {
    dark: { background: '#222', text: '#fff', hover: 'rgba(255,255,255,0.1)' },
    light: { background: '#f0f0f0', text: '#000', hover: 'rgba(0,0,0,0.1)' },
  };

  useEffect(() => {
    localStorage.setItem('leftSidebarWidth', leftWidth);
    saveSidebarWidthToBackend('left', leftWidth);
  }, [leftWidth]);

  useEffect(() => {
    localStorage.setItem('rightSidebarWidth', rightWidth);
    saveSidebarWidthToBackend('right', rightWidth);
  }, [rightWidth]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.left-sidebar') && !e.target.closest('.right-sidebar') && !e.target.closest('.MuiAppBar-root')) {
        setLeftOpen(false);
        setRightOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    function onMouseMove(e) {
      if (resizing.current.side === 'left') {
        const newWidth = Math.min(maxSidebarWidth, Math.max(minSidebarWidthProp, resizing.current.startWidth + (e.clientX - resizing.current.startX)));
        setLeftWidth(newWidth);
      } else if (resizing.current.side === 'right') {
        const newWidth = Math.min(maxSidebarWidth, Math.max(minSidebarWidthProp, resizing.current.startWidth + (resizing.current.startX - e.clientX)));
        setRightWidth(newWidth);
      }
    }
    function onMouseUp() {
      resizing.current.side = null;
      document.body.style.cursor = '';
    }

    if (resizing.current.side) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onMouseMove);
      window.addEventListener('touchend', onMouseUp);
      document.body.style.cursor = 'col-resize';
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onMouseMove);
      window.removeEventListener('touchend', onMouseUp);
      document.body.style.cursor = '';
    };
  }, [leftOpen, rightOpen, minSidebarWidthProp]);

  const startResize = (side, e) => {
    e.preventDefault();
    resizing.current = {
      side,
      startX: e.clientX || e.touches?.[0]?.clientX,
      startWidth: side === 'left' ? leftWidth : rightWidth,
    };
  };

  // Example array for procedural divs

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', width: '100%' }}>
      <AppBar position="static" sx={{ background: colors[theme].background, color: colors[theme].text, zIndex: sidebarZIndex + 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left section */}
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            {!sidebarleftdisabled && (
              <IconButton size="small" sx={{ color: colors[theme].text, mr: 2 }} onClick={() => setLeftOpen((open) => !open)}>
                {leftOpen ? <ChevronLeftIcon /> : <MenuIcon />}
              </IconButton>
            )}
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              SCPRPG
            </Typography>
          </Box>

          {/* Middle section */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <Stack
              direction="row"
              divider={
                <Box
                  component="hr"
                  sx={(theme) => ({
                    border: `1px solid ${'#fff'}`,
                    ...theme.applyStyles('dark', {
                      border: `1px solid ${'#262B32'}`,
                    }),
                  })}
                />
              }
              spacing={2}
            >
              {middlecontent}
            </Stack>
          </Box>

          {/* Right section */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
            <IconButton onClick={toggleTheme} sx={{ color: colors[theme].text }}>
              {theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            {!sidebarrightdisabled && (
              <IconButton size="small" sx={{ color: colors[theme].text, ml: 2 }} onClick={() => setRightOpen((open) => !open)}>
                {rightOpen ? <ChevronRightIcon /> : <MenuIcon />}
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {!sidebarleftdisabled && (
        <Box
          className="left-sidebar"
          sx={{
            position: 'fixed',
            top: 64,
            left: 0,
            width: leftOpen ? leftWidth : 0,
            height: 'calc(100vh - 64px)',
            background: colors[theme].background,
            color: colors[theme].text,
            zIndex: sidebarZIndex,
            boxShadow: leftOpen ? 3 : 0,
            transition: 'width 0.3s ease',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            userSelect: resizing.current.side ? 'none' : 'auto',
          }}
        >
          {leftOpen && (
            <Box
              onMouseDown={(e) => startResize('left', e)}
              onTouchStart={(e) => startResize('left', e)}
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 6,
                height: '100%',
                cursor: 'col-resize',
                zIndex: sidebarZIndex + 2,
                '&:hover': { background: colors[theme].hover },
              }}
            />
          )}
          <Box sx={{ flexGrow: 1, width: '100%', overflow: 'auto', px: 1 }}>
            {leftSidebarContent ?? <Typography variant="body2">Left Sidebar Content</Typography>}
          </Box>
        </Box>
      )}

      {!sidebarrightdisabled && (
        <Box
          className="right-sidebar"
          sx={{
            position: 'fixed',
            top: 64,
            right: 0,
            width: rightOpen ? rightWidth : 0,
            height: 'calc(100vh - 64px)',
            background: colors[theme].background,
            color: colors[theme].text,
            zIndex: sidebarZIndex,
            boxShadow: rightOpen ? 3 : 0,
            transition: 'width 0.3s ease',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            userSelect: resizing.current.side ? 'none' : 'auto',
          }}
        >
          {rightOpen && (
            <Box
              onMouseDown={(e) => startResize('right', e)}
              onTouchStart={(e) => startResize('right', e)}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 6,
                height: '100%',
                cursor: 'col-resize',
                zIndex: sidebarZIndex + 2,
                '&:hover': { background: colors[theme].hover },
              }}
            />
          )}
          <Box sx={{ flexGrow: 1, width: '100%', overflow: 'auto', px: 1 }}>
            {rightSidebarContent ?? <Typography variant="body2">Right Sidebar Content</Typography>}
          </Box>
        </Box>
      )}

      <Box sx={{ flexGrow: 1, minWidth: 0, overflow: 'auto', position: 'relative' }}>
        {children}
      </Box>
    </div>
  );
};

export default Navbar;
