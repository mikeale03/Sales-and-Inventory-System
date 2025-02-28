export type Expense = {
  _id: string;
  type: string;
  amount: number;
  description?: string;
  charge_to_user_id?: string;
  charge_to_user?: string;
  status: 'paid' | 'unpaid';
  date_created: Date;
  transact_by: string;
  transact_by_user_id: string;
};

export type CreateExpenseRequest = {
  type: string;
  amount: number;
  description: string;
  charge_to_user_id?: string;
  charge_to_user?: string;
  status: 'paid' | 'unpaid';
  transact_by: string;
  transact_by_user_id: string;
};

export type CreateExpenseData = {
  type: string;
  amount: number;
  description: string;
  charge_to_user_id?: string;
  charge_to_user?: string;
  date_created: Date;
  status: 'paid' | 'unpaid';
  transact_by: string;
  transact_by_user_id: string;
};

export type UpdateExpenseRequest = { _id: string } & Partial<
  Omit<
    CreateExpenseData,
    'transact_by' | 'transact_by_user_id' | 'date_created'
  >
>;

export type GetExpensesFilter = {
  transactBy?: string;
  startDate?: Date;
  endDate?: Date;
  excludeItemCharge?: boolean;
  chargeToUser?: string;
};

export type ExpenseItem = {
  productId: string;
  productName: string;
  quantity: number;
  amount: number;
};

export type ExpenseDescriptionJson = {
  chargeToId: string;
  chargeToUser: string;
  items: ExpenseItem[];
};
