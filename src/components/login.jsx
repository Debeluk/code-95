import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Grid, List, ListItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Notiflix from 'notiflix';
import { axiosInstance } from './req/axiosInterceptor.js';
import { GET_CURRENT_USER, LOGIN } from '../constants/ApiURL';
import secureLocalStorage from 'react-secure-storage';
import { useStore } from '../store/store';
import Loader from './Loader/Loader';
import axios from 'axios';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const setCurrentUser = useStore((state) => state.setCurrentUser);

  const handleLogin = (event) => {
    event.preventDefault();
    setIsLoading(true);
    axiosInstance
      .post(LOGIN, { username, password })
      .then((res) => {
        console.log('Login successful:', res.data);
        secureLocalStorage.setItem('accessToken', res.data.accessToken);
        secureLocalStorage.setItem('refreshToken', res.data.refreshToken);
        axios
          .get(GET_CURRENT_USER, {
            headers: {
              Authorization: `Bearer ${res.data.accessToken}`
            }
          })
          .then((response) => {
            setCurrentUser(response.data);
            Notiflix.Notify.success('Login successful!');
            if (response.data.userRole === 'ADMIN') {
              navigate('/admin');
            } else {
              navigate('/courses');
            }
            setIsLoading(false);
          })
          .catch((err) => {
            setIsLoading(false);
            console.error('Error during login or fetching user details:', err.message);
            Notiflix.Notify.failure('An error occurred during login. Please try again.');
          });
      })
      .catch((err) => {
        console.error('Error during login or fetching user details:', err.message);
        Notiflix.Notify.failure('Login failed. Please check your credentials.');
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
          mt: 4,
          mb: 6,
          ml: 32,
          mr: 32
        }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Grid container spacing={4}>
            {/* Левая секция */}
            <Grid
              item
              xs={12}
              md={6}
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
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="h5" align="center" gutterBottom>
                  Увійти до особистого кабінету
                </Typography>
                <form onSubmit={handleLogin}>
                  <Box mb={2}>
                    <TextField
                      id="username"
                      label="Номер телефону"
                      variant="outlined"
                      fullWidth
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </Box>
                  <Box mb={2}>
                    <TextField
                      id="password"
                      label="Пароль"
                      variant="outlined"
                      fullWidth
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Box>
                  <Button variant="contained" color="primary" fullWidth type="submit">
                    Увійти
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
