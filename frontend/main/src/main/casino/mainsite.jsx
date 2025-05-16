import React from 'react';
import { Typography, Button, Container, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function GameSelector() {
  const navigate = useNavigate();

  return (
    <Container sx={{ mt: 10, textAlign: 'center' }}>
      <Typography variant="h3" gutterBottom>🎮 Mini Game Arcade</Typography>
      <Typography variant="h6" gutterBottom>Select a game to play:</Typography>
      <Stack spacing={2} direction="column" alignItems="center" sx={{ mt: 4 }}>
        <Button variant="contained" size="large" onClick={() => navigate('/casino/blackjack')}>
          🃏 Blackjack
        </Button>
        <Button variant="contained" size="large" onClick={() => navigate('/casino/roulette')}>
  🎰 Roulette
</Button>

        {/* Add more games here later */}
      </Stack>
    </Container>
  );
}
