import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Button,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assignment as TicketIcon,
  Person as ProfileIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Logout as LogoutIcon,
  Home as HomeIcon,
  DocumentScanner as DocumentIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Navigation = ({ onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Home', path: '/', icon: <HomeIcon /> },
    { name: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { name: 'Tickets', path: '/tickets', icon: <TicketIcon /> },
    { name: 'Profile', path: '/profile', icon: <ProfileIcon /> },
  ];

  const settingsItems = [
    { name: 'Admin Panel', path: '/admin', icon: <AdminIcon />, admin: true },
    { name: 'Settings', path: '/settings', icon: <SettingsIcon /> },
    { name: 'Help & Support', path: '/help', icon: <HelpIcon /> },
    { name: 'Documentation', path: '/docs', icon: <DocumentIcon /> },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (onNavigate) onNavigate();
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
    if (onNavigate) onNavigate();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      color: '#fff',
    }}>
      {/* Main Menu */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Typography variant="caption" sx={{
          px: 2,
          py: 1,
          display: 'block',
          color: 'rgba(255, 255, 255, 0.5)',
          fontWeight: 700,
          textTransform: 'uppercase',
          fontSize: '0.75rem',
          letterSpacing: '0.5px',
        }}>
          Main
        </Typography>
        <List disablePadding>
          {menuItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  color: '#fff',
                  background: isActive(item.path) ? 'rgba(102, 126, 234, 0.2)' : 'transparent',
                  borderLeft: isActive(item.path) ? '3px solid #667eea' : '3px solid transparent',
                  '&:hover': {
                    background: 'rgba(102, 126, 234, 0.1)',
                  },
                  py: 1.5,
                }}
              >
                <ListItemIcon sx={{
                  color: isActive(item.path) ? '#667eea' : 'rgba(255, 255, 255, 0.7)',
                  minWidth: 40,
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.name}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontWeight: isActive(item.path) ? 600 : 500,
                      fontSize: '0.95rem',
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2, background: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Settings Menu */}
        <Typography variant="caption" sx={{
          px: 2,
          py: 1,
          display: 'block',
          color: 'rgba(255, 255, 255, 0.5)',
          fontWeight: 700,
          textTransform: 'uppercase',
          fontSize: '0.75rem',
          letterSpacing: '0.5px',
        }}>
          Settings
        </Typography>
        <List disablePadding>
          {settingsItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  color: '#fff',
                  background: isActive(item.path) ? 'rgba(102, 126, 234, 0.2)' : 'transparent',
                  borderLeft: isActive(item.path) ? '3px solid #667eea' : '3px solid transparent',
                  '&:hover': {
                    background: 'rgba(102, 126, 234, 0.1)',
                  },
                  py: 1.5,
                }}
              >
                <ListItemIcon sx={{
                  color: isActive(item.path) ? '#667eea' : 'rgba(255, 255, 255, 0.7)',
                  minWidth: 40,
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.name}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontWeight: isActive(item.path) ? 600 : 500,
                      fontSize: '0.95rem',
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Logout Button */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            borderColor: 'rgba(255, 255, 255, 0.2)',
            color: '#fff',
            textTransform: 'none',
            '&:hover': {
              borderColor: '#F44336',
              background: 'rgba(244, 67, 54, 0.1)',
            }
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Navigation;
