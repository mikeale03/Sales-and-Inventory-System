import { GcashAccount } from 'globalTypes/realm/gcashAccount.types';
import { getSelectedGcashAccountStorage } from 'renderer/service/localStorage';
import { create } from 'zustand';

const account = getSelectedGcashAccountStorage();

interface State {
  selectedGcashAccount: GcashAccount | null | '';
  setSelectedGcashAccount: (accounts: GcashAccount | '') => void;
}

const useSelectedGcashAccountStore = create<State>((set) => ({
  selectedGcashAccount: account,
  setSelectedGcashAccount: (selectedGcashAccount) =>
    set(() => ({ selectedGcashAccount })),
}));

export default useSelectedGcashAccountStore;
