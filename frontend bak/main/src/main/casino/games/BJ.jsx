import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, Container, Stack, Paper, Grow } from '@mui/material';
import { keyframes } from '@emotion/react';

const createDeck = () => {
  const suits = ['♠', '♥', '♦', '♣'];
  const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const deck = [];
  for (let suit of suits) {
    for (let rank of ranks) {
      deck.push({ suit, rank });
    }
  }
  return deck.sort(() => Math.random() - 0.5); // shuffle
};

const cardValue = (card) => {
  if (!card) return 0; // Safeguard against undefined card
  if (['J', 'Q', 'K'].includes(card.rank)) return 10;
  if (card.rank === 'A') return 11;
  return parseInt(card.rank) || 0; // Default to 0 if rank is invalid
};

const calculateScore = (hand) => {
  let score = 0;
  let aces = 0;
  for (let card of hand) {
    score += cardValue(card);
    if (card.rank === 'A') aces += 1;
  }
  while (score > 21 && aces > 0) {
    score -= 10;
    aces -= 1;
  }
  return score;
};

// Add a simple keyframe animation for cards
const cardAnimation = keyframes`
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const renderHand = (hand) =>
  hand.map((card, idx) => (
    card ? (
      <Grow in key={idx} timeout={500 + idx * 200}>
        <Paper
          elevation={2}
          sx={{
            p: 1,
            mx: 0.5,
            animation: `${cardAnimation} 0.5s ease-out`,
          }}
        >
          {card.rank}{card.suit}
        </Paper>
      </Grow>
    ) : null // Skip rendering if card is undefined
  ));

const renderDealerHand = (hand, isGameOver) =>
  hand.map((card, idx) => (
    card ? (
      <Grow in key={idx} timeout={500 + idx * 200}>
        <Paper
          elevation={2}
          sx={{
            p: 1,
            mx: 0.5,
            animation: `${cardAnimation} 0.5s ease-out`,
          }}
        >
          {isGameOver || idx !== 0 ? `${card.rank}${card.suit}` : '🂠'}
        </Paper>
      </Grow>
    ) : null // Skip rendering if card is undefined
  ));

export default function BJ() {
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [money, setMoney] = useState(1000); // Player's starting money
  const [bet, setBet] = useState(0); // Current bet amount

  const startGame = () => {
    if (bet <= 0 || bet > money) {
      setMessage('Invalid bet amount!');
      return;
    }
    const newDeck = createDeck();
    if (newDeck.length < 4) {
      setMessage('Not enough cards in the deck!');
      return;
    }
    const player = [newDeck.pop(), newDeck.pop()];
    const dealer = [newDeck.pop(), newDeck.pop()];
    setDeck(newDeck);
    setPlayerHand(player);
    setDealerHand(dealer);
    setIsGameOver(false);
    setMessage('');
  };

  const handleHit = () => {
    if (deck.length === 0) {
      setMessage('Deck is empty!');
      return;
    }
    const newDeck = [...deck];
    const newCard = newDeck.pop();
    const newHand = [...playerHand, newCard];
    setPlayerHand(newHand);
    setDeck(newDeck);
    const score = calculateScore(newHand);
    if (score > 21) {
      setMessage('You busted!');
      setMoney(money - bet); // Deduct bet from money
      setIsGameOver(true);
    }
  };

  const handleStand = () => {
    if (deck.length === 0) {
      setMessage('Deck is empty!');
      return;
    }
    let dealer = [...dealerHand];
    let newDeck = [...deck];
    while (calculateScore(dealer) < 17 && newDeck.length > 0) {
      dealer.push(newDeck.pop());
    }
    setDealerHand(dealer);
    setDeck(newDeck);
    setIsGameOver(true);
    const playerScore = calculateScore(playerHand);
    const dealerScore = calculateScore(dealer);
    if (dealerScore > 21 || playerScore > dealerScore) {
      setMessage('You win!');
      setMoney(money + bet); // Add bet to money
    } else if (dealerScore === playerScore) {
      setMessage('Draw!');
    } else {
      setMessage('Dealer wins!');
      setMoney(money - bet); // Deduct bet from money
    }
  };

  const handleBetChange = (e) => {
    setBet(Number(e.target.value));
  };

  useEffect(() => {
    startGame();
  }, []);

  return (
    <Container sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h4" gutterBottom>🃏 Simple Blackjack</Typography>
      <Typography variant="h6">Money: ${money}</Typography>

      <Box my={3}>
        <Typography variant="h6">Dealer's Hand</Typography>
        <Stack direction="row" justifyContent="center">
          {renderDealerHand(dealerHand, isGameOver)}
        </Stack>
        {isGameOver && <Typography>Score: {calculateScore(dealerHand)}</Typography>}
      </Box>

      <Box my={3}>
        <Typography variant="h6">Your Hand</Typography>
        <Stack direction="row" justifyContent="center">{renderHand(playerHand)}</Stack>
        <Typography>Score: {calculateScore(playerHand)}</Typography>
      </Box>

      {!isGameOver && playerHand.length === 0 && (
        <>
          <Box my={2}>
            <Typography variant="h6">Place Your Bet</Typography>
            <input
              type="number"
              value={bet}
              onChange={handleBetChange}
              min="1"
              max={money}
              style={{ padding: '5px', fontSize: '16px' }}
            />
          </Box>
          <Button
            variant="contained"
            onClick={startGame}
            sx={{
              mt: 2,
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.1)' },
            }}
          >
            Start Game
          </Button>
        </>
      )}

      {!isGameOver && playerHand.length > 0 && (
        <Stack spacing={2} direction="row" justifyContent="center" sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={handleHit}
            sx={{
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.1)' },
            }}
          >
            Hit
          </Button>
          <Button
            variant="contained"
            onClick={handleStand}
            sx={{
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.1)' },
            }}
          >
            Stand
          </Button>
        </Stack>
      )}

      {isGameOver && (
        <>
          <Typography variant="h5" sx={{ mt: 2 }}>{message}</Typography>
          <Button
            variant="outlined"
            onClick={startGame}
            sx={{
              mt: 2,
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.1)' },
            }}
          >
            Play Again
          </Button>
        </>
      )}
    </Container>
  );
}
