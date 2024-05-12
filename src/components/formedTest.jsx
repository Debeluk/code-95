import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  FormControl,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

export const FormedTest = () => {
  const questionNumbers = Array.from({ length: 25 }, (_, i) => i + 1);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleEndTest = () => {
    // Обработка завершения теста (например, отправка результатов на бекенд)
    console.log('Тест завершен');
    setOpenDialog(false);
  };

  return (
    <Box sx={{ mt: 4, mb: 6, ml: 32, mr: 32 }}>
      {/* Заголовок страницы */}
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography variant="h4" gutterBottom>
          Назва курсу
        </Typography>
        <Typography variant="h5" gutterBottom>
          Номер білету
        </Typography>
      </Box>

      {/* Кнопки вопросов */}
      <Grid container spacing={1} mb={2}>
        {questionNumbers.map((number) => (
          <Grid item xs="auto" key={number}>
            <Button
              variant="outlined"
              color="primary"
              sx={{
                minWidth: '38px',
                minHeight: '38px',
                borderRadius: '8px',
                textTransform: 'none',
                padding: '0',
              }}
            >
              {number}
            </Button>
          </Grid>
        ))}
      </Grid>

      {/* Зона с вопросом и ответами */}
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        minHeight="200px"
        maxHeight="400px"
        marginBottom="20px"
        p={4}
        sx={{ borderRadius: '8px', backgroundColor: '#f9f9f9', boxShadow: 2 }}
      >
        {/* Вопрос */}
        <Typography variant="h6" gutterBottom>
          Як зупинити час?
        </Typography>

        {/* Ответы */}
        <FormControl component="fieldset" sx={{ mt: 4 }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ textTransform: 'none', maxHeight: '42px' }}
              >
                Час не зупинити
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ textTransform: 'none', maxHeight: '42px' }}
              >
                Зупинити Час
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ textTransform: 'none', maxHeight: '42px' }}
              >
                Крокус
              </Button>
            </Grid>
          </Grid>
        </FormControl>
      </Box>

      {/* Кнопка "Завершити тест" */}
      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="error"
          onClick={handleOpenDialog}
          sx={{
            borderRadius: '16px',
            textTransform: 'none',
            minWidth: '120px',
            minHeight: '40px',
          }}
        >
          Завершити тест
        </Button>
      </Box>

      {/* Модальное окно подтверждения */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">
          Підтвердити завершення тесту
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Ви впевнені, що хочете завершити тест?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Відміна
          </Button>
          <Button onClick={handleEndTest} color="error" variant="contained">
            Завершити тест
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
