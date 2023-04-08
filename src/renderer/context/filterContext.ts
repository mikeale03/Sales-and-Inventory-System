import { createContext } from 'react';

export type Filter = {
  userOption: string;
  selectedPeriod: string;
  selectedDate: Date;
  startDate: Date;
  endDate: Date;
};

const FilterContext = createContext<{
  salesFilter: Filter;
  setSalesFilter: (salesFilter: Filter) => void;
  gcashTransFilter: Filter;
  setGcashTransFilter: (salesFilter: Filter) => void;
}>({
  salesFilter: {
    selectedDate: new Date(),
    userOption: '',
    selectedPeriod: 'Daily',
    startDate: new Date(new Date().setHours(0, 0, 0, 0)),
    endDate: new Date(new Date().setHours(23, 59, 59, 999)),
  },
  setSalesFilter: () => {},
  gcashTransFilter: {
    selectedDate: new Date(),
    userOption: '',
    selectedPeriod: 'Daily',
    startDate: new Date(new Date().setHours(0, 0, 0, 0)),
    endDate: new Date(new Date().setHours(23, 59, 59, 999)),
  },
  setGcashTransFilter: () => {},
});

export default FilterContext;
