import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  LinearProgress,
  Chip,
  Button,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { useNavbar } from '../addons/navbar';
import ApiService from '../services/ApiService';

const Dashboard = () => {
  const { setOption, setSidebarLeftDisabled, setSidebarRightDisabled } = useNavbar();
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    closedTickets: 0,
    averageResolutionTime: 0,
  });
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setOption('dashboard');
    setSidebarLeftDisabled(false);
    setSidebarRightDisabled(true);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const tickets = await ApiService.getTickets();
      
      const total = tickets?.length || 0;
      const open = tickets?.filter(t => t.status === 2)?.length || 0;
      const closed = tickets?.filter(t => t.status === 0)?.length || 0;

      setStats({
        totalTickets: total,
        openTickets: open,
        closedTickets: closed,
        averageResolutionTime: 24,
      });

      setRecentTickets(tickets?.slice(0, 5) || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, trend, color }) => (
    <Card sx={{
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: 3,
      height: '100%',
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{
            p: 1.5,
            borderRadius: 2,
            background: `${color}20`,
            color: color,
            mr: 2,
          }}>
            <Icon />
          </Box>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ color: '#fff', mb: 1, fontWeight: 700 }}>
          {value}
        </Typography>
        {trend && (
          <Chip
            icon={<TrendingUpIcon />}
            label={`${trend}% from last week`}
            size="small"
            sx={{
              background: 'rgba(76, 175, 80, 0.2)',
              color: '#4CAF50',
            }}
          />
        )}
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
        <Typography variant="h3" sx={{
          color: '#fff',
          mb: 4,
          fontWeight: 700,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Dashboard
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Loading dashboard...
            </Typography>
          </Box>
        ) : (
          <>
            {/* Stats Grid */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  icon={AssignmentIcon}
                  title="Total Tickets"
                  value={stats.totalTickets}
                  color="#667eea"
                  trend={12}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  icon={ScheduleIcon}
                  title="Open Tickets"
                  value={stats.openTickets}
                  color="#f093fb"
                  trend={5}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  icon={CheckCircleIcon}
                  title="Closed Tickets"
                  value={stats.closedTickets}
                  color="#4CAF50"
                  trend={8}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  icon={TrendingUpIcon}
                  title="Avg Resolution"
                  value={`${stats.averageResolutionTime}h`}
                  color="#4facfe"
                />
              </Grid>
            </Grid>

            {/* Recent Tickets */}
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 3,
            }}>
              <CardContent>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                }}>
                  <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>
                    Recent Tickets
                  </Typography>
                  <Button
                    href="/tickets"
                    sx={{
                      color: '#667eea',
                      textTransform: 'none',
                    }}
                  >
                    View All
                  </Button>
                </Box>

                {recentTickets.length > 0 ? (
                  <Box>
                    {recentTickets.map((ticket, idx) => (
                      <Box key={idx} sx={{
                        py: 2,
                        borderBottom: idx < recentTickets.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ color: '#fff', fontWeight: 500 }}>
                            Ticket #{ticket.ticketNumber}
                          </Typography>
                          <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.875rem' }}>
                            {ticket.createdAt}
                          </Typography>
                        </Box>
                        <Chip
                          label={
                            ticket.status === 0 ? 'Closed' :
                              ticket.status === 1 ? 'Claimed' : 'Open'
                          }
                          size="small"
                          sx={{
                            background:
                              ticket.status === 0 ? 'rgba(76, 175, 80, 0.2)' :
                                ticket.status === 1 ? 'rgba(255, 152, 0, 0.2)' :
                                  'rgba(244, 67, 54, 0.2)',
                            color:
                              ticket.status === 0 ? '#4CAF50' :
                                ticket.status === 1 ? '#FF9800' : '#F44336',
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', py: 3, textAlign: 'center' }}>
                    No tickets yet
                  </Typography>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;
