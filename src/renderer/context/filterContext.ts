import { createContext } from 'react';

export type Filter = {
  userOption: string;
  selectedPeriod: string;
  selectedDate: Date;
  startDate: Date;
  endDate: Date;
};

export type GcashFilter = {
  userOption: string;
  selectedPeriod: string;
  selectedType?: 'cash in' | 'cash out';
  selectedDateFilter: 'Date Transacted' | 'Date Created';
  selectedDate: Date;
  startDate: Date;
  endDate: Date;
};

const FilterContext = createContext<{
  salesFilter: Filter;
  setSalesFilter: (salesFilter: Filter) => void;
  gcashTransFilter: GcashFilter;
  setGcashTransFilter: (gcashFilter: GcashFilter) => void;
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
    selectedDateFilter: 'Date Transacted',
    selectedType: undefined,
    startDate: new Date(new Date().setHours(0, 0, 0, 0)),
    endDate: new Date(new Date().setHours(23, 59, 59, 999)),
  },
  setGcashTransFilter: () => {},
});

export default FilterContext;
