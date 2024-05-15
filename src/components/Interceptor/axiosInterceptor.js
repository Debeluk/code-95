import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import { REFRESH } from '../../constants/ApiURL.js';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants/authConstants.js';
import { TOKEN_EXPIRED, UNAUTHORIZED_STATUS_CODE } from '../../constants/ErrorConstants.js';

export const axiosInstance = axios.create();

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

    if (
      error.response.status === UNAUTHORIZED_STATUS_CODE &&
      error.response.data.detail === TOKEN_EXPIRED
    ) {
      originalRequest._retry = true;

      const refreshToken = secureLocalStorage.getItem(REFRESH_TOKEN);
      // if (!refreshToken) {
      //   logout();
      // } else {
      //   return axios
      //     .post(REFRESH, { token: refreshToken })
      //     .then(({ data }) => {
      //       secureLocalStorage.setItem(ACCESS_TOKEN, data.accessToken);
      //       secureLocalStorage.setItem(REFRESH_TOKEN, data.refreshToken);
      //       originalRequest.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMDAwMDAsImV4cCI6MTcxNTU0MTIyOH0.-i3ccvo8geK6NqUNletuaV6AFZOPQdWZuQ8WMlL9thk`;
      //       return axios(originalRequest);
      //     })
      //     .catch((err) => {
      //       //logout()
      //       return Promise.reject(err);
      //     })
      //     .finally(() => {
      //       isRefreshing = false;
      //     });
      // }
      return axios
        .post(REFRESH,{}, {
          headers: {
            Authorization: `Bearer ${refreshToken}`
          }
        })
        .then(({ data }) => {
          secureLocalStorage.setItem(ACCESS_TOKEN, data.accessToken);
          secureLocalStorage.setItem(REFRESH_TOKEN, data.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return axios(originalRequest);
        })
        .catch((err) => {
          //logout()
          return Promise.reject(err);
        });
    }
    return Promise.reject(error);
  }
);
