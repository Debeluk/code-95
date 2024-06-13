import { create } from 'zustand';

export const useStore = create((set) => ({
  accessToken: null,
  refreshToken: null,
  sessionId: null,
  currentUser: null,
  courses: [],
  selectedCourse: null,
  isSelectedRandomQuestions: null,
  selectedQuestionTicket: null,
  websocketConnectionFailed: false,
  needNavigateToSessionExists: false, // Новое состояние для контроля навигации
  backupLoaded: false,
  examOn: false,
  setCourses: (courses) => set({ courses }),
  setCurrentUser: (user) => set({ currentUser: user }),
  setSelectedCourse: (course) => set({ selectedCourse: course }),
  setAccessToken: (token) => set({ accessToken: token }),
  setRefreshToken: (token) => set({ refreshToken: token }),
  setSessionId: (id) => set({ sessionId: id }),
  setWebsocketConnectionFailed: (value) => set({ websocketConnectionFailed: value }),
  setNeedNavigateToSessionExists: (value) => set({ needNavigateToSessionExists: value }), // Функция для установки флага навигации
  resetStore: () =>
    set({
      currentUser: null,
      courses: [],
      selectedCourse: null,
      selectedQuestionType: null,
      selectedQuestionTicket: null,
      backupLoaded: true,
      isSelectedRandomQuestions: null,
      accessToken: null,
      refreshToken: null,
      sessionId: null,
      websocketConnectionFailed: false,
      needNavigateToSessionExists: false, // Сбросить флаг при сбросе хранилища
      examOn: false
    }),
  deselectCourse: () =>
    set({
      selectedCourse: null
    }),
  selectRandomQuestions: (type) => set({ isSelectedRandomQuestions: type }),
  setQuestionTicket: (ticket) => set({ selectedQuestionTicket: ticket }),
  clearSelectedQuestionTicket: () =>
    set({
      selectedQuestionTicket: null,
      isSelectedRandomQuestions: null
    }),
  setExamOn: (value) => set({ examOn: value })
}));
