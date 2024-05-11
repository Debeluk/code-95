import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  TextField,
  Button,
  Paper,
  Grid,
} from '@mui/material';

export const LoginPage = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', mt: 4, mb: 6,ml: 32, mr: 32 }}>
      <Paper elevation={3} sx={{ p: 4}}>
        <Grid container spacing={4}>
          {/* Левая секция */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box>
              <Typography variant="h4" gutterBottom>
                ADR Online
              </Typography>
              <Typography variant="body1" paragraph>
                Тестові питання та завдання з курсів спеціального навчання у сфері перевезення небезпечних вантажів:
              </Typography>
              <List>
                <ListItem>Базового курсу</ListItem>
                <ListItem>Спеціалізованого курсу підготовки з перевезення в цистернах</ListItem>
                <ListItem>Спеціалізованого курсу підготовки з перевезення вибухових речовин та виробів класу 1</ListItem>
                <ListItem>Спеціалізованого курсу підготовки з перевезення радіоактивних матеріалів класу 7</ListItem>
                <ListItem>Курсу перепідготовки водіїв</ListItem>
                <ListItem>Курсу підготовки уповноважених з питань безпеки перевезень небезпечних вантажів</ListItem>
              </List>
            </Box>
          </Grid>

          {/* Правая секция */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box>
              <Typography variant="h5" align="center" gutterBottom>
                Увійти до особистого кабінету
              </Typography>
              <form>
                <Box mb={2}>
                  <TextField
                    id="phone"
                    label="Номер телефону"
                    variant="outlined"
                    fullWidth
                    type="text"
                    name="phone"
                  />
                </Box>
                <Box mb={2}>
                  <TextField
                    id="password"
                    label="Пароль"
                    variant="outlined"
                    fullWidth
                    type="password"
                    name="password"
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
  );
};
