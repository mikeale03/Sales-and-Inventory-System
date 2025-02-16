export type Source = 'gcash' | 'other';

export type MobileLoad = {
  _id: string;
  number: string;
  amount: number;
  charge: number;
  total_amount: number;
  date_transacted: Date;
  source: Source;
  date_created: Date;
  date_updated?: Date;
  transact_by: string;
  transact_by_user_id: string;
  updated_by?: string;
  updated_by_id?: string;
  transaction_id: string;
};

export type GetMobileLoadsResponse = MobileLoad & {
  numberName: string;
};

export type CreateMobileLoadParams = {
  number: string;
  amount: number;
  charge: number;
  total_amount: number;
  date_transacted: Date;
  source: Source;
  transact_by: string;
  transact_by_user_id: string;
  transaction_id: string;
};

export type CreateMobileLoadData = {
  number: string;
  amount: number;
  charge: number;
  total_amount: number;
  date_transacted: Date;
  source: Source;
  date_created: Date;
  transact_by: string;
  transact_by_user_id: string;
  transaction_id: string;
};

export type MobileLoadFilterParams = {
  transactBy?: string;
  source?: string;
  startDate?: Date;
  endDate?: Date;
  mobileNumber?: string;
};
