import { useStore } from './store.js';
import secureLocalStorage from 'react-secure-storage';
import { ACCESS_TOKEN, APP_STATE, REFRESH_TOKEN } from '../constants/authConstants.js';

export const saveState = () => {
  secureLocalStorage.setItem(APP_STATE, useStore.getState());
  console.log('saved state');
};

export const loadState = () => {
  const savedState = secureLocalStorage.getItem(APP_STATE);
  if (savedState) {
    useStore.setState({ ...savedState, sessionId: null, websocketConnectionFailed: false });
  } else {
    console.log('No saved state to load or invalid state.');
  }
  useStore.setState({
    backupLoaded: true,
    selectedCourse: null,
    selectedQuestionTicket: null,
    selectedQuestionType: null,
    accessToken: secureLocalStorage.getItem(ACCESS_TOKEN),
    refreshToken: secureLocalStorage.getItem(REFRESH_TOKEN)
  });
  secureLocalStorage.removeItem(APP_STATE);
};
