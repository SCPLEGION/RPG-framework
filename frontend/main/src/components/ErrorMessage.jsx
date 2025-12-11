import React from 'react';
import { Alert, Box, Button } from '@mui/material';
import { ErrorOutline as ErrorIcon, Refresh as RefreshIcon } from '@mui/icons-material';

const ErrorMessage = ({ message, onRetry, severity = 'error' }) => {
  return (
    <Box sx={{ my: 2 }}>
      <Alert
        severity={severity}
        icon={<ErrorIcon />}
        action={
          onRetry && (
            <Button
              color="inherit"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={onRetry}
              sx={{ textTransform: 'none' }}
            >
              Retry
            </Button>
          )
        }
        sx={{
          background: severity === 'error'
            ? 'rgba(244, 67, 54, 0.1)'
            : 'rgba(255, 152, 0, 0.1)',
          borderColor: severity === 'error' ? '#F44336' : '#FF9800',
          color: severity === 'error' ? '#FF7043' : '#FFB74D',
          '& .MuiAlert-icon': {
            color: severity === 'error' ? '#F44336' : '#FF9800',
          }
        }}
      >
        {message}
      </Alert>
    </Box>
  );
};

export default ErrorMessage;
