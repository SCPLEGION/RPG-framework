import React, { useEffect } from "react";
import { useNavbar } from "../addons/navbar";
import { Button, Typography, Box, Container, Grid, Paper } from "@mui/material";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import ExploreIcon from "@mui/icons-material/Explore";
import GroupIcon from "@mui/icons-material/Group";

export default function AboutPage() {
  const { setOption, setMiddleContent } = useNavbar();

  useEffect(() => {
    setOption("about");
    setMiddleContent([
      <Button color="primary" variant="contained" href="https://github.com/SCPRPG-discord-bot" target="_blank" key="github">
        View on GitHub
      </Button>
    ]);
  }, [setOption, setMiddleContent]);

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #232526 0%, #414345 100%)" }}>
      <Container maxWidth="md">
        <Paper elevation={6} sx={{ p: 5, background: "rgba(30,30,30,0.95)" }}>
          <Typography variant="h2" align="center" gutterBottom sx={{ color: "#fff", fontWeight: 700 }}>
            SCP RPG Discord Bot
          </Typography>
          <Typography variant="h5" align="center" gutterBottom sx={{ color: "#bdbdbd" }}>
            A feature-rich, community-driven RPG experience for your Discord server.
          </Typography>
          <Box display="flex" justifyContent="center" my={4}>
            <Button
              color="secondary"
              variant="contained"
              size="large"
              href="https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&scope=bot"
              sx={{ mr: 2 }}
            >
              Invite to Discord
            </Button>
            <Button
              color="primary"
              variant="outlined"
              size="large"
              href="https://github.com/SCPRPG-discord-bot"
              target="_blank"
            >
              GitHub Repo
            </Button>
          </Box>
          <Grid container spacing={4} mt={2}>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <EmojiEmotionsIcon sx={{ fontSize: 50, color: "#ffb300" }} />
                <Typography variant="h6" sx={{ color: "#fff", mt: 1 }}>
                  Fun & Engaging
                </Typography>
                <Typography sx={{ color: "#bdbdbd" }}>
                  Enjoy unique SCP-themed adventures, quests, and roleplay events.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <ExploreIcon sx={{ fontSize: 50, color: "#29b6f6" }} />
                <Typography variant="h6" sx={{ color: "#fff", mt: 1 }}>
                  Explore & Discover
                </Typography>
                <Typography sx={{ color: "#bdbdbd" }}>
                  Unlock new SCPs, locations, and secrets as you progress.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <GroupIcon sx={{ fontSize: 50, color: "#66bb6a" }} />
                <Typography variant="h6" sx={{ color: "#fff", mt: 1 }}>
                  Community Driven
                </Typography>
                <Typography sx={{ color: "#bdbdbd" }}>
                  Join a growing community and contribute your ideas and feedback.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}