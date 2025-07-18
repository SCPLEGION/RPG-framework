import { 
    Card, 
    CardContent, 
    Typography, 
    Grid, 
    Box, 
    Alert,
    CircularProgress,
    Chip,
    IconButton,
    LinearProgress,
    useTheme,
    alpha,
    Fade,
    Grow
} from "@mui/material";
import { 
    People, 
    ConfirmationNumber, 
    Refresh, 
    TrendingUp,
    Assessment,
    Security,
    Speed,
    Timeline
} from "@mui/icons-material";
import { 
    FaUsers, 
    FaTicketAlt, 
    FaChartLine, 
    FaServer,
    FaShieldAlt,
    FaClock
} from "react-icons/fa";
import React, { useEffect, useState, useCallback } from "react";

const Dashboard = () => {
    const theme = useTheme();
    const [stats, setStats] = useState({
        userCount: null,
        ticketCount: null,
        serverUptime: null,
        activeUsers: null,
        todayTickets: null,
        responseTime: null
    });
    
    const [loading, setLoading] = useState({
        userCount: true,
        ticketCount: true,
        serverUptime: true,
        activeUsers: true,
        todayTickets: true,
        responseTime: true
    });
    
    const [errors, setErrors] = useState({});
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchUserCount = useCallback(async () => {
        try {
            setLoading(prev => ({ ...prev, userCount: true }));
            setErrors(prev => ({ ...prev, userCount: null }));
            
            const response = await fetch("/api/discord/user-count");
            
            if (!response.ok) {
                throw new Error(`Failed to fetch user count (${response.status})`);
            }
            
            const data = await response.json();
            setStats(prev => ({ ...prev, userCount: data.count }));
        } catch (error) {
            console.error("Error fetching user count:", error);
            setErrors(prev => ({ ...prev, userCount: error.message }));
        } finally {
            setLoading(prev => ({ ...prev, userCount: false }));
        }
    }, []);

    const fetchTicketCount = useCallback(async () => {
        try {
            setLoading(prev => ({ ...prev, ticketCount: true }));
            setErrors(prev => ({ ...prev, ticketCount: null }));
            
            const response = await fetch("/api/tickets/count");
            
            if (!response.ok) {
                throw new Error(`Failed to fetch ticket count (${response.status})`);
            }
            
            const data = await response.json();
            setStats(prev => ({ ...prev, ticketCount: data.count }));
        } catch (error) {
            console.error("Error fetching ticket count:", error);
            setErrors(prev => ({ ...prev, ticketCount: error.message }));
        } finally {
            setLoading(prev => ({ ...prev, ticketCount: false }));
        }
    }, []);

    // Mock data for additional stats (replace with real API calls)
    const fetchAdditionalStats = useCallback(async () => {
        // Simulate API calls
        setTimeout(() => {
            setStats(prev => ({ 
                ...prev, 
                serverUptime: "99.9%",
                activeUsers: Math.floor(Math.random() * 500) + 100,
                todayTickets: Math.floor(Math.random() * 20) + 5,
                responseTime: "120ms"
            }));
            setLoading(prev => ({ 
                ...prev, 
                serverUptime: false,
                activeUsers: false,
                todayTickets: false,
                responseTime: false
            }));
        }, 1000);
    }, []);

    const refreshData = useCallback(() => {
        fetchUserCount();
        fetchTicketCount();
        fetchAdditionalStats();
        setLastUpdated(new Date());
    }, [fetchUserCount, fetchTicketCount, fetchAdditionalStats]);

    useEffect(() => {
        refreshData();
        // Auto-refresh every 5 minutes
        const interval = setInterval(refreshData, 300000);
        return () => clearInterval(interval);
    }, [refreshData]);

    const StatCard = ({ 
        title, 
        value, 
        loading, 
        error, 
        icon: IconComponent, 
        color = "primary", 
        trend = null,
        subtitle = null,
        delay = 0
    }) => (
        <Grow in={true} timeout={500 + delay * 100}>
            <Card 
                sx={{ 
                    minHeight: 180,
                    background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.1)}, ${alpha(theme.palette[color].main, 0.05)})`,
                    border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0 12px 24px ${alpha(theme.palette[color].main, 0.3)}`,
                        '& .stat-icon': {
                            transform: 'scale(1.1) rotate(5deg)',
                        }
                    },
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: `linear-gradient(90deg, ${theme.palette[color].main}, ${theme.palette[color].light})`,
                    }
                }}
            >
                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ 
                            p: 1.5, 
                            borderRadius: 2, 
                            background: `linear-gradient(135deg, ${theme.palette[color].main}, ${theme.palette[color].dark})`,
                            color: theme.palette[color].contrastText,
                            transition: 'transform 0.3s ease',
                            boxShadow: `0 4px 12px ${alpha(theme.palette[color].main, 0.3)}`
                        }} className="stat-icon">
                            <IconComponent style={{ fontSize: 24 }} />
                        </Box>
                        {trend && (
                            <Chip 
                                label={trend}
                                size="small"
                                color={trend.startsWith('+') ? 'success' : 'error'}
                                sx={{ fontWeight: 600 }}
                            />
                        )}
                    </Box>
                    
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                        {title}
                    </Typography>
                    
                    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        {loading ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <LinearProgress 
                                    sx={{ 
                                        borderRadius: 1,
                                        backgroundColor: alpha(theme.palette[color].main, 0.1),
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: theme.palette[color].main
                                        }
                                    }} 
                                />
                                <Typography variant="body2" color="text.secondary">
                                    Loading...
                                </Typography>
                            </Box>
                        ) : error ? (
                            <Alert 
                                severity="error" 
                                size="small"
                                sx={{ 
                                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                                    border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`
                                }}
                            >
                                {error}
                            </Alert>
                        ) : (
                            <Box>
                                <Typography 
                                    variant="h3" 
                                    component="div" 
                                    color={`${color}.main`} 
                                    sx={{ 
                                        fontWeight: 700,
                                        background: `linear-gradient(135deg, ${theme.palette[color].main}, ${theme.palette[color].dark})`,
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        mb: subtitle ? 1 : 0
                                    }}
                                >
                                    {typeof value === 'number' ? value.toLocaleString() : value || '0'}
                                </Typography>
                                {subtitle && (
                                    <Typography variant="body2" color="text.secondary">
                                        {subtitle}
                                    </Typography>
                                )}
                            </Box>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Grow>
    );

    const statsConfig = [
        {
            title: "Total Discord Users",
            value: stats.userCount,
            loading: loading.userCount,
            error: errors.userCount,
            icon: FaUsers,
            color: "primary",
            trend: "+12%",
            subtitle: "Active members"
        },
        {
            title: "Support Tickets",
            value: stats.ticketCount,
            loading: loading.ticketCount,
            error: errors.ticketCount,
            icon: FaTicketAlt,
            color: "secondary",
            trend: "+5%",
            subtitle: "Total resolved"
        },
        {
            title: "Server Uptime",
            value: stats.serverUptime,
            loading: loading.serverUptime,
            error: errors.serverUptime,
            icon: FaServer,
            color: "success",
            subtitle: "Last 30 days"
        },
        {
            title: "Active Users",
            value: stats.activeUsers,
            loading: loading.activeUsers,
            error: errors.activeUsers,
            icon: Timeline,
            color: "info",
            trend: "+8%",
            subtitle: "Online now"
        },
        {
            title: "Today's Tickets",
            value: stats.todayTickets,
            loading: loading.todayTickets,
            error: errors.todayTickets,
            icon: Assessment,
            color: "warning",
            subtitle: "New today"
        },
        {
            title: "Response Time",
            value: stats.responseTime,
            loading: loading.responseTime,
            error: errors.responseTime,
            icon: Speed,
            color: "success",
            subtitle: "Average"
        }
    ];

    return (
        <Box sx={{ 
            p: 4,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)}, ${alpha(theme.palette.secondary.main, 0.02)})`,
            minHeight: '100vh'
        }}>
            {/* Header Section */}
            <Fade in={true} timeout={800}>
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 4,
                    p: 3,
                    background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${alpha(theme.palette.primary.main, 0.05)})`,
                    borderRadius: 3,
                    boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.1)}`,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                }}>
                    <Box>
                        <Typography 
                            variant="h3" 
                            component="h1" 
                            sx={{ 
                                fontWeight: 800,
                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 1
                            }}
                        >
                            Admin Dashboard
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            SCPRPG Discord Bot Management
                        </Typography>
                        {lastUpdated && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Last updated: {lastUpdated.toLocaleTimeString()}
                            </Typography>
                        )}
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Chip
                            icon={<FaShieldAlt />}
                            label="Admin Access"
                            color="primary"
                            variant="outlined"
                            sx={{ fontWeight: 600 }}
                        />
                        <IconButton
                            onClick={refreshData}
                            sx={{
                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                color: 'white',
                                '&:hover': {
                                    background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                                    transform: 'rotate(180deg)',
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <Refresh />
                        </IconButton>
                    </Box>
                </Box>
            </Fade>

            {/* Stats Grid */}
            <Grid container spacing={3}>
                {statsConfig.map((stat, index) => (
                    <Grid item xs={12} sm={6} lg={4} key={stat.title}>
                        <StatCard {...stat} delay={index} />
                    </Grid>
                ))}
            </Grid>

            {/* Error Summary */}
            {Object.values(errors).some(error => error) && (
                <Fade in={true} timeout={600}>
                    <Box sx={{ mt: 4 }}>
                        <Alert 
                            severity="warning"
                            sx={{
                                background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)}, ${alpha(theme.palette.warning.main, 0.05)})`,
                                border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                                borderRadius: 2
                            }}
                            action={
                                <IconButton
                                    size="small"
                                    color="warning"
                                    onClick={refreshData}
                                >
                                    <Refresh />
                                </IconButton>
                            }
                        >
                            <Typography variant="body1" fontWeight={600}>
                                Some data failed to load
                            </Typography>
                            <Typography variant="body2">
                                Check your network connection and try refreshing the data.
                            </Typography>
                        </Alert>
                    </Box>
                </Fade>
            )}

            {/* Quick Actions Section */}
            <Fade in={true} timeout={1000}>
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
                        Quick Actions
                    </Typography>
                    <Grid container spacing={2}>
                        {[
                            { label: "View Tickets", href: "/tickets", color: "primary" },
                            { label: "Server Docs", href: "/docs", color: "secondary" },
                            { label: "User Management", href: "/users", color: "info" },
                            { label: "Bot Settings", href: "/settings", color: "warning" }
                        ].map((action, index) => (
                            <Grid item xs={12} sm={6} md={3} key={action.label}>
                                <Grow in={true} timeout={800 + index * 100}>
                                    <Card
                                        component="a"
                                        href={action.href}
                                        sx={{
                                            p: 2,
                                            textDecoration: 'none',
                                            background: `linear-gradient(135deg, ${alpha(theme.palette[action.color].main, 0.1)}, ${alpha(theme.palette[action.color].main, 0.05)})`,
                                            border: `1px solid ${alpha(theme.palette[action.color].main, 0.2)}`,
                                            transition: 'all 0.3s ease',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: `0 8px 16px ${alpha(theme.palette[action.color].main, 0.3)}`
                                            }
                                        }}
                                    >
                                        <Typography 
                                            variant="body1" 
                                            fontWeight={600}
                                            color={`${action.color}.main`}
                                            textAlign="center"
                                        >
                                            {action.label}
                                        </Typography>
                                    </Card>
                                </Grow>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Fade>
        </Box>
    );
};

export default Dashboard;