import { create } from 'zustand';

export const useStore = create((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  courses: [],
  setCourses: (courses) => set({ courses: courses }),
  selectedCourse: null,
  setSelectedCourse: (course) => set({ selectedCourse: course }),
  resetStore: () =>
    set({
      currentUser: null,
      courses: [],
      selectedCourse: null,
      selectedQuestionType: null,
      selectedQuestionTicket: null,
      backupLoaded: true,
      isSelectedRandomQuestions: null
    }),
  deselectCourse: () =>
    set({
      selectedCourse: null
    }),
  isSelectedRandomQuestions: null,
  selectedQuestionTicket: null,
  selectRandomQuestions: (type) => set({ isSelectedRandomQuestions: type }),
  setQuestionTicket: (ticket) => set({ selectedQuestionTicket: ticket }),
  backupLoaded: false,
  clearSelectedQuestionTicket: () =>
    set({
      selectedQuestionTicket: null,
      isSelectedRandomQuestions: null
    })
}));
