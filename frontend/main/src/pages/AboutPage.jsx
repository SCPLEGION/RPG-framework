import React, { useEffect, useState } from "react";
import { useNavbar } from "../addons/navbar";
import {
  Button,
  Typography,
  Box,
  Container,
  Grid,
  Paper,
  Card,
  CardContent,
  Chip,
  Avatar
} from "@mui/material";
import {
  EmojiEmotions as EmojiEmotionsIcon,
  Explore as ExploreIcon,
  Group as GroupIcon,
  Security as SecurityIcon,
  Gamepad as GamepadIcon,
  Star as StarIcon,
  AttachMoney as AttachMoneyIcon,
  Storefront as StorefrontIcon,
  AssignmentTurnedIn as QuestIcon,
  RocketLaunch as RocketLaunchIcon,
  TrendingUp as TrendingUpIcon
} from "@mui/icons-material";

const features = [
  {
    icon: <EmojiEmotionsIcon sx={{ fontSize: 48 }} />,
    title: "Fun & Engaging",
    description: "Epic quests, dungeon raids, and adventures in a magical world.",
    color: "#FFB800"
  },
  {
    icon: <ExploreIcon sx={{ fontSize: 48 }} />,
    title: "Explore & Discover",
    description: "Unlock new islands, biomes, and rare treasures as you play.",
    color: "#00D9FF"
  },
  {
    icon: <GroupIcon sx={{ fontSize: 48 }} />,
    title: "Community Driven",
    description: "Team up with friends and join events to shape the game world.",
    color: "#00FF88"
  }
];

const highlights = [
  { icon: <SecurityIcon />, text: "Safe & Stable Servers" },
  { icon: <GamepadIcon />, text: "Immersive Gameplay" },
  { icon: <StarIcon />, text: "Exclusive Rewards" },
  { icon: <AttachMoneyIcon />, text: "Optional Premium Features" }
];

const roadmap = [
  {
    quarter: "Q3 2025",
    icon: <RocketLaunchIcon sx={{ fontSize: 40 }} />,
    items: ["New islands and dungeons", "Pet & mount system", "Mobile companion app launch"]
  },
  {
    quarter: "Q4 2025",
    icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
    items: ["Seasonal events and tournaments", "Custom player shops", "Multiplayer raids and guilds"]
  }
];

const team = [
  { name: "Jacek Adamiec", role: "Lead Developer", id: "552543606012117012" },
  { name: "Anna Kowalska", role: "Community Manager", id: "1307413861065953341" }
];

