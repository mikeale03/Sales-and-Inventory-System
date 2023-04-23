export type Sales = {
  _id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  total_price: number;
  payment: 'cash' | 'gcash';
  date_created: Date;
  transact_by: string;
  transact_by_user_id: string;
  transaction_id: string;
};
