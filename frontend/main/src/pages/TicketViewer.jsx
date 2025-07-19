import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  IconButton,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Avatar,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Close as CloseIcon,
  Reply as ReplyIcon,
  Delete as DeleteIcon,
  Home as HomeIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useNavbar } from '../addons/navbar';
import ApiService from '../services/ApiService';

const TicketViewer = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { 
    setOption, 
    setContentLeft, 
    setContentRight, 
    setSidebarLeftDisabled, 
    setSidebarRightDisabled,
    userInfo 
  } = useNavbar();

  // Get JWT token from localStorage
  // Fetch tickets from API
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const tickets = await ApiService.getTickets();
      setTickets(tickets || []);
      setError(null);
    } catch (err) {
      if (err.message === 'Authentication expired' || err.message === 'No authentication token found') {
        setError('Authentication required. Please log in first.');
        // Optionally redirect to login
        // navigate('/login');
      } else {
        setError('Failed to fetch tickets. Please try again.');
      }
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  // Close ticket
  const closeTicket = async (ticketId) => {
    try {
      await ApiService.closeTicket(ticketId);
      setSuccess('Ticket closed successfully');
      fetchTickets(); // Refresh the list
    } catch (err) {
      if (err.message === 'Authentication expired' || err.message === 'No authentication token found') {
        setError('Authentication required. Please log in first.');
      } else {
        setError('Failed to close ticket');
      }
      console.error('Error closing ticket:', err);
    }
  };

  // Delete ticket
  const deleteTicket = async (ticketId) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        await ApiService.deleteTicket(ticketId);
        setSuccess('Ticket deleted successfully');
        fetchTickets(); // Refresh the list
        setDetailDialogOpen(false);
      } catch (err) {
        if (err.message === 'Authentication expired' || err.message === 'No authentication token found') {
          setError('Authentication required. Please log in first.');
        } else {
          setError('Failed to delete ticket');
        }
        console.error('Error deleting ticket:', err);
      }
    }
  };

  // Reply to ticket
  const replyToTicket = async () => {
    if (!replyText.trim()) {
      setError('Reply cannot be empty');
      return;
    }

    try {
      await ApiService.replyToTicket(selectedTicket.id, replyText);
      setSuccess('Reply sent successfully');
      setReplyText('');
      setReplyDialogOpen(false);
      fetchTickets(); // Refresh the list
    } catch (err) {
      if (err.message === 'Authentication expired' || err.message === 'No authentication token found') {
        setError('Authentication required. Please log in first.');
      } else {
        setError('Failed to send reply');
      }
      console.error('Error replying to ticket:', err);
    }
  };

  // Open ticket detail dialog
  const openTicketDetail = (ticket) => {
    setSelectedTicket(ticket);
    setDetailDialogOpen(true);
  };

  // Open reply dialog
  const openReplyDialog = (ticket) => {
    setSelectedTicket(ticket);
    setReplyDialogOpen(true);
  };

  useEffect(() => {
    document.title = 'SCP RPG Discord Bot - Ticket Viewer';
    fetchTickets();
  }, []);

  useEffect(() => {
    // Setup page option
    setOption("tickets");
    
    // Enable both sidebars
    setSidebarLeftDisabled(false);
    setSidebarRightDisabled(false);

    // Setup left sidebar content for navigation
    const leftSidebarContent = (
      <Box sx={{ pt: 2 }}>
        <Typography variant="h6" sx={{ px: 2, mb: 2, color: '#fff' }}>
          Navigation
        </Typography>
        <List>
          <ListItemButton onClick={() => navigate('/')} sx={{ color: '#fff' }}>
            <ListItemIcon>
              <HomeIcon sx={{ color: '#7289da' }} />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
          <ListItemButton onClick={fetchTickets} sx={{ color: '#fff' }}>
            <ListItemIcon>
              <RefreshIcon sx={{ color: '#7289da' }} />
            </ListItemIcon>
            <ListItemText primary="Refresh Tickets" />
          </ListItemButton>
        </List>
        
        <Divider sx={{ my: 2, backgroundColor: 'rgba(255,255,255,0.1)' }} />
        
        <Typography variant="h6" sx={{ px: 2, mb: 2, color: '#fff' }}>
          Ticket Actions
        </Typography>
        <List>
          <ListItemButton disabled sx={{ color: '#fff' }}>
            <ListItemIcon>
              <ViewIcon sx={{ color: '#7289da' }} />
            </ListItemIcon>
            <ListItemText primary="All Tickets" secondary="Select a ticket to view details" />
          </ListItemButton>
        </List>
      </Box>
    );

    // Setup right sidebar content for user account info
    const rightSidebarContent = (
      <Box sx={{ pt: 2 }}>
        <Typography variant="h6" sx={{ px: 2, mb: 2, color: '#fff' }}>
          Account
        </Typography>
        {userInfo ? (
          <Box sx={{ px: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar
                src={userInfo.avatar ? `https://cdn.discordapp.com/avatars/${userInfo.userId}/${userInfo.avatar}.png` : undefined}
                alt={userInfo.username}
                sx={{ width: 64, height: 64, mb: 2 }}
              >
                {!userInfo.avatar && userInfo.username?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h6" sx={{ color: '#fff', textAlign: 'center' }}>
                {userInfo.username}
              </Typography>
              <Typography variant="body2" sx={{ color: '#bdbdbd', textAlign: 'center' }}>
                ID: {userInfo.userId}
              </Typography>
            </Box>
            
            <List>
              <ListItemButton sx={{ color: '#fff' }}>
                <ListItemText primary="View Profile" />
              </ListItemButton>
              <ListItemButton sx={{ color: '#fff' }}>
                <ListItemText primary="Settings" />
              </ListItemButton>
              <ListItemButton onClick={() => {
                localStorage.removeItem('user');
                navigate('/login');
              }} sx={{ color: '#ff6b6b' }}>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </List>
          </Box>
        ) : (
          <Box sx={{ px: 2 }}>
            <Typography variant="body2" sx={{ color: '#bdbdbd', mb: 2 }}>
              Not logged in
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          </Box>
        )}
      </Box>
    );

    setContentLeft(leftSidebarContent);
    setContentRight(rightSidebarContent);

    // Cleanup on unmount
    return () => {
      setContentLeft(null);
      setContentRight(null);
    };
  }, [navigate, userInfo, setOption, setContentLeft, setContentRight, setSidebarLeftDisabled, setSidebarRightDisabled]);

  const getStatusColor = (status) => {
    switch (status) {
      case '1': return 'success';
      case '0': return 'default';
      default: return 'primary';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case '1': return 'Open';
      case '0': return 'Closed';
      default: return 'Unknown';
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#23272a' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#fff', mb: 4 }}>
          Support Tickets
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {tickets.length === 0 ? (
              <Grid item xs={12}>
                <Card sx={{ bgcolor: '#2c2f33', color: '#fff' }}>
                  <CardContent>
                    <Typography variant="h6" align="center">
                      No tickets found
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ) : (
              tickets.map((ticket) => (
                <Grid item xs={12} md={6} lg={4} key={ticket.id || ticket.ticketNumber}>
                  <Card 
                    sx={{ 
                      bgcolor: '#2c2f33', 
                      color: '#fff',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" component="h2" noWrap>
                          Ticket #{ticket.ticketNumber || ticket.id}
                        </Typography>
                        <Chip 
                          label={getStatusText(ticket.status)}
                          color={getStatusColor(ticket.status)}
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        User: {ticket.userName || ticket.user || 'Unknown'}
                      </Typography>
                      
                      <Typography variant="body1" sx={{ mb: 2, color: '#dcddde' }}>
                        {ticket.description || ticket.message || 'No description available'}
                      </Typography>

                      {ticket.replies && ticket.replies.length > 0 && (
                        <Typography variant="body2" color="textSecondary">
                          {ticket.replies.length} reply(s)
                        </Typography>
                      )}
                    </CardContent>

                    <Box sx={{ p: 2, pt: 0 }}>
                      <Grid container spacing={1}>
                        <Grid item xs={12} sm={6}>
                          <Button
                            fullWidth
                            size="small"
                            variant="outlined"
                            startIcon={<ViewIcon />}
                            onClick={() => openTicketDetail(ticket)}
                            sx={{ color: '#7289da', borderColor: '#7289da' }}
                          >
                            View
                          </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Button
                            fullWidth
                            size="small"
                            variant="outlined"
                            startIcon={<ReplyIcon />}
                            onClick={() => openReplyDialog(ticket)}
                            disabled={ticket.status === '0'}
                            sx={{ color: '#43b581', borderColor: '#43b581' }}
                          >
                            Reply
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        )}

        {/* Ticket Detail Dialog */}
        <Dialog 
          open={detailDialogOpen} 
          onClose={() => setDetailDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { bgcolor: '#2c2f33', color: '#fff' }
          }}
        >
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              Ticket #{selectedTicket?.ticketNumber || selectedTicket?.id}
              <IconButton onClick={() => setDetailDialogOpen(false)} sx={{ color: '#fff' }}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedTicket && (
              <Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Status: <Chip 
                    label={getStatusText(selectedTicket.status)}
                    color={getStatusColor(selectedTicket.status)}
                    size="small"
                  />
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  User: {selectedTicket.userName || selectedTicket.user || 'Unknown'}
                </Typography>
                <Divider sx={{ my: 2, bgcolor: '#40444b' }} />
                <Typography variant="h6" gutterBottom>Description:</Typography>
                <Typography variant="body1" sx={{ mb: 3, color: '#dcddde' }}>
                  {selectedTicket.description || selectedTicket.message || 'No description available'}
                </Typography>

                {selectedTicket.replies && selectedTicket.replies.length > 0 && (
                  <>
                    <Typography variant="h6" gutterBottom>Replies:</Typography>
                    <List>
                      {selectedTicket.replies.map((reply, index) => (
                        <ListItem key={index} sx={{ bgcolor: '#40444b', mb: 1, borderRadius: 1 }}>
                          <ListItemText 
                            primary={reply}
                            primaryTypographyProps={{ color: '#dcddde' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => openReplyDialog(selectedTicket)}
              startIcon={<ReplyIcon />}
              disabled={selectedTicket?.status === '0'}
              sx={{ color: '#43b581' }}
            >
              Reply
            </Button>
            <Button 
              onClick={() => closeTicket(selectedTicket?.id || selectedTicket?.ticketNumber)}
              startIcon={<CloseIcon />}
              disabled={selectedTicket?.status === '0'}
              sx={{ color: '#faa61a' }}
            >
              Close
            </Button>
            <Button 
              onClick={() => deleteTicket(selectedTicket?.id || selectedTicket?.ticketNumber)}
              startIcon={<DeleteIcon />}
              sx={{ color: '#f04747' }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Reply Dialog */}
        <Dialog 
          open={replyDialogOpen} 
          onClose={() => setReplyDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { bgcolor: '#2c2f33', color: '#fff' }
          }}
        >
          <DialogTitle>
            Reply to Ticket #{selectedTicket?.ticketNumber || selectedTicket?.id}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Your Reply"
              fullWidth
              multiline
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: '#40444b' },
                  '&:hover fieldset': { borderColor: '#7289da' },
                  '&.Mui-focused fieldset': { borderColor: '#7289da' },
                },
                '& .MuiInputLabel-root': { color: '#8e9297' },
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReplyDialogOpen(false)} sx={{ color: '#8e9297' }}>
              Cancel
            </Button>
            <Button onClick={replyToTicket} variant="contained" sx={{ bgcolor: '#7289da' }}>
              Send Reply
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success/Error Snackbars */}
        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={() => setSuccess(null)}
        >
          <Alert onClose={() => setSuccess(null)} severity="success">
            {success}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert onClose={() => setError(null)} severity="error">
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default TicketViewer;