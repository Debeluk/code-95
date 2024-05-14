import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import {REFRESH} from "../../constants/ApiURL.js";
import {ACCESS_TOKEN, REFRESH_TOKEN} from "../../constants/authConstants.js";
import {TOKEN_EXPIRED, UNAUTHORIZED_STATUS_CODE} from "../../constants/ErrorConstants.js";

export const axiosInstance = axios.create();

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
        const accessToken = secureLocalStorage.getItem(ACCESS_TOKEN);
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
        if (!error.response) {
            return Promise.reject(error);
        }
        const originalRequest = error.config;

        if (error.response.status === UNAUTHORIZED_STATUS_CODE && error.response.data.detail === TOKEN_EXPIRED) {

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

            const refreshToken = secureLocalStorage.getItem(REFRESH_TOKEN);
            return axios.post(REFRESH, {token: refreshToken})
                .then(({data}) => {
                    secureLocalStorage.setItem(ACCESS_TOKEN, data.accessToken);
                    secureLocalStorage.setItem(REFRESH_TOKEN, data.refreshToken);
                    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                    onRefreshed(data.accessToken);
                    return axios(originalRequest);
                })
                .catch((err) => {
                    //logout()
                    return Promise.reject(err);
                })
                .finally(() => {
                    isRefreshing = false;
                });
        }
        return Promise.reject(error);
    }
);

