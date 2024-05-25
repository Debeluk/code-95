import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Grid, List, ListItem } from '@mui/material';
import Notiflix from 'notiflix';
import { axiosInstance } from '../axiosInterceptor.js';
import { LOGIN } from '../constants/ApiURL.js';
import secureLocalStorage from 'react-secure-storage';
import { useStore } from '../store/store.js';
import { BAD_REQUEST_STATUS_CODE, SESSION_ALREADY_EXISTS } from '../constants/ErrorConstants.js';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setAccessToken, setRefreshToken } = useStore((state) => ({
    setAccessToken: state.setAccessToken,
    setRefreshToken: state.setRefreshToken
  }));

  const handleLogin = (event) => {
    event.preventDefault();
    if (username.length < 6) {
      setUsernameError('Логін повинен містити мінімум 6 знаків.');
      return;
    } else {
      setUsernameError('');
    }

    if (password.length < 6) {
      setPasswordError('Пароль повинен містити мінімум 6 знаків.');
      return;
    } else {
      setPasswordError('');
    }

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
          Notiflix.Notify.warning(
            'Цей аккаунт вже викорстовується. Будь ласка вийдіть з іншого пристрою.'
          );
        } else {
          console.error('Error during login or fetching user details:', err.message);
          Notiflix.Notify.failure('Помилка у введених даних, будь ласка перевірте пароль.');
        }
        setIsLoading(false);
      });
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh'
        }}>
        <Paper elevation={3} sx={{ width: '100%', maxWidth: '900px', borderRadius: '16px' }}>
          <Grid container spacing={0}>
            {/* Left Section */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: 0
              }}>
              <Box sx={{ padding: 2 }}>
                <Typography variant="h4" gutterBottom>
                  ADR Online
                </Typography>
                <Typography variant="body1" paragraph>
                  Тестові питання та завдання з курсів спеціального навчання у сфері перевезення
                  небезпечних вантажів:
                </Typography>
                <List>
                  <ListItem>• Базового курсу</ListItem>
                  <ListItem>• Спеціалізованого курсу підготовки з перевезення в цистернах</ListItem>
                  <ListItem>
                    • Спеціалізованого курсу підготовки з перевезення вибухових речовин та виробів
                    класу 1
                  </ListItem>
                  <ListItem>
                    • Спеціалізованого курсу підготовки з перевезення радіоактивних матеріалів класу
                    7
                  </ListItem>
                  <ListItem>• Курсу перепідготовки водіїв</ListItem>
                  <ListItem>
                    • Курсу підготовки уповноважених з питань безпеки перевезень небезпечних
                    вантажів
                  </ListItem>
                </List>
              </Box>
            </Grid>

            {/* Right Section for Login */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                boxShadow: '-12px 0px 24px rgba(0, 0, 0, 0.25)',
                borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
                zIndex: 2,
                position: 'relative',
                padding: 0,
                backgroundColor: 'white',
                borderTopRightRadius: '16px',
                borderBottomRightRadius: '16px'
              }}>
              <Box sx={{ padding: 3 }}>
                <Typography variant="h5" align="center" gutterBottom sx={{ marginBottom: '6px' }}>
                  Увійти до особистого кабінету
                </Typography>
                <form onSubmit={handleLogin}>
                  <Box marginBottom={3}>
                    <TextField
                      id="username"
                      label="Логін"
                      variant="outlined"
                      fullWidth
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      error={!!usernameError}
                      helperText={usernameError}
                      disabled={isLoading} // Disable input while loading
                      InputProps={{
                        sx: {
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'black'
                          }
                        }
                      }}
                      InputLabelProps={{
                        sx: {
                          '&.Mui-focused': {
                            color: 'black'
                          }
                        }
                      }}
                    />
                  </Box>
                  <Box marginBottom={3}>
                    <TextField
                      id="password"
                      label="Пароль"
                      variant="outlined"
                      fullWidth
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      error={!!passwordError}
                      helperText={passwordError}
                      disabled={isLoading}
                      InputProps={{
                        sx: {
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'black'
                          }
                        }
                      }}
                      InputLabelProps={{
                        sx: {
                          '&.Mui-focused': {
                            color: 'black'
                          }
                        }
                      }}
                    />
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    type="submit"
                    disabled={isLoading} // Disable button while loading
                    sx={{
                      backgroundColor: isLoading ? 'rgba(0, 0, 0, 0.12)' : 'orange',
                      color: 'white',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      height: '40px',
                      '&:hover': {
                        backgroundColor: 'orange',
                        transform: 'scale(1.02)'
                      },
                      '&:active': {
                        backgroundColor: 'orange'
                      },
                      '&.Mui-disabled': {
                        backgroundColor: 'orange',
                        color: 'white'
                      }
                    }}>
                    {isLoading ? <LoadingDots /> : 'Увійти'}
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

const LoadingDots = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '& div': {
          width: '8px',
          height: '8px',
          backgroundColor: 'white',
          borderRadius: '50%',
          margin: '0 2px',
          animation: 'loading 0.8s infinite',
          '&:nth-of-type(1)': {
            animationDelay: '0s'
          },
          '&:nth-of-type(2)': {
            animationDelay: '0.2s'
          },
          '&:nth-of-type(3)': {
            animationDelay: '0.4s'
          }
        },
        '@keyframes loading': {
          '0%': {
            opacity: 1,
            transform: 'translateX(0)'
          },
          '50%': {
            opacity: 0,
            transform: 'translateX(-16px)'
          },
          '100%': {
            opacity: 1,
            transform: 'translateX(0)'
          }
        }
      }}>
      <div></div>
      <div></div>
    </Box>
  );
};
