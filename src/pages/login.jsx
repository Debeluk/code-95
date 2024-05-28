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
  Collapse,
  SvgIcon
} from '@mui/material';
import Notiflix from 'notiflix';
import { axiosInstance } from '../axiosInterceptor.js';
import { LOGIN } from '../constants/ApiURL.js';
import secureLocalStorage from 'react-secure-storage';
import { useStore } from '../store/store.js';
import { BAD_REQUEST_STATUS_CODE, SESSION_ALREADY_EXISTS } from '../constants/ErrorConstants.js';
import InputField from '../components/InputField/InputField.jsx';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const TelegramIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M23.1117 4.49449C23.4296 2.94472 21.9074 1.65683 20.4317 2.227L2.3425 9.21601C0.694517 9.85273 0.621087 12.1572 2.22518 12.8975L6.1645 14.7157L8.03849 21.2746C8.13583 21.6153 8.40618 21.8791 8.74917 21.968C9.09216 22.0568 9.45658 21.9576 9.70712 21.707L12.5938 18.8203L16.6375 21.8531C17.8113 22.7334 19.5019 22.0922 19.7967 20.6549L23.1117 4.49449ZM3.0633 11.0816L21.1525 4.0926L17.8375 20.2531L13.1 16.6999C12.7019 16.4013 12.1448 16.4409 11.7929 16.7928L10.5565 18.0292L10.928 15.9861L18.2071 8.70703C18.5614 8.35278 18.5988 7.79106 18.2947 7.39293C17.9906 6.99479 17.4389 6.88312 17.0039 7.13168L6.95124 12.876L3.0633 11.0816ZM8.17695 14.4791L8.78333 16.6015L9.01614 15.321C9.05253 15.1209 9.14908 14.9366 9.29291 14.7928L11.5128 12.573L8.17695 14.4791Z" />
  </SvgIcon>
);

const ViberIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M13 4C12.4477 4 12 4.44772 12 5C12 5.55228 12.4477 6 13 6C14.2728 6 15.2557 6.41989 15.9179 7.08211C16.5801 7.74433 17 8.72725 17 10C17 10.5523 17.4477 11 18 11C18.5523 11 19 10.5523 19 10C19 8.27275 18.4199 6.75567 17.3321 5.66789C16.2443 4.58011 14.7272 4 13 4Z" />
    <path d="M5.014 8.00613C5.12827 7.1024 6.30277 5.87414 7.23488 6.01043L7.23339 6.00894C8.01251 6.15699 8.65217 7.32965 9.07373 8.10246C9.14298 8.22942 9.20635 8.34559 9.26349 8.44465C9.55041 8.95402 9.3641 9.4701 9.09655 9.68787C9.06561 9.7128 9.03317 9.73855 8.9998 9.76504C8.64376 10.0477 8.18114 10.4149 8.28943 10.7834C8.5 11.5 11 14 12.2296 14.7107C12.6061 14.9283 12.8988 14.5057 13.1495 14.1438C13.2087 14.0583 13.2656 13.9762 13.3207 13.9067C13.5301 13.6271 14.0466 13.46 14.5548 13.736C15.3138 14.178 16.0288 14.6917 16.69 15.27C17.0202 15.546 17.0977 15.9539 16.8689 16.385C16.4659 17.1443 15.3003 18.1456 14.4542 17.9421C12.9764 17.5868 7 15.27 5.08033 8.55801C4.97981 8.26236 4.99645 8.13792 5.01088 8.02991L5.014 8.00613Z" />
    <path d="M13 7C12.4477 7 12 7.44772 12 8C12 8.55228 12.4477 9 13 9C13.1748 9 13.4332 9.09745 13.6679 9.33211C13.9025 9.56676 14 9.82523 14 10C14 10.5523 14.4477 11 15 11C15.5523 11 16 10.5523 16 10C16 9.17477 15.5975 8.43324 15.0821 7.91789C14.5668 7.40255 13.8252 7 13 7Z" />
    <path d="M7.51742 23.8312C7.54587 23.8469 7.57508 23.8612 7.60492 23.874C8.14762 24.1074 8.81755 23.5863 10.1574 22.5442L11.5 21.5C14.1884 21.589 16.514 21.2362 18.312 20.6071C20.3227 19.9035 21.9036 18.3226 22.6072 16.3119C23.5768 13.541 23.5768 8.45883 22.6072 5.68794C21.9036 3.67722 20.3227 2.0963 18.312 1.39271C15.1103 0.272407 8.82999 0.293306 5.68806 1.39271C3.67733 2.0963 2.09642 3.67722 1.39283 5.68794C0.423255 8.45883 0.423255 13.541 1.39283 16.3119C2.09642 18.3226 3.67733 19.9035 5.68806 20.6071C6.08252 20.7451 6.52371 20.8965 7 21C7 22.6974 7 23.5461 7.51742 23.8312ZM9 20.9107V19.7909C9 19.5557 8.836 19.3524 8.60597 19.3032C7.84407 19.1403 7.08676 18.9776 6.34862 18.7193C4.91238 18.2168 3.78316 17.0875 3.2806 15.6513C2.89871 14.5599 2.66565 12.8453 2.66565 10.9999C2.66565 9.15453 2.89871 7.43987 3.2806 6.3485C3.78316 4.91227 4.91238 3.78304 6.34862 3.28048C7.61625 2.83692 9.71713 2.56282 11.9798 2.56032C14.2422 2.55782 16.3561 2.82723 17.6514 3.28048C19.0876 3.78304 20.2169 4.91227 20.7194 6.3485C21.1013 7.43987 21.3344 9.15453 21.3344 10.9999C21.3344 12.8453 21.1013 14.5599 20.7194 15.6513C20.2169 17.0875 19.0876 18.2168 17.6514 18.7193C15.5197 19.4652 13.259 19.549 11.0239 19.4828C10.9071 19.4794 10.7926 19.5165 10.7004 19.5882L9 20.9107Z" />
  </SvgIcon>
);

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
                paddingTop: { xs: '4', md: '4' },
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
              <Box
                sx={{
                  marginTop: '0',
                  textAlign: 'center',
                  padding: 2
                }}
              >
                <Typography variant="body2">Зворотній зв`язок</Typography>
                <Box display="flex" justifyContent="center" marginTop={1} gap={2}>
                  <IconButton
                    color="primary"
                    aria-label="Telegram"
                    href="#"
                    sx={{
                      backgroundColor: 'white',
                      border: '1px solid #ccc',
                      borderRadius: '50%',
                      '&:hover': {
                        backgroundColor: 'white'
                      },
                      '&:active': {
                        backgroundColor: 'white'
                      }
                    }}
                  >
                    <TelegramIcon width="24px" height="24px" sx={{ color: 'black' }} />
                  </IconButton>
                  <IconButton
                    color="primary"
                    aria-label="Viber"
                    href="viber://chat?number=+380937698333"
                    sx={{
                      backgroundColor: 'white',
                      border: '1px solid #ccc',
                      borderRadius: '50%',
                      '&:hover': {
                        backgroundColor: 'white'
                      },
                      '&:active': {
                        backgroundColor: 'white'
                      }
                    }}
                  >
                    <ViberIcon width="24px" height="24px" sx={{ color: 'black' }} />
                  </IconButton>
                </Box>
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
      }}
    >
      <div></div>
      <div></div>
      <div></div>
    </Box>
  );
};
