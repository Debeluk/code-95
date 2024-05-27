import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  List,
  ListItem,
  IconButton,
  Collapse
} from '@mui/material';
import Notiflix from 'notiflix';
import { axiosInstance } from '../axiosInterceptor.js';
import { LOGIN } from '../constants/ApiURL.js';
import secureLocalStorage from 'react-secure-storage';
import { useStore } from '../store/store.js';
import { BAD_REQUEST_STATUS_CODE, SESSION_ALREADY_EXISTS } from '../constants/ErrorConstants.js';
import InputField from '../components/InputField/InputField.jsx';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCourses, setShowCourses] = useState(false);
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
        setIsLoading(false);
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
          minHeight: '100vh',
          padding: 8 // увеличиваем отступы
        }}
      >
        <Paper elevation={3} sx={{ width: '100%', maxWidth: '900px', borderRadius: '16px' }}>
          <Grid container spacing={0}>
            {/* Left Section for Desktop */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '16px',
                position: 'relative'
              }}
            >
              <Typography variant="h4" gutterBottom align="center">
                ADR Online
              </Typography>
              <Box>
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

            {/* Left Section for Mobile */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: { xs: 'flex', md: 'none' },
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '16px 16px 0 16px',
                position: 'relative'
              }}
            >
              <Typography
                variant="h4"
                gutterBottom
                align="center"
                onClick={() => setShowCourses(!showCourses)}
                sx={{ cursor: 'pointer', marginBottom: '0px' }}
              >
                ADR Online
              </Typography>
              <IconButton
                sx={{ margin: '0 auto', paddingTop: '0px' }}
                onClick={() => setShowCourses(!showCourses)}
              >
                <ExpandMoreIcon />
              </IconButton>
              <Collapse in={showCourses} timeout="auto" unmountOnExit>
                <Box>
                  <Typography variant="body1" paragraph>
                    Тестові питання та завдання з курсів спеціального навчання у сфері перевезення
                    небезпечних вантажів:
                  </Typography>
                  <List>
                    <ListItem>• Базового курсу</ListItem>
                    <ListItem>
                      • Спеціалізованого курсу підготовки з перевезення в цистернах
                    </ListItem>
                    <ListItem>
                      • Спеціалізованого курсу підготовки з перевезення вибухових речовин та виробів
                      класу 1
                    </ListItem>
                    <ListItem>
                      • Спеціалізованого курсу підготовки з перевезення радіоактивних матеріалів
                      класу 7
                    </ListItem>
                    <ListItem>• Курсу перепідготовки водіїв</ListItem>
                    <ListItem>
                      • Курсу підготовки уповноважених з питань безпеки перевезень небезпечних
                      вантажів
                    </ListItem>
                  </List>
                </Box>
              </Collapse>
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
                boxShadow: { md: '-12px 0px 24px rgba(0, 0, 0, 0.25)' },
                borderLeft: { md: '1px solid rgba(0, 0, 0, 0.12)' },
                zIndex: 2,
                position: 'relative',
                padding: 4,
                paddingTop: { xs: '0px', md: '4' },
                backgroundColor: 'white',
                borderTopRightRadius: '16px',
                borderBottomRightRadius: '16px',
                borderBottomLeftRadius: { xs: '16px', md: '0px' }
              }}
            >
              <Typography variant="h5" align="center" gutterBottom sx={{ marginBottom: '6px' }}>
                Увійти до особистого кабінету
              </Typography>
              <form onSubmit={handleLogin}>
                <Box marginBottom={3} marginTop={3}>
                  <InputField
                    label={'Логін'}
                    value={username}
                    handleValueChange={(value) => setUsername(value)}
                    error={!!usernameError}
                    disabled={isLoading}
                    errorMessage={usernameError}
                  />
                </Box>
                <Box marginBottom={3}>
                  <InputField
                    label={'Пароль'}
                    value={password}
                    handleValueChange={(value) => setPassword(value)}
                    password
                    error={!!passwordError}
                    disabled={isLoading}
                    errorMessage={passwordError}
                  />
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  type="submit"
                  disabled={isLoading}
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
                  }}
                >
                  {isLoading ? <LoadingDots /> : 'Увійти'}
                </Button>
              </form>
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
      }}
    >
      <div></div>
      <div></div>
    </Box>
  );
};
