import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import { FaBars, FaCog, FaMoon, FaSun,FaRegCircle } from "react-icons/fa";
import { useThemeMode } from "./ThemeContext.jsx";

// Dummy settings content
function GeneralSettings() {
  return (
    <Box p={3}>
      <Typography variant="h6" gutterBottom>General Settings</Typography>
      <Typography>Here you can add more settings.</Typography>
    </Box>
  );
}

function NavMenu({ onLeftDrawerChange }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [leftOpen, setLeftOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { mode, nextMode } = useThemeMode();

  // When left drawer changes, notify parent so it can scale content
  const handleLeftDrawer = (open) => {
    setLeftOpen(open);
    if (onLeftDrawerChange) onLeftDrawerChange(open);
  };

  // Save theme mode persistently
  const handleThemeChange = (mode) => {
    setThemeMode(mode);
    localStorage.setItem("themeMode", mode);
  };

  const navLinks = (
    <Box>
      <a href="/" style={{ textDecoration: "none", color: "inherit", marginRight: "16px" }}>Home</a>
      <a href="/about" style={{ textDecoration: "none", color: "inherit", marginRight: "16px" }}>About</a>
      {user && (
        <>
          <a href="/tickets" style={{ textDecoration: "none", color: "inherit", marginRight: "16px" }}>Tickets</a>
          <a href="/docs" style={{ textDecoration: "none", color: "inherit", marginRight: "16px" }}>Docs</a>
          <a href="/casino" style={{ textDecoration: "none", color: "inherit", marginRight: "16px" }}>Casino</a>
        </>
      )}
    </Box>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {/* Left hamburger for drawer */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { xs: "flex", md: "none" } }}
            onClick={() => handleLeftDrawer(true)}
          >
            <FaBars />
          </IconButton>
          {/* Logo */}
          <div className="nav-menu-logo">
            <img src="/logo.png" alt="Logo" style={{ height: "40px", marginRight: "16px" }} />
          </div>
          {/* Main links, hidden on xs */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { xs: "none", md: "block" } }}>
            {navLinks}
          </Typography>
          {/* Right side: theme and settings */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton color="inherit" onClick={nextMode} sx={{ ml: 1 }}>
              {mode === "light" ? <FaMoon /> : mode === "dark" ? <FaRegCircle /> : <FaSun />}
            </IconButton>
            <IconButton color="inherit" onClick={() => setSettingsOpen(true)}>
              <FaCog />
            </IconButton>
            {user ? (
              <Box display="flex" alignItems="center">
                <img
                  src={user.avatar || "/default-avatar.png"}
                  alt="Avatar"
                  style={{ width: 32, height: 32, borderRadius: "50%", marginRight: 8 }}
                />
                <Typography variant="body1" color="inherit" sx={{ marginRight: 2 }}>
                  {user.username}
                </Typography>
              </Box>
            ) : (
              <Button variant="contained" color="secondary" href="/login">
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      {/* Left Drawer for nav links (mobile) */}
      <Drawer anchor="left" open={leftOpen} onClose={() => handleLeftDrawer(false)}>
        <Box sx={{ width: 250, p: 2 }}>
          <Box display="flex" justifyContent="flex-end">
            <IconButton onClick={() => handleLeftDrawer(false)}><span>&times;</span></IconButton>
          </Box>
          <Divider sx={{ my: 2 }} />
          <List>
            <ListItem button component="a" href="/">
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component="a" href="/about">
              <ListItemText primary="About" />
            </ListItem>
            {user && (
              <>
                <ListItem button component="a" href="/tickets">
                  <ListItemText primary="Tickets" />
                </ListItem>
                <ListItem button component="a" href="/docs">
                  <ListItemText primary="Docs" />
                </ListItem>
                <ListItem button component="a" href="/casino">
                  <ListItemText primary="Casino" />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
      {/* Right Drawer: General Settings */}
      <Drawer anchor="right" open={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <GeneralSettings />
      </Drawer>
    </>
  );
}

export default NavMenu;