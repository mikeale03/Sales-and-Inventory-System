import { create } from 'zustand';

interface State {
  state: {
    selectedDate: Date;
    userOption: string;
    selectedPeriod: string;
    startDate: Date;
    endDate: Date;
  };
  setState: (update: Partial<State['state']>) => void;
}

const useExpensesFilterStore = create<State>((set) => ({
  state: {
    selectedDate: new Date(),
    userOption: '',
    selectedPeriod: 'Daily',
    startDate: new Date(new Date().setHours(0, 0, 0, 0)),
    endDate: new Date(new Date().setHours(23, 59, 59, 999)),
  },
  setState: (update) =>
    set((state) => ({ state: { ...state.state, ...update } })),
}));

export default useExpensesFilterStore;
