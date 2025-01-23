import { create } from 'zustand';

interface State {
  hasItems: boolean;
  setHasItems: (val: boolean) => void;
}

const useCashRegisterStore = create<State>((set) => ({
  hasItems: false,
  setHasItems: (val) => set(() => ({ hasItems: val })),
}));

export default useCashRegisterStore;
