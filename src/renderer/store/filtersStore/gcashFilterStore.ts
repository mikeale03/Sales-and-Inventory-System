import { create } from 'zustand';

interface State {
  state: {
    selectedDate: Date;
    userOption: string;
    selectedPeriod: string;
    selectedType?: 'cash in' | 'cash out';
    selectedDateFilter: 'Date Transacted' | 'Date Created';
    startDate: Date;
    endDate: Date;
  };
  setState: (update: Partial<State['state']>) => void;
}

const now = new Date();
const startDate = new Date();
const endDate = new Date();
const hours = now.getHours();

if (hours >= 0 && hours <= 7) {
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(7, 0, 0, 0);
} else if (hours >= 7 && hours <= 16) {
  startDate.setHours(7, 0, 0, 0);
  endDate.setHours(16, 0, 0, 0);
} else if (hours >= 16) {
  startDate.setHours(16, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);
}

const useGcashFilterStore = create<State>((set) => ({
  state: {
    selectedDate: new Date(),
    userOption: '',
    selectedPeriod: 'Daily',
    selectedDateFilter: 'Date Transacted',
    selectedType: undefined,
    startDate,
    endDate,
  },
  setState: (update) =>
    set((state) => ({ state: { ...state.state, ...update } })),
}));

export default useGcashFilterStore;
