import axios from 'axios';

export const logUserIn = async (username, password) => {
    try {
        const response = await axios.post('http://<backend-url>/api/v1/auth/login', {
            username,
            password
        });

        if (response.status === 200) {
            console.log('Login successful:', response.data);
            localStorage.setItem('accessToken', response.data.access_token);
            localStorage.setItem('refreshToken', response.data.refresh_token);
            return response.data;
        }

    } catch (error) {
        if (error.response && error.response.status === 422) {
            console.error('Validation error:', error.response.data.detail);
        } else {
            console.error('Error during login:', error.message);
        }
        return null;
    }
};
