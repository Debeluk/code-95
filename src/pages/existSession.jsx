import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { logout } from '../axiosInterceptor.js';

export const ExistSession = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f0f0'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: '32px',
          borderRadius: '16px',
          textAlign: 'center',
          maxWidth: '400px',
          width: '100%'
        }}
      >
        <Typography variant="h6" gutterBottom>
          Цей аккаунт вже використовується
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogout}
          sx={{
            width: "60%",
            backgroundColor: 'orange',
            color: 'white',
            marginTop: '16px',
            '&:hover': {
              backgroundColor: 'orange',
              transform: 'scale(1.02)'
            },
            '&:active': {
              backgroundColor: 'orange'
            }
          }}
        >
          Вийти
        </Button>
      </Paper>
    </Box>
  );
};
