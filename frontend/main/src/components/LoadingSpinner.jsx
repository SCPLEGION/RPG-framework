import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px',
      gap: 2,
    }}>
      <CircularProgress
        sx={{
          color: '#667eea',
        }}
      />
      <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
