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
  transaction_id: string;
  is_product_gcash_pay?: boolean;
  related_gcash_id?: string;
  charge_payment: 'cash' | 'gcash';
};

export type GcashCreate = Omit<Gcash, '_id' | 'date_created'> & {
  charge_payment: 'cash' | 'gcash';
};

export type GcashTransFilterType = 'cash in' | 'cash out' | undefined;

export type GcashTransFilter = {
  transactBy?: string;
  startDate?: Date;
  endDate?: Date;
  number?: string;
  type?: GcashTransFilterType;
};
