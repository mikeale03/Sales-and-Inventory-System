export type GcashType =
  | 'cash in'
  | 'cash out'
  | 'gcash pay'
  | 'add balance'
  | 'deduct balance'
  | 'mobile load';

export type Gcash = {
  _id: string;
  type: GcashType;
  amount: number;
  charge: number;
  number?: string;
  date_created: Date;
  date_transacted?: Date;
  transact_by: string;
  transact_by_user_id: string;
  updated_by?: string;
  updated_by_user_id?: string;
  transaction_id: string;
  is_product_gcash_pay?: boolean;
  related_gcash_id?: string;
  charge_payment: 'cash' | 'gcash';
  note?: string;
  gcash_balance: number;
};

export type GetGcashTransResponse = Gcash & { numberName: string };

export type GcashCreate = Omit<
  Gcash,
  '_id' | 'date_transacted' | 'date_created' | 'gcash_balance'
> & {
  charge_payment: 'cash' | 'gcash';
  date_transacted: Date;
};

export type GcashTransFilterType = 'cash in' | 'cash out' | undefined;

export type GcashTransDateFilterType = 'Date Transacted' | 'Date Created';

export type GcashTransFilter = {
  transactBy?: string;
  dateFilter: GcashTransDateFilterType;
  startDate?: Date;
  endDate?: Date;
  number?: string;
  type?: GcashTransFilterType;
};
