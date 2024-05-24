import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, IconButton, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { axiosInstance } from '../axiosInterceptor.js';
import { CREATE_GET_USER, USER_USE } from '../constants/ApiURL.js';
import { Loader } from '../components/Loader/Loader.jsx';

dayjs.extend(utc);

const textFieldStyle = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'black'
    },
    '&:hover fieldset': {
      borderColor: 'black'
    },
    '&.Mui-focused fieldset': {
      borderColor: 'black'
    }
  },
  '& .MuiInputBase-input': {
    height: '48px',
    boxSizing: 'border-box'
  }
};

const gridItemStyle = {
  width: '100%'
};

const buttonStyle = {
  height: '40px',
  textTransform: 'none',
  fontSize: '14px',
  marginLeft: '8px',
  borderColor: 'black',
  color: 'black',
  backgroundColor: 'white',
  '&:hover': {
    backgroundColor: 'white',
    borderColor: 'black'
  },
  '&:active': {
    backgroundColor: 'white',
    borderColor: 'black'
  }
};

const datePickerContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  padding: '0px'
};

const closeButtonStyle = {
  color: 'black',
  backgroundColor: 'transparent'
};

export const UserInfoModal = ({ user, onClose, isEdit, refreshUsers }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [expireDate, setExpireDate] = useState(dayjs().utc());
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEdit && user) {
      setName(user.name);
      setUsername(user.username || '');
      setPassword('');
      setExpireDate(dayjs.utc(user.expireAt));
    } else {
      setName('');
      setUsername('');
      setPassword('');
      setExpireDate(dayjs().utc().add(1, 'day'));
    }
  }, [user, isEdit]);

  const handleSave = () => {
    if (!name) {
      setError("Ім'я не може бути порожнім.");
      return;
    }

    if (username.length < 6) {
      setError('Логін повинен містити мінімум 6 знаків.');
      return;
    }

    if (password.length < 6) {
      setError('Пароль повинен містити мінімум 6 знаків.');
      return;
    }

    if (!isEdit && expireDate.isBefore(dayjs().utc().add(1, 'day'))) {
      setError('Дата закінчення повинна бути як мінімум на день вперед.');
      return;
    }

    setIsLoading(true);

    const requestData = {
      name,
      expire_at: expireDate.toISOString(),
      credentials: {
        username: username,
        password: password
      }
    };

    const requestPromise =
      isEdit && user
        ? axiosInstance.put(USER_USE.replace('{user_id}', user.id), requestData)
        : axiosInstance.post(CREATE_GET_USER, requestData);

    requestPromise
      .then((response) => {
        refreshUsers();
        onClose();
      })
      .catch((error) => {
        setError('Помилка при збереженні користувача.');
        console.error('Error saving user:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDateChange = (newDate) => {
    setExpireDate(newDate.utc());
  };

  const addDays = (days) => {
    setExpireDate(expireDate.add(days, 'day').utc());
  };

  return (
    <Box sx={{ padding: 1, maxWidth: '412px', margin: '0 auto', position: 'relative' }}>
      {isLoading && <Loader />}
      {/* First Row */}
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
        <Typography variant="h6">
          {isEdit ? 'Змінити користувача' : 'Додати користувача'}
        </Typography>
        <IconButton onClick={onClose} sx={closeButtonStyle}>
          <CloseIcon sx={{ color: 'black', fontSize: '18px' }} />
        </IconButton>
      </Box>

      {/* Second Row */}
      <Grid container spacing={2} alignItems="center" marginBottom={2}>
        <Grid item sx={gridItemStyle}>
          <Typography variant="subtitle1" gutterBottom>
            {`Ім'я користувача`}
          </Typography>
          <TextField
            variant="outlined"
            fullWidth
            sx={textFieldStyle}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Grid>
      </Grid>

      {/* Third Row */}
      <Grid container spacing={1} alignItems="center" marginBottom={2}>
        <Grid item sx={gridItemStyle}>
          <Typography variant="subtitle1" gutterBottom>
            Логін
          </Typography>
          <TextField
            variant="outlined"
            fullWidth
            sx={textFieldStyle}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Grid>
        <Grid item sx={gridItemStyle} marginTop={1}>
          <Typography variant="subtitle1" gutterBottom>
            Пароль
          </Typography>
          <TextField
            variant="outlined"
            fullWidth
            sx={textFieldStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Grid>
      </Grid>

      {/* Fourth Row */}
      <Grid container spacing={2} alignItems="center">
        <Grid item sx={gridItemStyle}>
          <Typography variant="subtitle1" gutterBottom>
            Термін доступу
          </Typography>
          <Box sx={datePickerContainerStyle}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                inputFormat="DD/MM/YYYY"
                value={expireDate}
                onChange={handleDateChange}
                slots={{
                  textField: (params) => (
                    <TextField {...params} variant="outlined" fullWidth sx={textFieldStyle} />
                  )
                }}
              />
            </LocalizationProvider>
            <Button onClick={() => addDays(14)} variant="outlined" sx={buttonStyle}>
              +14
            </Button>
            <Button onClick={() => addDays(30)} variant="outlined" sx={buttonStyle}>
              +30
            </Button>
          </Box>
          {error && (
            <Typography variant="caption" color="error">
              {error}
            </Typography>
          )}
        </Grid>
      </Grid>

      {/* Fifth Row */}
      <Grid container spacing={2} justifyContent="flex-end" alignItems="end" marginTop={2}>
        <Grid item>
          <Button
            variant="contained"
            sx={{
              ...buttonStyle,
              minWidth: '140px',
              backgroundColor: 'orange',
              color: 'white',
              borderColor: 'orange',
              '&:hover': {
                backgroundColor: 'orange'
              }
            }}
            onClick={handleSave}>
            Зберегти
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
