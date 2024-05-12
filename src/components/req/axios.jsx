import axios from 'axios';
import {LOGIN} from "../../constants/ApiURL.js";

export const logUserIn = async (username, password) => {
    try {
        const response = await axios.post(LOGIN, {
            username:username,
            password:password
        });

        if (response.status === 200) {
            console.log('Login successful:', response.data);
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
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
