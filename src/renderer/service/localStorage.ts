import { GcashAccount } from 'globalTypes/realm/gcashAccount.types';

export const setSelectedGcashAccountStorage = (account: GcashAccount) => {
  localStorage.setItem('selected-gcash-account', JSON.stringify(account));
};

export const getSelectedGcashAccountStorage = () => {
  const data = localStorage.getItem('selected-gcash-account');
  return data && (JSON.parse(data) as GcashAccount);
};
