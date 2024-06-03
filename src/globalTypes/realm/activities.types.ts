import { Gcash } from './gcash.types';
import { ProductForm } from './products.types';
import { Sales } from './sales.types';

export type Activity = {
  _id: string;
  date_created: Date;
  activity: string;
  transaction_type: string;
  details: string;
  transact_by: string;
  transact_by_user_id: string;
};

export type ProductEditDetails = {
  product_name: string;
  updates: {
    prop: string;
    from: string | number | boolean | undefined | null;
    to: string | number | boolean | undefined | null;
  }[];
};

export type CreateProductEditActivityParams = {
  oldProduct: ProductForm;
  newProduct: ProductForm;
  transact_by: string;
  transact_by_user_id: string;
};

export type CreateProductAddActivityParams = {
  product: ProductForm;
  transact_by: string;
  transact_by_user_id: string;
};

export type CreateProductAddQtyActivityParams = {
  product_name: string;
  quantity: number;
  transact_by: string;
  transact_by_user_id: string;
};

export type CreateSalesDeleteActivityParams = {
  sales: Sales;
  transact_by: string;
  transact_by_user_id: string;
};

export type CreateSalesVoidActivityParams = {
  sales: Sales;
  transact_by: string;
  transact_by_user_id: string;
  void_by: string;
  void_by_user_id: string;
};

export type CreateGcashTransDeleteActivityParams = {
  gcash: Gcash;
  transact_by: string;
  transact_by_user_id: string;
  reason: string;
};

export type GetActivitiesFilter = {
  transactBy?: string;
  startDate?: Date;
  endDate?: Date;
};
