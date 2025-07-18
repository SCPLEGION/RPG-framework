import React, { useState, useRef } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Stack,
  CircularProgress,
  TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Generate roulette numbers
const numbers = [
  { number: '0', color: 'green' },
  { number: '00', color: 'green' },
  ...Array.from({ length: 36 }, (_, i) => ({
    number: (i + 1).toString(),
    color: (i + 1) % 2 === 0 ? 'black' : 'red',
  })),
];

const payoutTable = {
  red: 2,
  black: 2,
  green: 17,
  number: 35,
};

export default function Roulette() {
  const navigate = useNavigate();
  const wheelRef = useRef(null);

  const [money, setMoney] = useState(1000);
  const [bet, setBet] = useState(0);
  const [selectedBet, setSelectedBet] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);

  const handleSpin = () => {
    if (spinning || bet <= 0 || bet > money || !selectedBet) {
      alert('Please place a valid bet and select an option!');
      return;
    }

    setSpinning(true);
    setResult(null);

    const resultIndex = Math.floor(Math.random() * numbers.length);
    const spinDegrees = 360 * 5 + (360 / numbers.length) * resultIndex;

    wheelRef.current.style.transition = 'transform 5s cubic-bezier(0.25, 1, 0.5, 1)';
    wheelRef.current.style.transform = `rotate(-${spinDegrees}deg)`;

    setTimeout(() => {
      const spinResult = numbers[resultIndex];
      setResult(spinResult);
      setSpinning(false);

      const winCondition =
        (selectedBet === spinResult.color) || (selectedBet === spinResult.number);

      if (winCondition) {
        const payout =
          selectedBet === 'red' || selectedBet === 'black'
            ? payoutTable[selectedBet]
            : selectedBet === 'green'
            ? payoutTable.green
            : payoutTable.number;

        setMoney((prev) => prev + bet * payout);
      } else {
        setMoney((prev) => prev - bet);
      }
    }, 5000);
  };

  const handleBetSelect = (betOption) => {
    setSelectedBet((prev) => (prev === betOption ? null : betOption));
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Roulette Game
          </Typography>
          <Button color="inherit" onClick={() => navigate('/')}>
            Back to Menu
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 5, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>🎰 Roulette</Typography>
        <Typography variant="h6">Money: ${money}</Typography>

        <Box my={3}>
          <Typography variant="h6" gutterBottom>Place Your Bet</Typography>
          <TextField
            type="number"
            value={bet}
            onChange={(e) => setBet(Math.max(0, Math.min(Number(e.target.value), money)))}
            inputProps={{ min: 1, max: money }}
            size="small"
            sx={{ width: 120 }}
          />
        </Box>

        {/* Roulette Wheel */}
        <Box
          sx={{
            position: 'relative',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            border: '10px solid #ccc',
            margin: '0 auto',
            overflow: 'hidden',
            boxShadow: '0 0 20px rgba(0,0,0,0.3)',
          }}
        >
          <Box ref={wheelRef}
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              transform: 'rotate(0deg)',
              transition: spinning ? 'transform 5s cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
            }}
          >
            {numbers.map((item, i) => {
              const deg = 360 / numbers.length;
              return (
                <Box
                  key={i}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    transform: `rotate(${deg * i}deg)`,
                    transformOrigin: '50% 50%',
                  }}
                >
                  {/* Segment shape */}
                  <Box
                    sx={{
                      position: 'absolute',
                      width: '50%',
                      height: '100%',
                      backgroundColor: item.color,
                      clipPath: 'polygon(100% 50%, 0% 0%, 0% 100%)',
                      transformOrigin: '100% 50%',
                    }}
                  />
        
                  {/* Number label */}
                  <Typography
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: `rotate(${360 - deg * i}deg) translate(70px)`,
                      transformOrigin: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: '#fff',
                    }}
                  >
                    {item.number}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        
          {/* Pointer */}
          <Box
            sx={{
              position: 'absolute',
              top: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderBottom: '20px solid red',
              zIndex: 10,
            }}
          />
        </Box>

        {/* Color Bets */}
        <Stack direction="row" justifyContent="center" spacing={2} mt={4}>
          {['red', 'black', 'green'].map((color) => (
            <Button
              key={color}
              variant={selectedBet === color ? 'contained' : 'outlined'}
              onClick={() => handleBetSelect(color)}
              sx={{
                backgroundColor: selectedBet === color ? color : 'transparent',
                color: '#fff',
                borderColor: color,
                '&:hover': { backgroundColor: color },
              }}
            >
              {color.charAt(0).toUpperCase() + color.slice(1)}
            </Button>
          ))}
        </Stack>

        {/* Number Bets */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 1,
            mt: 4,
          }}
        >
          {numbers.map((item) => (
            <Button
              key={item.number}
              variant={selectedBet === item.number ? 'contained' : 'outlined'}
              onClick={() => handleBetSelect(item.number)}
              sx={{
                backgroundColor: item.color,
                color: '#fff',
                fontWeight: 'bold',
                '&:hover': { backgroundColor: item.color },
              }}
            >
              {item.number}
            </Button>
          ))}
        </Box>

        {/* Controls */}
        <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 4 }}>
          <Button variant="contained" onClick={handleSpin} disabled={spinning}>
            {spinning ? <CircularProgress size={24} color="inherit" /> : 'Spin'}
          </Button>
          <Button variant="outlined" onClick={() => navigate('/')}>
            Back to Menu
          </Button>
        </Stack>

        {/* Result */}
        {result && (
          <Typography variant="h6" sx={{ mt: 3 }}>
            🎉 The wheel landed on{' '}
            <strong style={{ color: result.color }}>{result.number}</strong>!
          </Typography>
        )}
      </Container>
    </>
  );
}