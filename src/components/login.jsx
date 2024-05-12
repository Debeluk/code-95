import React, {useState} from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Grid, List, ListItem,
} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {logUserIn} from "./req/axios.jsx";
import Notiflix from 'notiflix';

export const LoginPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (event) => {
        event.preventDefault();
        logUserIn(username, password)
            .then(result => {
                if (result) {
                    Notiflix.Notify.success('Login successful!');
                    navigate('/courses');
                } else {
                    Notiflix.Notify.failure('Login failed. Please check your credentials.');
                }
            })
            .catch(error => {
                Notiflix.Notify.failure('An error occurred during login. Please try again.');
                console.error('Login error:', error);
            });
    };

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            mt: 4,
            mb: 6,
            ml: 32,
            mr: 32
        }}>
            <Paper elevation={3} sx={{p: 4}}>
                <Grid container spacing={4}>
                    {/* Левая секция */}
                    <Grid item xs={12} md={6} sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
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
                                <ListItem>Спеціалізованого курсу підготовки з перевезення вибухових речовин та виробів
                                    класу 1</ListItem>
                                <ListItem>Спеціалізованого курсу підготовки з перевезення радіоактивних матеріалів класу
                                    7</ListItem>
                                <ListItem>Курсу перепідготовки водіїв</ListItem>
                                <ListItem>Курсу підготовки уповноважених з питань безпеки перевезень небезпечних
                                    вантажів</ListItem>
                            </List>
                        </Box>
                    </Grid>
                    {/* Right section for login */}
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
    );
};
