import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
} from '@mui/material';

export const Courses = () => {
  const courseTitles = [
    'Базовий курс',
    'Цистерни',
    'Вибухові речовини',
    'Радіоактивні матеріали',
    'Перепідготовка',
    'Уповноважені',
  ];

  // Обработчик клика для карточек
  const handleCardClick = (course) => {
    console.log(`You clicked ${course}`);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 6,
        mt: 4, mb: 6,ml: 32, mr: 32
      }}
    >
      <Box textAlign="center" sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Курси
        </Typography>
      </Box>
      <Grid
        container
        spacing={4}
        justifyContent="center"
        alignItems="center"
      >
        {courseTitles.map((title, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: '16px',
                backgroundColor: 'white',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                height: 150,
                padding: 2,
                cursor: 'pointer',
                boxShadow: '0px 0px 0px rgba(0,0,0,0)',
                '&:hover': {
                  boxShadow: '0px 4px 12px rgba(0,0,0,0.1), 0px 0px 0px rgba(0,0,0,0)', // Добавляем сильную тень снизу
                },
              }}
              onClick={() => handleCardClick(title)}
            >
              <Typography variant="h6" color="inherit" align="center" sx={{ flexGrow: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                {title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
