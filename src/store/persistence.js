import { useStore } from './store.js';
import secureLocalStorage from 'react-secure-storage';
import { APP_STATE } from '../constants/authConstants.js';

export const saveState = () => {
  secureLocalStorage.setItem(APP_STATE, useStore.getState());
};

export const loadState = () => {
  const savedState = secureLocalStorage.getItem('appState');
  if (savedState) {
    useStore.setState(savedState);
  } else {
    console.log('No saved state to load or invalid state.');
  }
  useStore.setState({
    backupLoaded: true,
    selectedCourse: null,
    selectedQuestionTicket: null,
    selectedQuestionType: null
  });
  secureLocalStorage.removeItem(APP_STATE);
};