const FeatureCard = ({ feature, hovered, onHover }) => (
  <Card
    elevation={0}
    sx={{
      background: hovered ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.03)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      borderRadius: 3,
      height: "100%",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      cursor: "pointer",
      "&:hover": { transform: "translateY(-8px)" }
    }}
    onMouseEnter={onHover}
    onMouseLeave={onHover}
  >
    <CardContent sx={{ p: 4, textAlign: "center" }}>
      <Box
        sx={{
          width: 70,
          height: 70,
          borderRadius: 2,
          background: `linear-gradient(135deg, ${feature.color}20, ${feature.color}40)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: feature.color,
          mb: 3,
          mx: "auto",
          transform: hovered ? "scale(1.1)" : "scale(1)",
          transition: "transform 0.3s ease"
        }}
      >
        {feature.icon}
      </Box>
      <Typography variant="h5" sx={{ color: "#fff", mb: 2, fontWeight: 700 }}>
        {feature.title}
      </Typography>
      <Typography sx={{ color: "rgba(255, 255, 255, 0.6)", lineHeight: 1.7 }}>
        {feature.description}
      </Typography>
    </CardContent>
  </Card>
);

export default function AboutPage() {
  const { setOption, setSidebarLeftDisabled, setSidebarRightDisabled } = useNavbar();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [stats] = useState({
    servers: 1245,
    activeUsers: 76500,
    questsCompleted: 9823,
    shopsCreated: 245
  });

  useEffect(() => {
    setOption("home");
    setSidebarLeftDisabled(true);
    setSidebarRightDisabled(true);
  }, [setOption, setSidebarLeftDisabled, setSidebarRightDisabled]);

  const getAvatarUrl = (id) =>
    `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/user/avatar/${id}`;

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1419 100%)" }}>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Hero */}
        <Box sx={{ textAlign: "center", mb: 10 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.5rem", md: "4.5rem" },
              fontWeight: 800,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2,
              letterSpacing: "-0.02em"
            }}
          >
            SCP RPG Discord Bot
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              mb: 4,
              fontWeight: 400,
              maxWidth: "700px",
              mx: "auto",
              lineHeight: 1.6
            }}
          >
            A complete premium solution: Discord bot, Minecraft mod with economy, NPC shops, and immersive quests.
          </Typography>

          <Box sx={{ mb: 5, display: "flex", gap: 1, justifyContent: "center", flexWrap: "wrap" }}>
            {highlights.map((highlight, index) => (
              <Chip
                key={index}
                icon={highlight.icon}
                label={highlight.text}
                sx={{
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#fff",
                  fontWeight: 500,
                  py: 2.5,
                  px: 1,
                  "& .MuiChip-icon": { color: "#667eea" },
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "rgba(102, 126, 234, 0.1)",
                    transform: "translateY(-2px)"
                  }
                }}
              />
            ))}
          </Box>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              variant="contained"
              size="large"
              href="https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&scope=bot"
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                px: 5,
                py: 1.8,
                fontSize: "1rem",
                fontWeight: 600,
                borderRadius: 2,
                textTransform: "none",
                boxShadow: "0 10px 40px rgba(102, 126, 234, 0.4)",
                "&:hover": {
                  boxShadow: "0 15px 50px rgba(102, 126, 234, 0.5)",
                  transform: "translateY(-2px)"
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
                borderColor: "rgba(255, 255, 255, 0.2)",
                color: "#fff",
                px: 5,
                py: 1.8,
                fontSize: "1rem",
                fontWeight: 600,
                borderRadius: 2,
                textTransform: "none",
                borderWidth: 2,
                "&:hover": {
                  borderColor: "#667eea",
                  background: "rgba(102, 126, 234, 0.1)",
                  transform: "translateY(-2px)"
                }
              }}
            >
              View on GitHub
            </Button>
          </Box>
        </Box>

        {/* Features */}
        <Grid container spacing={3} sx={{ mb: 8 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <FeatureCard
                feature={feature}
                hovered={hoveredCard === index}
                onHover={() => setHoveredCard(hoveredCard === index ? null : index)}
              />
            </Grid>
          ))}
        </Grid>

        {/* Stats */}
        <Paper elevation={0} sx={{ mb: 8, p: 5, background: "rgba(255, 255, 255, 0.03)", backdropFilter: "blur(20px)", borderRadius: 3, border: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <Typography variant="h4" sx={{ color: "#fff", mb: 5, fontWeight: 700, textAlign: "center" }}>Live Statistics</Typography>
          <Grid container justifyContent="space-evenly" alignItems="center">
            {[
              { icon: <AttachMoneyIcon sx={{ fontSize: 40 }} />, value: stats.servers, label: "Active Servers", color: "#667eea" },
              { icon: <GroupIcon sx={{ fontSize: 40 }} />, value: stats.activeUsers, label: "Active Users", color: "#764ba2" },
              { icon: <QuestIcon sx={{ fontSize: 40 }} />, value: stats.questsCompleted, label: "Quests Completed", color: "#f093fb" },
              { icon: <StorefrontIcon sx={{ fontSize: 40 }} />, value: stats.shopsCreated, label: "NPC Shops", color: "#4facfe" }
            ].map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box sx={{ textAlign: "center" }}>
                  <Box sx={{ color: stat.color, mb: 1 }}>{stat.icon}</Box>
                  <Typography variant="h4" sx={{ color: "#fff", fontWeight: 700, mb: 0.5 }}>{stat.value.toLocaleString()}</Typography>
                  <Typography sx={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "0.875rem" }}>{stat.label}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Roadmap */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" sx={{ color: "#fff", mb: 4, fontWeight: 700, textAlign: "center" }}>Roadmap</Typography>
          <Grid container spacing={4} justifyContent="center">
            {roadmap.map((phase, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Paper sx={{ p: 4, background: "rgba(255, 255, 255, 0.03)", backdropFilter: "blur(20px)", borderRadius: 3, border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3, color: "#667eea" }}>
                    {phase.icon}
                    <Typography variant="h5" sx={{ color: "#fff", fontWeight: 700, ml: 2 }}>{phase.quarter}</Typography>
                  </Box>
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    {phase.items.map((item, i) => (
                      <Typography key={i} component="li" sx={{ color: "rgba(255, 255, 255, 0.7)", mb: 1.5, lineHeight: 1.6 }}>{item}</Typography>
                    ))}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Team */}
        <Paper sx={{ p: 5, background: "rgba(255, 255, 255, 0.03)", backdropFilter: "blur(20px)", borderRadius: 3, border: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <Typography variant="h4" sx={{ color: "#fff", mb: 5, fontWeight: 700, textAlign: "center" }}>Meet the Team</Typography>
          <Grid container spacing={4} justifyContent="center">
            {team.map((member, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box sx={{ textAlign: "center" }}>
                  <Avatar
                    src={getAvatarUrl(member.id)}
                    alt={member.name}
                    sx={{ width: 100, height: 100, mx: "auto", mb: 2, border: "3px solid #667eea" }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = member.id === "552543606012117012"
                        ? "https://cdn.discordapp.com/avatars/552543606012117012/5ef357cc4bbad906682b65a469d75be4.webp"
                        : "https://cdn.discordapp.com/embed/avatars/0.png";
                    }}
                  />
                  <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700, mb: 0.5 }}>{member.name}</Typography>
                  <Typography sx={{ color: "rgba(255, 255, 255, 0.5)" }}>{member.role}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
