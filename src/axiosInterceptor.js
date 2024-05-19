import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import { REFRESH } from './constants/ApiURL.js';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants/authConstants.js';
import { TOKEN_EXPIRED, UNAUTHORIZED_STATUS_CODE } from './constants/ErrorConstants.js';
import { useStore } from './store/store.js';

export const axiosInstance = axios.create();

export const logout = () => {
  secureLocalStorage.removeItem(ACCESS_TOKEN);
  secureLocalStorage.removeItem(REFRESH_TOKEN);
  useStore.getState().resetStore();
};

axiosInstance.interceptors.request.use(
  (config) => {
    const sessionId = useStore.getState().sessionId;
    const accessToken = secureLocalStorage.getItem(ACCESS_TOKEN);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      config.headers['X-Session-ID'] = sessionId;
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

    if (
      error.response.status === UNAUTHORIZED_STATUS_CODE &&
      error.response.data.detail === TOKEN_EXPIRED
    ) {
      originalRequest._retry = true;

      const refreshToken = secureLocalStorage.getItem(REFRESH_TOKEN);
      if (!refreshToken) {
        logout();
      } else {
        return axios
          .post(REFRESH, { token: refreshToken })
          .then(({ data }) => {
            secureLocalStorage.setItem(ACCESS_TOKEN, data.accessToken);
            secureLocalStorage.setItem(REFRESH_TOKEN, data.refreshToken);
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            return axios(originalRequest);
          })
          .catch((err) => {
            console.error(err);
            logout();
          });
      }
    }
    return Promise.reject(error);
  }
);
