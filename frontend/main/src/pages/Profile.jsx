import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  Button,
  TextField,
  Alert,
  Paper,
  Chip,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Verified as VerifiedIcon,
  Shield as ShieldIcon,
  EmojiEvents as EmojiEventsIcon,
} from '@mui/icons-material';
import { useNavbar } from '../addons/navbar';
import ApiService from '../services/ApiService';

const Profile = () => {
  const { setOption, setSidebarLeftDisabled, setSidebarRightDisabled, userInfo } = useNavbar();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setOption('profile');
    setSidebarLeftDisabled(false);
    setSidebarRightDisabled(true);
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userData = await ApiService.getCurrentUser();
      setUser(userData.user || userInfo);
      setFormData(userData.user || userInfo || {});
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      // TODO: Implement API call to save user data
      setUser(formData);
      setEditing(false);
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1419 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Loading profile...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1419 100%)',
      pt: 4,
      pb: 4,
    }}>
      <Container maxWidth="lg">
        <Typography variant="h3" sx={{
          color: '#fff',
          mb: 4,
          fontWeight: 700,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Profile
        </Typography>

        <Grid container spacing={3}>
          {/* Profile Card */}
          <Grid item xs={12} md={4}>
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 3,
              textAlign: 'center',
            }}>
              <CardContent>
                <Avatar
                  src={formData.avatar}
                  alt={formData.username}
                  sx={{
                    width: 120,
                    height: 120,
                    mx: 'auto',
                    mb: 3,
                    border: '4px solid #667eea',
                  }}
                />
                <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, mb: 0.5 }}>
                  {formData.username}
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', mb: 3 }}>
                  #{formData.userId}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 3, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<VerifiedIcon />}
                    label="Verified"
                    size="small"
                    sx={{
                      background: 'rgba(76, 175, 80, 0.2)',
                      color: '#4CAF50',
                    }}
                  />
                  <Chip
                    icon={<ShieldIcon />}
                    label="Member"
                    size="small"
                    sx={{
                      background: 'rgba(102, 126, 234, 0.2)',
                      color: '#667eea',
                    }}
                  />
                </Box>

                {!editing && (
                  <Button
                    fullWidth
                    startIcon={<EditIcon />}
                    onClick={() => setEditing(true)}
                    sx={{
                      background: 'rgba(102, 126, 234, 0.2)',
                      color: '#667eea',
                      textTransform: 'none',
                    }}
                  >
                    Edit Profile
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 3,
              mt: 3,
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 2 }}>
                  Statistics
                </Typography>
                <Box sx={{ py: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Tickets Created
                    </Typography>
                    <Typography sx={{ color: '#667eea', fontWeight: 700 }}>12</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Resolved
                    </Typography>
                    <Typography sx={{ color: '#4CAF50', fontWeight: 700 }}>10</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Member Since
                    </Typography>
                    <Typography sx={{ color: '#667eea', fontWeight: 700 }}>30 days</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Edit Form */}
          <Grid item xs={12} md={8}>
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 3,
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 3 }}>
                  Account Information
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Username"
                      name="username"
                      value={formData.username || ''}
                      onChange={handleInputChange}
                      disabled={!editing}
                      sx={{
                        '& .MuiInputBase-root': {
                          color: '#fff',
                          background: editing ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                        },
                        '& .MuiInputBase-input:disabled': {
                          color: 'rgba(255, 255, 255, 0.7)',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '& .MuiInputLabel-root': {
                          color: 'rgba(255, 255, 255, 0.5)',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="User ID"
                      name="userId"
                      value={formData.userId || ''}
                      disabled
                      sx={{
                        '& .MuiInputBase-root': {
                          color: '#fff',
                          background: 'rgba(255, 255, 255, 0.05)',
                        },
                        '& .MuiInputBase-input:disabled': {
                          color: 'rgba(255, 255, 255, 0.7)',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '& .MuiInputLabel-root': {
                          color: 'rgba(255, 255, 255, 0.5)',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Bio"
                      name="bio"
                      value={formData.bio || ''}
                      onChange={handleInputChange}
                      disabled={!editing}
                      multiline
                      rows={4}
                      placeholder="Tell us about yourself..."
                      sx={{
                        '& .MuiInputBase-root': {
                          color: '#fff',
                          background: editing ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                        },
                        '& .MuiInputBase-input:disabled': {
                          color: 'rgba(255, 255, 255, 0.7)',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '& .MuiInputLabel-root': {
                          color: 'rgba(255, 255, 255, 0.5)',
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                {editing && (
                  <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        textTransform: 'none',
                      }}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={() => setEditing(false)}
                      sx={{
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        color: '#fff',
                        textTransform: 'none',
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Profile;
