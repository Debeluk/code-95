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
  backupLoaded: false,
  setCourses: (courses) => set({ courses: courses }),
  setCurrentUser: (user) => set({ currentUser: user }),
  setSelectedCourse: (course) => set({ selectedCourse: course }),
  setAccessToken: (token) => set({ accessToken: token }),
  setRefreshToken: (token) => set({ refreshToken: token }),
  setSessionId: (id) => set({ sessionId: id }),
  setWebsocketConnectionFailed: (value) => set({ websocketConnectionFailed: value }),
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
      websocketConnectionFailed: false
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
    })
}));
