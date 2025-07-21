import React, { useEffect, useState } from "react";
import { useNavbar } from "../addons/navbar";
import { Button, Typography, Box, Container, Grid, Paper, Card, CardContent, Chip, Divider, Avatar, List, ListItem, ListItemAvatar, ListItemText, LinearProgress } from "@mui/material";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import ExploreIcon from "@mui/icons-material/Explore";
import GroupIcon from "@mui/icons-material/Group";
import SecurityIcon from "@mui/icons-material/Security";
import GamepadIcon from "@mui/icons-material/Gamepad";
import StarIcon from "@mui/icons-material/Star";
import BugReportIcon from "@mui/icons-material/BugReport";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import FeedbackIcon from "@mui/icons-material/Feedback";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StorefrontIcon from '@mui/icons-material/Storefront';
import QuestIcon from '@mui/icons-material/AssignmentTurnedIn';

export default function AboutPage() {
  const { setOption, setSidebarLeftDisabled, setSidebarRightDisabled } = useNavbar();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [stats, setStats] = useState({
    servers: 1245,
    activeUsers: 76500,
    questsCompleted: 9823,
    shopsCreated: 245
  });

  useEffect(() => {
    setOption("home");
    setSidebarLeftDisabled(true);
    setSidebarRightDisabled(true);

    // Simulate fetching live stats from backend API
    // Example: fetch("/api/stats").then(res => res.json()).then(setStats);
  }, [setOption, setSidebarLeftDisabled, setSidebarRightDisabled]);

  const features = [
    {
      icon: <EmojiEmotionsIcon sx={{ fontSize: 60 }} />,
      title: "Fun & Engaging",
      description: "Enjoy unique SCP-themed adventures, quests, and roleplay events.",
      color: "#ffb300",
      gradient: "linear-gradient(135deg, #ffb300 0%, #ff8f00 100%)"
    },
    {
      icon: <ExploreIcon sx={{ fontSize: 60 }} />,
      title: "Explore & Discover",
      description: "Unlock new SCPs, locations, and secrets as you progress.",
      color: "#29b6f6",
      gradient: "linear-gradient(135deg, #29b6f6 0%, #1976d2 100%)"
    },
    {
      icon: <GroupIcon sx={{ fontSize: 60 }} />,
      title: "Community Driven",
      description: "Join a growing community and contribute your ideas and feedback.",
      color: "#66bb6a",
      gradient: "linear-gradient(135deg, #66bb6a 0%, #388e3c 100%)"
    }
  ];

  const highlights = [
    { icon: <SecurityIcon />, text: "Secure & Reliable" },
    { icon: <GamepadIcon />, text: "Interactive Gaming" },
    { icon: <StarIcon />, text: "Premium Experience" },
    { icon: <AttachMoneyIcon />, text: "Premium Paid Service" }
  ];

  const roadmap = [
    {
      title: "Q3 2025",
      points: [
        "Implement new SCP characters and story arcs",
        "Enhance bot AI for smarter NPC interactions",
        "Launch mobile companion app"
      ]
    },
    {
      title: "Q4 2025",
      points: [
        "Add voice commands support",
        "Integrate user-created content submission system",
        "Expand multiplayer events and raids"
      ]
    }
  ];

  // Only store user IDs, not full URLs
  const team = [
    { name: "Jacek Adamiec", role: "Lead Developer", id: "552543606012117012" },
    { name: "Anna Kowalska", role: "Community Manager", id: "1307413861065953341" },
  ];

  // Helper to build avatar URL based on current host/port
  const getAvatarUrl = (id) => {
    return `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/user/avatar/${id}`;
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          .animated-bg {
            background: linear-gradient(-45deg, #232526, #414345, #2c3e50, #34495e);
            background-size: 400% 400%;
            animation: gradientShift 15s ease infinite;
          }
          .fade-in-up {
            animation: fadeInUp 0.8s ease-out;
          }
          .float-animation {
            animation: float 3s ease-in-out infinite;
          }
          .pulse-animation {
            animation: pulse 2s ease-in-out infinite;
          }
        `}
      </style>
      <Box sx={{ minHeight: "100vh" }} className="animated-bg">
        <Container maxWidth="lg" sx={{ pt: 8, pb: 8 }}>
          {/* Hero Section */}
          <Paper
            elevation={12}
            sx={{
              p: 6,
              background: "rgba(30,30,30,0.95)",
              borderRadius: 4,
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.1)",
              mb: 6
            }}
            className="fade-in-up"
          >
            <Box textAlign="center">
              <Typography
                variant="h1"
                sx={{
                  background: "linear-gradient(45deg, #7289da 30%, #99aab5 90%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: 900,
                  fontSize: { xs: "2.5rem", md: "4rem" },
                  mb: 2,
                  letterSpacing: "2px"
                }}
                className="pulse-animation"
              >
                SCP RPG Discord Bot
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  color: "#e0e0e0",
                  mb: 3,
                  fontWeight: 300,
                  fontSize: { xs: "1.2rem", md: "1.8rem" }
                }}
              >
                A complete paid solution: Discord bot, Minecraft mod with money, NPC shops, and quests.
              </Typography>

              <Box sx={{ mb: 4 }}>
                {highlights.map((highlight, index) => (
                  <Chip
                    key={index}
                    icon={highlight.icon}
                    label={highlight.text}
                    sx={{
                      m: 0.5,
                      background: "linear-gradient(45deg, #7289da 30%, #99aab5 90%)",
                      color: "#fff",
                      fontWeight: 600,
                      "& .MuiChip-icon": { color: "#fff" }
                    }}
                    className="float-animation"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  />
                ))}
              </Box>

              <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
                <Button
                  variant="contained"
                  size="large"
                  href="https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&scope=bot"
                  sx={{
                    background: "linear-gradient(45deg, #7289da 30%, #99aab5 90%)",
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    borderRadius: 3,
                    boxShadow: "0 8px 32px rgba(114,137,218,0.3)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 12px 40px rgba(114,137,218,0.4)"
                    }
                  }}
                >
                  Invite to Discord
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  href="https://github.com/SCPLEGION/SCPRPG-discord-bot"
                  target="_blank"
                  sx={{
                    borderColor: "#7289da",
                    color: "#7289da",
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    borderRadius: 3,
                    borderWidth: 2,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "#99aab5",
                      color: "#99aab5",
                      background: "rgba(114,137,218,0.1)",
                      transform: "translateY(-2px)"
                    }
                  }}
                >
                  GitHub Repo
                </Button>
              </Box>
            </Box>
          </Paper>

          {/* Features Section */}
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  elevation={8}
                  sx={{
                    background: hoveredCard === index
                      ? `linear-gradient(135deg, rgba(30,30,30,0.98) 0%, rgba(50,50,50,0.98) 100%)`
                      : "rgba(30,30,30,0.95)",
                    backdropFilter: "blur(10px)",
                    border: hoveredCard === index
                      ? `2px solid ${feature.color}`
                      : "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 3,
                    height: "100%",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    cursor: "pointer",
                    transform: hoveredCard === index ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
                    boxShadow: hoveredCard === index
                      ? `0 20px 40px rgba(${feature.color === "#ffb300" ? "255,179,0" : feature.color === "#29b6f6" ? "41,182,246" : "102,187,106"},0.3)`
                      : "0 8px 32px rgba(0,0,0,0.2)"
                  }}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="fade-in-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <CardContent sx={{ p: 4, textAlign: "center", height: "100%" }}>
                    <Box
                      sx={{
                        background: feature.gradient,
                        borderRadius: "50%",
                        width: 80,
                        height: 80,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 20px",
                        color: "#fff",
                        transition: "transform 0.3s ease",
                        transform: hoveredCard === index ? "scale(1.1) rotate(5deg)" : "scale(1) rotate(0deg)"
                      }}
                    >
                      {feature.icon}
                    </Box>

                    <Typography
                      variant="h5"
                      sx={{
                        color: "#fff",
                        mb: 2,
                        fontWeight: 700,
                        background: hoveredCard === index ? feature.gradient : "none",
                        WebkitBackgroundClip: hoveredCard === index ? "text" : "none",
                        WebkitTextFillColor: hoveredCard === index ? "transparent" : "#fff",
                        transition: "all 0.3s ease"
                      }}
                    >
                      {feature.title}
                    </Typography>

                    <Typography
                      sx={{
                        color: "#bdbdbd",
                        lineHeight: 1.6,
                        fontSize: "1rem"
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Stats Section */}
          <Paper
            elevation={8}
            sx={{
              mt: 6,
              p: 4,
              background: "rgba(30,30,30,0.95)",
              borderRadius: 3,
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            className="fade-in-up"
            style={{ animationDelay: "1s" }}
          >
            <Typography
              variant="h4"
              sx={{
                color: "#fff",
                mb: 4,
                fontWeight: 600,
                background: "linear-gradient(45deg, #7289da 30%, #99aab5 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textAlign: "center"
              }}
            >
              Live Statistics
            </Typography>
            <Grid container spacing={4} justifyContent="center" textAlign="center">
              <Grid item xs={6} sm={3}>
                <AttachMoneyIcon sx={{ fontSize: 50, color: "#7289da", mb: 1 }} />
                <Typography variant="h5" sx={{ color: "#fff", fontWeight: 700 }}>{stats.servers.toLocaleString()}</Typography>
                <Typography variant="body2" sx={{ color: "#bdbdbd" }}>Active Servers</Typography>
                <LinearProgress variant="determinate" value={(stats.servers / 2000) * 100} sx={{ mt: 1, bgcolor: "#444" }} />
              </Grid>
              <Grid item xs={6} sm={3}>
                <GroupIcon sx={{ fontSize: 50, color: "#7289da", mb: 1 }} />
                <Typography variant="h5" sx={{ color: "#fff", fontWeight: 700 }}>{stats.activeUsers.toLocaleString()}</Typography>
                <Typography variant="body2" sx={{ color: "#bdbdbd" }}>Active Users</Typography>
                <LinearProgress variant="determinate" value={(stats.activeUsers / 100000) * 100} sx={{ mt: 1, bgcolor: "#444" }} />
              </Grid>
              <Grid item xs={6} sm={3}>
                <QuestIcon sx={{ fontSize: 50, color: "#7289da", mb: 1 }} />
                <Typography variant="h5" sx={{ color: "#fff", fontWeight: 700 }}>{stats.questsCompleted.toLocaleString()}</Typography>
                <Typography variant="body2" sx={{ color: "#bdbdbd" }}>Quests Completed</Typography>
                <LinearProgress variant="determinate" value={(stats.questsCompleted / 15000) * 100} sx={{ mt: 1, bgcolor: "#444" }} />
              </Grid>
              <Grid item xs={6} sm={3}>
                <StorefrontIcon sx={{ fontSize: 50, color: "#7289da", mb: 1 }} />
                <Typography variant="h5" sx={{ color: "#fff", fontWeight: 700 }}>{stats.shopsCreated.toLocaleString()}</Typography>
                <Typography variant="body2" sx={{ color: "#bdbdbd" }}>NPC Shops Created</Typography>
                <LinearProgress variant="determinate" value={(stats.shopsCreated / 500) * 100} sx={{ mt: 1, bgcolor: "#444" }} />
              </Grid>
            </Grid>
          </Paper>

          {/* Roadmap Section */}
          <Paper
            elevation={8}
            sx={{
              mt: 6,
              p: 4,
              background: "rgba(30,30,30,0.95)",
              borderRadius: 3,
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            className="fade-in-up"
            style={{ animationDelay: "1.2s" }}
          >
            <Typography
              variant="h4"
              sx={{
                color: "#fff",
                mb: 3,
                fontWeight: 600,
                background: "linear-gradient(45deg, #7289da 30%, #99aab5 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textAlign: "center"
              }}
            >
              Project Roadmap
            </Typography>
            <Grid container spacing={4}>
              {roadmap.map((phase, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Paper
                    sx={{
                      background: "rgba(40,40,40,0.9)",
                      p: 3,
                      borderRadius: 2,
                      border: "1px solid rgba(255,255,255,0.05)"
                    }}
                  >
                    <Typography variant="h6" sx={{ color: "#99aab5", mb: 2, fontWeight: 600 }}>
                      {phase.title}
                    </Typography>
                    <List dense>
                      {phase.points.map((point, i) => (
                        <ListItem key={i}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: "#7289da" }}>
                              <FlashOnIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText primary={point} sx={{ color: "#bdbdbd" }} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Team Section */}
          <Paper
            elevation={8}
            sx={{
              mt: 6,
              p: 4,
              background: "rgba(30,30,30,0.95)",
              borderRadius: 3,
              border: "1px solid rgba(255,255,255,0.1)",
              textAlign: "center"
            }}
            className="fade-in-up"
            style={{ animationDelay: "1.4s" }}
          >
            <Typography
              variant="h4"
              sx={{
                color: "#fff",
                mb: 4,
                fontWeight: 600,
                background: "linear-gradient(45deg, #7289da 30%, #99aab5 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              Meet the Team
            </Typography>
            <Grid container spacing={4} justifyContent="center">
              {team.map((member, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Paper
                    sx={{
                      p: 3,
                      background: "rgba(40,40,40,0.9)",
                      borderRadius: 3,
                      border: "1px solid rgba(255,255,255,0.05)"
                    }}
                  >
                    <Avatar
                      src={getAvatarUrl(member.id)}
                      alt={member.name}
                      sx={{ width: 100, height: 100, mx: "auto", mb: 2, border: "2px solid #7289da" }}
                      onError={e => {
                        e.target.onerror = null;
                        // Fallback to Discord CDN avatar
                        if (member.id === "552543606012117012") {
                          e.target.src = "https://cdn.discordapp.com/avatars/552543606012117012/5ef357cc4bbad906682b65a469d75be4.webp";
                        } else {
                          e.target.src = `https://cdn.discordapp.com/embed/avatars/0.png`; // generic fallback
                        }
                      }}
                    />
                    <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700 }}>
                      {member.name}
                    </Typography>
                    <Typography sx={{ color: "#bdbdbd", mb: 1 }}>{member.role}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Container>
      </Box>
    </>
  );
}
