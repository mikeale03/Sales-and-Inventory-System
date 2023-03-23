export type Gcash = {
  _id: string;
  type: 'cash in' | 'cash out' | 'gcash pay';
  amount: number;
  charge: number;
  number?: string;
  date_created: Date;
  transact_by: string;
  transact_by_user_id: string;
  updated_by?: string;
  updated_by_user_id?: string;
};

export type GcashCreate = Omit<Gcash, '_id' | 'date_created'>;

export type GcashTransFilter = {
  transactBy?: string;
  startDate?: Date;
  endDate?: Date;
  number?: string;
  type?: 'cash in' | 'cash out' | 'gcash pay';
};
