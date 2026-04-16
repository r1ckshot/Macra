import { create } from 'zustand';
import { format } from 'date-fns';

interface DiaryState {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  resetToToday: () => void;
}

export const useDiaryStore = create<DiaryState>((set) => ({
  selectedDate: format(new Date(), 'yyyy-MM-dd'),
  setSelectedDate: (date) => set({ selectedDate: date }),
  resetToToday: () => set({ selectedDate: format(new Date(), 'yyyy-MM-dd') }),
}));
