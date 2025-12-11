import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Switch,
  Button,
  TextField,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useNavbar } from '../addons/navbar';

const Settings = () => {
  const { setOption, setSidebarLeftDisabled, setSidebarRightDisabled } = useNavbar();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    discordNotifications: true,
    darkMode: true,
    soundEnabled: false,
    autoRefresh: true,
  });
  const [saved, setSaved] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    setOption('settings');
    setSidebarLeftDisabled(false);
    setSidebarRightDisabled(true);
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      const saved = localStorage.getItem('userSettings');
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleSettingChange = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSaveSettings = () => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const SettingSection = ({ title, icon: Icon, children }) => (
    <Card sx={{
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: 3,
      mb: 3,
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box sx={{
            p: 1.5,
            borderRadius: 2,
            background: 'rgba(102, 126, 234, 0.2)',
            color: '#667eea',
            mr: 2,
          }}>
            <Icon />
          </Box>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>
            {title}
          </Typography>
        </Box>
        {children}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1419 100%)',
      pt: 4,
      pb: 4,
    }}>
      <Container maxWidth="md">
        <Typography variant="h3" sx={{
          color: '#fff',
          mb: 4,
          fontWeight: 700,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Settings
        </Typography>

        {saved && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Settings saved successfully!
          </Alert>
        )}

        {/* Notifications */}
        <SettingSection title="Notifications" icon={NotificationsIcon}>
          <List disablePadding>
            <ListItem>
              <ListItemText
                primary="Email Notifications"
                secondary="Receive updates via email"
                sx={{
                  '& .MuiListItemText-primary': { color: '#fff' },
                  '& .MuiListItemText-secondary': { color: 'rgba(255, 255, 255, 0.5)' },
                }}
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={settings.emailNotifications}
                  onChange={() => handleSettingChange('emailNotifications')}
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider sx={{ background: 'rgba(255, 255, 255, 0.1)', my: 1 }} />
            <ListItem>
              <ListItemText
                primary="Discord Notifications"
                secondary="Get notified in Discord"
                sx={{
                  '& .MuiListItemText-primary': { color: '#fff' },
                  '& .MuiListItemText-secondary': { color: 'rgba(255, 255, 255, 0.5)' },
                }}
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={settings.discordNotifications}
                  onChange={() => handleSettingChange('discordNotifications')}
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider sx={{ background: 'rgba(255, 255, 255, 0.1)', my: 1 }} />
            <ListItem>
              <ListItemText
                primary="Sound Alerts"
                secondary="Play sound on new events"
                sx={{
                  '& .MuiListItemText-primary': { color: '#fff' },
                  '& .MuiListItemText-secondary': { color: 'rgba(255, 255, 255, 0.5)' },
                }}
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={settings.soundEnabled}
                  onChange={() => handleSettingChange('soundEnabled')}
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </SettingSection>

        {/* Appearance */}
        <SettingSection title="Appearance" icon={PaletteIcon}>
          <List disablePadding>
            <ListItem>
              <ListItemText
                primary="Dark Mode"
                secondary="Use dark theme (always enabled)"
                sx={{
                  '& .MuiListItemText-primary': { color: '#fff' },
                  '& .MuiListItemText-secondary': { color: 'rgba(255, 255, 255, 0.5)' },
                }}
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={settings.darkMode}
                  disabled
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider sx={{ background: 'rgba(255, 255, 255, 0.1)', my: 1 }} />
            <ListItem>
              <ListItemText
                primary="Auto Refresh"
                secondary="Automatically refresh data"
                sx={{
                  '& .MuiListItemText-primary': { color: '#fff' },
                  '& .MuiListItemText-secondary': { color: 'rgba(255, 255, 255, 0.5)' },
                }}
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={settings.autoRefresh}
                  onChange={() => handleSettingChange('autoRefresh')}
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </SettingSection>

        {/* Security */}
        <SettingSection title="Security" icon={SecurityIcon}>
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
              Session Management
            </Typography>
            <Button
              variant="outlined"
              color="error"
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
              Sign Out All Devices
            </Button>
          </Box>
        </SettingSection>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveSettings}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              textTransform: 'none',
              px: 4,
            }}
          >
            Save Settings
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteDialogOpen(true)}
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: '#fff',
              textTransform: 'none',
            }}
          >
            Delete Account
          </Button>
        </Box>
      </Container>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <Dialog
          sx={{
            '& .MuiDialog-paper': {
              background: 'rgba(26, 31, 58, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          <DialogTitle sx={{ color: '#fff' }}>Delete Account</DialogTitle>
          <DialogContent>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Are you sure you want to permanently delete your account? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              sx={{ color: '#667eea' }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Dialog>
    </Box>
  );
};

export default Settings;
