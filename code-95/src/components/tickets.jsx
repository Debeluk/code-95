import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
} from '@mui/material';

export const TicketsPage = () => {
  const ticketNumbers = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <Box sx={{pb: 50, mt: 4, mb: 6,ml: 32, mr: 32}}>
      {/* Заголовок страницы */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" gutterBottom>
          Назва Курсу
        </Typography>
        <Typography variant="h5" gutterBottom>
          Білети
        </Typography>
      </Box>

      {/* Маленькие кнопки с номерами билетов */}
      <Grid container spacing={2} justifyContent="center" mb={4}>
        {ticketNumbers.map((number) => (
          <Grid item key={number}>
            <Button
              variant="contained"
              color="inherit"
              sx={{
                minWidth: '40px',
                minHeight: '40px',
                borderRadius: '8px',
                textTransform: 'none',
              }}
            >
              {number}
            </Button>
          </Grid>
        ))}
      </Grid>

      {/* Длинная кнопка "Випадкові питання" */}
      <Grid container justifyContent="center" mb={4}>
        <Grid item>
          <Button
            variant="contained"
            color="inherit"
            sx={{
              minWidth: '270px',
              minHeight: '50px',
              borderRadius: '16px',
              textTransform: 'none',
              mr: 2,
            }}
          >
            Випадковий білет
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="inherit"
            sx={{
              minWidth: '270px',
              minHeight: '50px',
              borderRadius: '16px',
              textTransform: 'none',
            }}
          >
            Випадкові питання
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
