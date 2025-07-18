import React, { useEffect, useState } from "react";
import { useNavbar } from "../addons/navbar";
import { Button, Typography, Box, Container, Grid, Paper, Card, CardContent, Chip } from "@mui/material";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import ExploreIcon from "@mui/icons-material/Explore";
import GroupIcon from "@mui/icons-material/Group";
import SecurityIcon from "@mui/icons-material/Security";
import GamepadIcon from "@mui/icons-material/Gamepad";
import StarIcon from "@mui/icons-material/Star";

export default function AboutPage() {
  const { setOption, setMiddleContent } = useNavbar();
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    setOption("home");
    setMiddleContent([
      <Button color="primary" variant="contained" href="https://github.com/SCPLEGION/SCPRPG-discord-bot" target="_blank" key="github">
        View on GitHub
      </Button>,
      <Button color="secondary" variant="contained" href="/tickets" key="tickets" sx={{ ml: 2 }}>
        Ticket Viewer
      </Button>
    ]);
  }, [setOption, setMiddleContent]);

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
    { icon: <StarIcon />, text: "Premium Experience" }
  ];

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
                A feature-rich, community-driven RPG experience for your Discord server.
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
              <Grid size={{ xs: 12, md: 4 }} key={index}>
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

          {/* Additional Info Section */}
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
            style={{ animationDelay: "0.8s" }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                color: "#fff", 
                mb: 2,
                fontWeight: 600,
                background: "linear-gradient(45deg, #7289da 30%, #99aab5 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              Ready to Start Your Adventure?
            </Typography>
            <Typography 
              sx={{ 
                color: "#bdbdbd", 
                mb: 3,
                fontSize: "1.1rem"
              }}
            >
              Join thousands of Discord servers already using SCP RPG Bot for immersive roleplay experiences.
            </Typography>
            <Button
              variant="contained"
              size="large"
              href="https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&scope=bot"
              sx={{ 
                background: "linear-gradient(45deg, #7289da 30%, #99aab5 90%)",
                px: 6,
                py: 1.5,
                fontSize: "1.2rem",
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
              Get Started Now
            </Button>
          </Paper>
        </Container>
      </Box>
    </>
  );
}