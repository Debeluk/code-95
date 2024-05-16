import React from 'react';
import { Box, Typography, TextField, Button, IconButton, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const textFieldStyle = {
  '& .MuiInputBase-root': {
    height: '48px',
    fontSize: '16px',
    maxWidth: '400px'
  }
};

const gridItemStyle = {
  width: '400px'
};

export const UserInfo = () => {
  const [date, setDate] = React.useState(null);

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <Box sx={{ marginTop: 4, marginBottom: 6, marginLeft: 32, marginRight: 32 }}>
      {/* First Row */}
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
        <Typography variant="h5">Додати/Змінити користувача</Typography>
        <IconButton color="error" sx={{ padding: 0 }}>
          <Box
            sx={{
              width: '24px',
              height: '24px',
              backgroundColor: 'grey',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <CloseIcon sx={{ color: 'white', fontSize: '18px' }} />
          </Box>
        </IconButton>
      </Box>

      {/* Second Row */}
      <Grid container spacing={2} justifyContent="space-between" alignItems="center" marginBottom={2}>
        <Grid item sx={gridItemStyle}>
          <Typography variant="subtitle1" gutterBottom>
            Ім'я користувача
          </Typography>
          <TextField variant="outlined" fullWidth sx={textFieldStyle} />
        </Grid>
        <Grid item sx={gridItemStyle}>
          <Typography variant="subtitle1" gutterBottom>
            ID
          </Typography>
          <TextField
            variant="outlined"
            fullWidth
            InputProps={{ readOnly: true }}
            defaultValue="123456"
            sx={textFieldStyle}
          />
        </Grid>
      </Grid>

      {/* Third Row */}
      <Grid container spacing={2} justifyContent="space-between" alignItems="center" marginBottom={2}>
        <Grid item sx={gridItemStyle}>
          <Typography variant="subtitle1" gutterBottom>
            Логін
          </Typography>
          <TextField variant="outlined" fullWidth sx={textFieldStyle} />
        </Grid>
        <Grid item sx={gridItemStyle}>
          <Typography variant="subtitle1" gutterBottom>
            Пароль
          </Typography>
          <TextField variant="outlined" type="password" fullWidth sx={textFieldStyle} />
        </Grid>
      </Grid>

      {/* Fourth Row */}
      <Grid container spacing={2} justifyContent="space-between" alignItems="end">
        <Grid item sx={gridItemStyle}>
          <Typography variant="subtitle1" gutterBottom>
            Термін доступу
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              inputFormat="DD/MM/YYYY"
              value={date}
              onChange={handleDateChange}
              renderInput={(params) => (
                <TextField {...params} variant="outlined" fullWidth sx={textFieldStyle} />
              )}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item sx={gridItemStyle}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            alignItems="flex-end"
            height="100%"
          >
            <Button
              variant="contained"
              color="primary"
              sx={{ textTransform: 'none', minWidth: '120px', height: '56px' }}
            >
              Зберегти
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
