import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce'; // Install lodash.debounce if not already installed
import {
    Box,
    Typography,
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Divider,
    AppBar,
    Toolbar,
    IconButton,
    Stack,
    Card,
    CardContent,
    CircularProgress,
    CssBaseline,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Avatar,
} from '@mui/material';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FaTicketAlt, FaSync, FaTimesCircle, FaMoon, FaSun, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';

const getInitialDarkMode = () => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
};

const statuses = {
    0: 'Closed',
    1: `Claimed`,
    2: 'Unclaimed',
};


const TicketViewer = () => {
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [ticketData, setTicketData] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(getInitialDarkMode);
    const [newMessage, setNewMessage] = useState("");
    const [sortAsc, setSortAsc] = useState(true);
    const [filterStatus, setFilterStatus] = useState("all");

    let timer = null; // Initialize timer variable

    const handleInputChange = (e) => {
        setNewMessage(e.target.value); // Directly update the state without debounce\
    };

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
        },
    });

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/tickets');
            if (!response.ok) throw new Error(`Error: ${response.statusText}`);
            const data = await response.json();
            setTicketData(data);
        } catch (error) {
            console.error('Failed to fetch tickets:', error);
        }
        setLoading(false);
    };

    const fetchMessages = async (ticketId) => {
        try {
            const response = await fetch(`/api/tickets/${ticketId}`);
            if (!response.ok) throw new Error(`Error: ${response.statusText}`);
            const data = await response.json();

            // Fetch avatars for each message author
            const messagesWithAvatars = await Promise.all(
                data.messages.map(async (message) => {
                    try {
                        const avatarResponse = await fetch(`/api/user/avatar/${message.authorId}`);
                        if (!avatarResponse.ok) throw new Error(`Error fetching avatar for user ${message.authorId}`);
                        const avatarData = await avatarResponse.json();
                        return { ...message, authorAvatar: avatarData.avatarUrl };
                    } catch (error) {
                        console.error(`Failed to fetch avatar for user ${message.authorId}:`, error);
                        return { ...message, authorAvatar: null }; // Fallback to null if avatar fetch fails
                    }
                })
            );

            setMessages(messagesWithAvatars);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;
        try {
            await fetch(`/api/tickets/${selectedTicket.id}/reply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reply: newMessage }),
            });
            setNewMessage("");
            fetchMessages(selectedTicket.id);
        } catch (err) {
            console.error("Failed to send message:", err);
        }
    };

    const handleCloseTicket = async () => {
        try {
            await fetch(`/api/tickets/${selectedTicket.id}/close`, { method: 'POST' });
            fetchTickets();
            setSelectedTicket(null);
        } catch (err) {
            console.error("Error closing ticket:", err);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const filteredTickets = ticketData.filter(ticket =>
        filterStatus === "all" || ticket.status === filterStatus
    );

    const sortedMessages = [...messages].sort((a, b) =>
        sortAsc
            ? new Date(a.timestamp) - new Date(b.timestamp)
            : new Date(b.timestamp) - new Date(a.timestamp)
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box display="flex" height="100vh">
                {/* Sidebar */}
                <Box width="25%" p={2} sx={{ bgcolor: 'background.paper', borderRight: 1, borderColor: 'divider' }} overflow="auto">
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6">Tickets</Typography>
                        <Stack direction="row" spacing={1}>
                            <IconButton onClick={() => setDarkMode(!darkMode)}>
                                {darkMode ? <FaSun /> : <FaMoon />}
                            </IconButton>
                            <IconButton
                                onClick={() => {
                                    fetchTickets();
                                    setSelectedTicket(null);
                                    setMessages([]);
                                }}
                            >
                                <FaSync />
                            </IconButton>
                        </Stack>
                    </Stack>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={filterStatus}
                            label="Status"
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="open">Open</MenuItem>
                            <MenuItem value="closed">Closed</MenuItem>
                        </Select>
                    </FormControl>

                    {loading ? (
                        <CircularProgress />
                    ) : (
                        <List>
                            {filteredTickets.length > 0 ? (
                                filteredTickets.map((ticket) => (
                                    <ListItem
                                        key={ticket.id}
                                        button
                                        onClick={() => {
                                            setSelectedTicket(ticket);
                                            fetchMessages(ticket.id);
                                        }}
                                        sx={{
                                            borderRadius: 2,
                                            mb: 1,
                                            bgcolor: selectedTicket?.id === ticket.id ? 'primary.dark' : 'transparent',
                                            boxShadow: selectedTicket?.id === ticket.id ? 1 : 0,
                                            '&:hover': {
                                                bgcolor: 'action.hover',
                                            },
                                        }}
                                    >
                                        <ListItemIcon><FaTicketAlt /></ListItemIcon>
                                        <ListItemText
                                            primary={`#${ticket.ticketNumber} - ${ticket.type}`}
                                            secondary={`Status: ${statuses[ticket.status]}`}
                                        />
                                    </ListItem>
                                ))
                            ) : (
                                <Typography>No tickets available</Typography>
                            )}
                        </List>
                    )}
                </Box>

                {/* Content Area */}
                <Box width="75%" p={3} overflow="auto">
                    {selectedTicket ? (
                        <>
                            <AppBar position="static" color="default" elevation={1} sx={{ mb: 2 }}>
                                <Toolbar>
                                    <Box flexGrow={1}>
                                        <Typography variant="h6">
                                            Ticket #{selectedTicket.ticketNumber} - {selectedTicket.type}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Status: {statuses[selectedTicket.status]}
                                        </Typography>
                                    </Box>
                                    {selectedTicket.status === 0 ? ( // Check if the ticket is closed
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            startIcon={<FaTimesCircle />}
                                            onClick={async () => {
                                                try {
                                                    await fetch(`/api/tickets/${selectedTicket.id}/delete`, { method: 'DELETE' });
                                                    fetchTickets();
                                                    setSelectedTicket(null);
                                                } catch (err) {
                                                    console.error("Error deleting ticket:", err);
                                                }
                                            }}
                                        >
                                            Delete Ticket
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            startIcon={<FaTimesCircle />}
                                            onClick={handleCloseTicket}
                                        >
                                            Close Ticket
                                        </Button>
                                    )}
                                </Toolbar>
                            </AppBar>

                            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                                <Typography variant="h6">Messages</Typography>
                                <Button
                                    onClick={() => setSortAsc(!sortAsc)}
                                    startIcon={sortAsc ? <FaSortAmountUp /> : <FaSortAmountDown />}
                                >
                                    Sort: {sortAsc ? "Oldest First" : "Newest First"}
                                </Button>
                            </Stack>

                            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                                {sortedMessages.length > 0 ? (
                                    sortedMessages.map((message) => {
                                        const isImage = /\.(gif|jpe?g|png|webp)$/i.test(message.content); // Check if the message is an image URL
                                        const isLink = /^https?:\/\/[^\s]+$/.test(message.content); // Check if the message is a URL

                                        return (
                                            <Card key={message.id} variant="outlined" sx={{ mb: 2 }}>
                                                <CardContent>
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        <Avatar src={message.authorAvatar} />
                                                        <Typography variant="subtitle2" color="primary">
                                                            {message.authorTag}
                                                        </Typography>
                                                    </Stack>
                                                    {isImage ? (
                                                        <Box sx={{ mt: 1 }}>
                                                            <img
                                                                src={message.content}
                                                                alt="Message content"
                                                                style={{ maxWidth: '100%', borderRadius: '8px' }}
                                                            />
                                                        </Box>
                                                    ) : isLink ? (
                                                        <Typography variant="body1" sx={{ mt: 1 }}>
                                                            <a 
                                                                href={message.content} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer" 
                                                                role="img"
                                                                style={{ color: 'inherit', textDecoration: 'underline' }}
                                                            >
                                                                {message.content}
                                                            </a>
                                                        </Typography>
                                                    ) : (
                                                        <Typography variant="body1" sx={{ mt: 1 }}>
                                                            {message.content}
                                                        </Typography>
                                                    )}
                                                    <Typography variant="caption" color="text.secondary">
                                                        {new Date(message.timestamp).toLocaleString()}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        );
                                    })
                                ) : (
                                    <Typography>No messages available</Typography>
                                )}
                            </Paper>

                            <Box mt={2}>
                                <TextField
                                    label="Write a message"
                                    multiline
                                    fullWidth
                                    minRows={3}
                                    value={newMessage}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                />
                                <Button variant="contained" sx={{ mt: 1 }} onClick={handleSendMessage}>
                                    Send
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <Typography>Select a ticket to view details</Typography>
                    )}
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default TicketViewer;
