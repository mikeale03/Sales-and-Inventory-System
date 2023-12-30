export type Expense = {
  _id: string;
  type: string;
  amount: number;
  description?: string;
  charge_to_user_id?: string;
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
  transact_by: string;
  transact_by_user_id: string;
};

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
