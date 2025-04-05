import { GcashAccount } from 'globalTypes/realm/gcashAccount.types';
import { create } from 'zustand';

interface State {
  gcashAccounts: GcashAccount[];
  setGcashAccounts: (accounts: GcashAccount[]) => void;
  isFetched: boolean;
}

const useGcashAccountStore = create<State>((set) => ({
  gcashAccounts: [],
  setGcashAccounts: (accounts) =>
    set(() => ({ gcashAccounts: accounts, isFetched: true })),
  isFetched: false,
}));

export default useGcashAccountStore;
