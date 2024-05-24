import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Grid, List, ListItem } from '@mui/material';
import Notiflix from 'notiflix';
import { axiosInstance } from '../axiosInterceptor.js';
import { LOGIN } from '../constants/ApiURL.js';
import secureLocalStorage from 'react-secure-storage';
import { useStore } from '../store/store.js';
import { Loader } from '../components/Loader/Loader.jsx';
import { BAD_REQUEST_STATUS_CODE, SESSION_ALREADY_EXISTS } from '../constants/ErrorConstants.js';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setAccessToken, setRefreshToken } = useStore((state) => ({
    setAccessToken: state.setAccessToken,
    setRefreshToken: state.setRefreshToken
  }));

  const handleLogin = (event) => {
    event.preventDefault();
    setIsLoading(true);
    axiosInstance
      .post(LOGIN, { username, password })
      .then((res) => {
        console.log('Login successful:', res.data);
        secureLocalStorage.setItem('accessToken', res.data.accessToken);
        secureLocalStorage.setItem('refreshToken', res.data.refreshToken);
        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);
        setIsLoading(false); // Ensure loading state is reset after success
      })
      .catch((err) => {
        if (
          err?.response?.status === BAD_REQUEST_STATUS_CODE &&
          err?.response?.data?.detail === SESSION_ALREADY_EXISTS
        ) {
          Notiflix.Notify.failure('Session already exists. Please logout from other device.');
        } else {
          console.error('Error during login or fetching user details:', err.message);
          Notiflix.Notify.failure('Login failed. Please check your credentials.');
        }
        setIsLoading(false);
      });
  };

  return (
    <>
      <Loader isLoading={isLoading} />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          marginTop: 4,
          marginBottom: 6,
          marginLeft: 32,
          marginRight: 32,
          position: 'relative'
        }}>
        <Paper elevation={3} sx={{ padding: 4, width: '100%', position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4}>
            {/* Левая секция */}
            <Grid
              item
              xs={6}
              sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Box>
                <Typography variant="h4" gutterBottom>
                  ADR Online
                </Typography>
                <Typography variant="body1" paragraph>
                  Тестові питання та завдання з курсів спеціального навчання у сфері перевезення
                  небезпечних вантажів:
                </Typography>
                <List>
                  <ListItem>Базового курсу</ListItem>
                  <ListItem>Спеціалізованого курсу підготовки з перевезення в цистернах</ListItem>
                  <ListItem>
                    Спеціалізованого курсу підготовки з перевезення вибухових речовин та виробів
                    класу 1
                  </ListItem>
                  <ListItem>
                    Спеціалізованого курсу підготовки з перевезення радіоактивних матеріалів класу 7
                  </ListItem>
                  <ListItem>Курсу перепідготовки водіїв</ListItem>
                  <ListItem>
                    Курсу підготовки уповноважених з питань безпеки перевезень небезпечних вантажів
                  </ListItem>
                </List>
              </Box>
            </Grid>
            {/* Правая секция для входа */}
            <Grid item xs={6}>
              <Box>
                <Typography variant="h5" align="center" gutterBottom>
                  Увійти до особистого кабінету
                </Typography>
                <form onSubmit={handleLogin}>
                  <Box marginBottom={2}>
                    <TextField
                      id="username"
                      label="Номер телефону"
                      variant="outlined"
                      fullWidth
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isLoading} // Disable input while loading
                    />
                  </Box>
                  <Box marginBottom={2}>
                    <TextField
                      id="password"
                      label="Пароль"
                      variant="outlined"
                      fullWidth
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading} // Disable input while loading
                    />
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    type="submit"
                    disabled={isLoading} // Disable button while loading
                    sx={{
                      backgroundColor: isLoading ? 'rgba(0, 0, 0, 0.12)' : 'primary.main',
                      color: isLoading ? 'rgba(0, 0, 0, 0.26)' : 'white',
                      cursor: isLoading ? 'not-allowed' : 'pointer'
                    }}>
                    {isLoading ? 'Вхід...' : 'Увійти'}
                  </Button>
                </form>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </>
  );
};
