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
  ListItemText,
  ListItemIcon,
  Avatar,
  Chip,
  Switch,
  FormControlLabel,
  useTheme,
  alpha,
  Slider
} from "@mui/material";
import { 
  FaBars, 
  FaCog, 
  FaMoon, 
  FaSun, 
  FaRegCircle,
  FaHome,
  FaInfoCircle,
  FaCalculator,
  FaDice,
  FaTicketAlt,
  FaBook,
  FaTachometerAlt,
  FaSignInAlt,
  FaTimes
} from "react-icons/fa";
import { useThemeMode } from "./ThemeContext.jsx";

// Enhanced settings component
function GeneralSettings({ onClose, mode, onThemeChange }) {
  const theme = useTheme();
  
  // Theme mapping for slider
  const themeOptions = ['light', 'dark', 'amoled'];
  const themeLabels = {
    light: 'Light',
    dark: 'Dark', 
    amoled: 'AMOLED'
  };
  const themeIcons = {
    light: <FaSun />,
    dark: <FaMoon />,
    amoled: <FaRegCircle />
  };
  
  const currentThemeIndex = themeOptions.indexOf(mode);
  
  const handleSliderChange = (event, newValue) => {
    const newTheme = themeOptions[newValue];
    onThemeChange(newTheme);
  };
  
  return (
    <Box sx={{ 
      width: 320, 
      p: 3,
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
      minHeight: '100vh'
    }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold" color="primary">
          Settings
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
          <FaTimes />
        </IconButton>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      <Box mb={3}>
        <Typography variant="h6" gutterBottom fontWeight="600">
          Appearance
        </Typography>
        
        {/* Theme selection with discrete slider */}
        <Box sx={{ mt: 3, px: 1 }}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            {themeIcons[mode]}
            <Typography variant="body1" fontWeight="500" color="primary">
              {themeLabels[mode]} Theme
            </Typography>
          </Box>
          
          <Slider
            value={currentThemeIndex}
            onChange={handleSliderChange}
            step={1}
            marks={themeOptions.map((theme, index) => ({
              value: index,
              label: themeLabels[theme]
            }))}
            min={0}
            max={2}
            valueLabelDisplay="off"
            sx={{
              '& .MuiSlider-mark': {
                backgroundColor: theme.palette.primary.main,
                height: 8,
                width: 8,
                borderRadius: '50%',
              },
              '& .MuiSlider-markActive': {
                backgroundColor: theme.palette.primary.main,
              },
              '& .MuiSlider-markLabel': {
                fontSize: '0.75rem',
                fontWeight: 500,
                color: theme.palette.text.secondary,
                '&.MuiSlider-markLabelActive': {
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                }
              },
              '& .MuiSlider-thumb': {
                width: 20,
                height: 20,
                backgroundColor: theme.palette.primary.main,
                '&:hover': {
                  boxShadow: `0 0 0 8px ${alpha(theme.palette.primary.main, 0.16)}`,
                },
              },
              '& .MuiSlider-track': {
                backgroundColor: theme.palette.primary.main,
                height: 4,
              },
              '& .MuiSlider-rail': {
                backgroundColor: alpha(theme.palette.primary.main, 0.3),
                height: 4,
              }
            }}
          />
        </Box>
      </Box>
      
      <Box mb={3}>
        <Typography variant="h6" gutterBottom fontWeight="600">
          Preferences
        </Typography>
      </Box>
    </Box>
  );
}

function NavMenu({ onLeftDrawerChange }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user ? user.role : null;
  const [leftOpen, setLeftOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { mode, setMode } = useThemeMode(); // Use setMode instead of nextMode
  const theme = useTheme();

  const handleLeftDrawer = (open) => {
    setLeftOpen(open);
    if (onLeftDrawerChange) onLeftDrawerChange(open);
  };

  const handleThemeChange = (newMode) => {
    setMode(newMode); // Directly set the theme mode
    localStorage.setItem("themeMode", newMode);
  };

  const handleQuickThemeToggle = () => {
    // For the navbar icon, cycle through themes
    const themeOptions = ['light', 'dark', 'amoled'];
    const currentIndex = themeOptions.indexOf(mode);
    const nextIndex = (currentIndex + 1) % themeOptions.length;
    const nextTheme = themeOptions[nextIndex];
    handleThemeChange(nextTheme);
  };

  const navigationItems = [
    { label: "Home", href: "/", icon: <FaHome />, public: true },
    { label: "About", href: "/about", icon: <FaInfoCircle />, public: true },
    { label: "CBC Calc", href: "/cbccalc", icon: <FaCalculator />, public: true },
    { label: "Casino", href: "/casino", icon: <FaDice />, requiresAuth: true },
    { label: "Tickets", href: "/tickets", icon: <FaTicketAlt />, requiresAdmin: true },
    { label: "Docs", href: "/docs", icon: <FaBook />, requiresAdmin: true },
    { label: "Dashboard", href: "/dashboard", icon: <FaTachometerAlt />, requiresAdmin: true },
    { label: "Ai", href: "/ai", icon: <FaSignInAlt />, public: true, requiresAuth: false }
  ];

  const filteredNavItems = navigationItems.filter(item => {
    if (item.public) return true;
    if (item.requiresAuth && !user) return false;
    if (item.requiresAdmin && (!role || !role.includes("admin"))) return false;
    return true;
  });

  const navLinks = (
    <Box display="flex" alignItems="center" gap={2}>
      {filteredNavItems.map((item) => (
        <Button
          key={item.label}
          href={item.href}
          sx={{
            color: 'inherit',
            textTransform: 'none',
            fontWeight: 500,
            px: 2,
            py: 1,
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: alpha(theme.palette.common.white, 0.1),
              transform: 'translateY(-2px)',
            }
          }}
        >
          {item.label}
        </Button>
      ))}
    </Box>
  );

  return (
    <>
      <AppBar 
        position="static" 
        sx={{ 
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          {/* Mobile menu button */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ 
              mr: 2, 
              display: { xs: "flex", md: "none" },
              '&:hover': { backgroundColor: alpha(theme.palette.common.white, 0.1) }
            }}
            onClick={() => handleLeftDrawer(true)}
          >
            <FaBars />
          </IconButton>

          {/* Logo with animation */}
          <Box 
            sx={{ 
              display: "flex", 
              alignItems: "center", 
              mr: 4,
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'scale(1.05)' }
            }}
          >
            <img 
              src="/logo.png" 
              alt="Logo" 
              style={{ 
                height: "45px", 
                marginRight: "12px",
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
              }} 
            />
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                letterSpacing: '0.5px',
                display: { xs: "none", sm: "block" }
              }}
            >
              SCPRPG
            </Typography>
          </Box>

          {/* Desktop navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {navLinks}
          </Box>

          {/* Right side controls */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Theme toggle */}
            <IconButton 
              color="inherit" 
              onClick={handleQuickThemeToggle} // Use new function
              sx={{ 
                transition: 'all 0.3s ease',
                '&:hover': { 
                  backgroundColor: alpha(theme.palette.common.white, 0.1),
                  transform: 'rotate(180deg)'
                }
              }}
            >
              {mode === "light" ? <FaMoon /> : mode === "dark" ? <FaRegCircle /> : <FaSun />}
            </IconButton>

            {/* Settings */}
            <IconButton 
              color="inherit" 
              onClick={() => setSettingsOpen(true)}
              sx={{ 
                transition: 'all 0.3s ease',
                '&:hover': { 
                  backgroundColor: alpha(theme.palette.common.white, 0.1),
                  transform: 'rotate(90deg)'
                }
              }}
            >
              <FaCog />
            </IconButton>

            {/* User section */}
            {user ? (
              <Box 
                display="flex" 
                alignItems="center" 
                sx={{ 
                  ml: 2,
                  p: 1,
                  borderRadius: 3,
                  backgroundColor: alpha(theme.palette.common.white, 0.1),
                  transition: 'all 0.3s ease',
                  '&:hover': { backgroundColor: alpha(theme.palette.common.white, 0.2) }
                }}
              >
                <Avatar
                  src={user.avatar || "/default-avatar.png"}
                  alt={user.username}
                  sx={{ 
                    width: 35, 
                    height: 35, 
                    mr: 1,
                    border: '2px solid rgba(255,255,255,0.3)'
                  }}
                />
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  <Typography variant="body2" fontWeight="600">
                    {user.username}
                  </Typography>
                  {role && role.includes("admin") && (
                    <Chip 
                      label="Admin" 
                      size="small" 
                      color="secondary"
                      sx={{ height: 18, fontSize: '0.7rem' }}
                    />
                  )}
                </Box>
              </Box>
            ) : (
              <Button 
                variant="contained" 
                color="secondary" 
                href="/login"
                startIcon={<FaSignInAlt />}
                sx={{
                  ml: 2,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                  }
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Enhanced Mobile Drawer */}
      <Drawer 
        anchor="left" 
        open={leftOpen} 
        onClose={() => handleLeftDrawer(false)}
        PaperProps={{
          sx: {
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.primary.main, 0.05)})`,
            backdropFilter: 'blur(10px)',
          }
        }}
      >
        <Box sx={{ width: 280, p: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight="bold" color="primary">
              Navigation
            </Typography>
            <IconButton 
              onClick={() => handleLeftDrawer(false)}
              sx={{ color: 'text.secondary' }}
            >
              <FaTimes />
            </IconButton>
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          <List>
            {filteredNavItems.map((item) => (
              <ListItem 
                key={item.label}
                button 
                component="a" 
                href={item.href}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    transform: 'translateX(8px)',
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'primary.main', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      {/* Enhanced Settings Drawer */}
      <Drawer 
        anchor="right" 
        open={settingsOpen} 
        onClose={() => setSettingsOpen(false)}
        PaperProps={{
          sx: {
            backdropFilter: 'blur(10px)',
          }
        }}
      >
        <GeneralSettings 
          onClose={() => setSettingsOpen(false)}
          mode={mode}
          onThemeChange={handleThemeChange}
        />
      </Drawer>
    </>
  );
}

export default NavMenu;