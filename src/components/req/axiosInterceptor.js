import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import {REFRESH} from "../../constants/ApiURL.js";

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:8001',
    timeout: 10000,
});

let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(token) {
    refreshSubscribers.map(callback => callback(token));
    refreshSubscribers = [];
}

function addRefreshSubscriber(callback) {
    refreshSubscribers.push(callback);
}

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = secureLocalStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const {config, response: {status}} = error;
        const originalRequest = config;

        if (status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve) => {
                    addRefreshSubscriber((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(axiosInstance(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = secureLocalStorage.getItem('refreshToken');
            return axios.post(REFRESH, {token: refreshToken})
                .then(({data}) => {
                    secureLocalStorage.setItem('accessToken', data.accessToken);
                    secureLocalStorage.setItem('refreshToken', data.refreshToken);
                    axiosInstance.defaults.headers.Authorization = `Bearer ${data.accessToken}`;
                    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                    onRefreshed(data.accessToken);
                    return axiosInstance(originalRequest);
                })
                .catch((err) => {
                    return Promise.reject(err);
                })
                .finally(() => {
                    isRefreshing = false;
                });
        }

        return Promise.reject(error);
    }
);

