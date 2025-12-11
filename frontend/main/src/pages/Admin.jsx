import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Pagination,
  TextField,
} from '@mui/material';
import {
  AdminPanelSettings as AdminIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Block as BlockIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { useNavbar } from '../addons/navbar';
import PageHeader from '../components/PageHeader';

const Admin = () => {
  const { setOption, setSidebarLeftDisabled, setSidebarRightDisabled } = useNavbar();
  const [stats, setStats] = useState({
    totalUsers: 1234,
    activeToday: 456,
    totalTickets: 5678,
    averageResponseTime: '2.5h',
  });
  const [users, setUsers] = useState([
    { id: 1, username: 'user1', email: 'user1@example.com', role: 'admin', status: 'active', joinDate: '2024-01-15' },
    { id: 2, username: 'user2', email: 'user2@example.com', role: 'moderator', status: 'active', joinDate: '2024-02-20' },
    { id: 3, username: 'user3', email: 'user3@example.com', role: 'user', status: 'inactive', joinDate: '2024-03-10' },
  ]);
  const [page, setPage] = useState(1);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setOption('admin');
    setSidebarLeftDisabled(false);
    setSidebarRightDisabled(true);
  }, []);

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData(user);
    setEditDialogOpen(true);
  };

  const handleSaveUser = () => {
    setUsers(prev => prev.map(u => u.id === formData.id ? formData : u));
    setEditDialogOpen(false);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(u => u.id !== userId));
    }
  };

  const StatCard = ({ title, value, color }) => (
    <Card sx={{
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: 3,
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700 }}>
              {value}
            </Typography>
          </Box>
          <Box sx={{
            p: 1.5,
            borderRadius: 2,
            background: `${color}20`,
            color: color,
          }}>
            <AdminIcon />
          </Box>
        </Box>
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
      <Container maxWidth="lg">
        <PageHeader
          title="Admin Dashboard"
          icon={AdminIcon}
          subtitle="Manage users, tickets, and system settings"
        />

        {/* Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              color="#667eea"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Today"
              value={stats.activeToday}
              color="#4CAF50"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Tickets"
              value={stats.totalTickets}
              color="#FF9800"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Avg Response"
              value={stats.averageResponseTime}
              color="#4facfe"
            />
          </Grid>
        </Grid>

        {/* Users Table */}
        <Card sx={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 3,
          mb: 4,
        }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 3 }}>
              User Management
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 700 }}>
                      Username
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 700 }}>
                      Email
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 700 }}>
                      Role
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 700 }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 700 }}>
                      Join Date
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 700 }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map(user => (
                    <TableRow
                      key={user.id}
                      sx={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.03)',
                        }
                      }}
                    >
                      <TableCell sx={{ color: '#fff' }}>
                        {user.username}
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.role}
                          size="small"
                          sx={{
                            background: user.role === 'admin'
                              ? 'rgba(102, 126, 234, 0.2)'
                              : user.role === 'moderator'
                                ? 'rgba(255, 152, 0, 0.2)'
                                : 'rgba(255, 255, 255, 0.1)',
                            color: user.role === 'admin'
                              ? '#667eea'
                              : user.role === 'moderator'
                                ? '#FF9800'
                                : '#fff',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.status}
                          size="small"
                          icon={user.status === 'active' ? <CheckIcon /> : <BlockIcon />}
                          sx={{
                            background: user.status === 'active'
                              ? 'rgba(76, 175, 80, 0.2)'
                              : 'rgba(244, 67, 54, 0.2)',
                            color: user.status === 'active' ? '#4CAF50' : '#F44336',
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {user.joinDate}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => handleEditUser(user)}
                          sx={{
                            color: '#667eea',
                            textTransform: 'none',
                            mr: 1,
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteUser(user.id)}
                          sx={{
                            color: '#F44336',
                            textTransform: 'none',
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={5}
                page={page}
                onChange={(e, value) => setPage(value)}
                sx={{
                  '& .MuiButtonBase-root': {
                    color: '#fff',
                  },
                  '& .Mui-selected': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }
                }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Edit User Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
          <Dialog
            sx={{
              '& .MuiDialog-paper': {
                background: 'rgba(26, 31, 58, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            <DialogTitle sx={{ color: '#fff' }}>Edit User</DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="Username"
                value={formData.username || ''}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                sx={{
                  mb: 2,
                  '& .MuiInputBase-root': {
                    color: '#fff',
                    background: 'rgba(255, 255, 255, 0.05)',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.5)',
                  },
                }}
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>Role</InputLabel>
                <Select
                  value={formData.role || 'user'}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  label="Role"
                  sx={{
                    color: '#fff',
                    background: 'rgba(255, 255, 255, 0.05)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '& .MuiSvgIcon-root': {
                      color: '#fff',
                    }
                  }}
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="moderator">Moderator</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>Status</InputLabel>
                <Select
                  value={formData.status || 'active'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  label="Status"
                  sx={{
                    color: '#fff',
                    background: 'rgba(255, 255, 255, 0.05)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '& .MuiSvgIcon-root': {
                      color: '#fff',
                    }
                  }}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="suspended">Suspended</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button
                onClick={() => setEditDialogOpen(false)}
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveUser}
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Admin;
