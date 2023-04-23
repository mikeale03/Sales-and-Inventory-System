/* eslint-disable no-restricted-syntax */
import Realm from 'realm';
import { Response } from '../../globalTypes/realm/response.types';
import { openProductsRealm, Product } from './productsRealm';
import { Gcash } from '../../globalTypes/realm/gcash.types';

const PRODUCTS = 'Products';
const SALES = 'Sales';

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

export class SalesSchema extends Realm.Object {
  static schema: Realm.ObjectSchema = {
    name: SALES,
    properties: {
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      product_id: { type: 'string', indexed: true },
      product_name: { type: 'string', indexed: true },
      quantity: 'int',
      price: 'float',
      total_price: 'float',
      payment: 'string',
      date_created: { type: 'date', indexed: true },
      transact_by: 'string',
      transact_by_user_id: { type: 'string', indexed: true },
      transaction_id: { type: 'string', indexed: true },
    },
    primaryKey: '_id',
  };
}

export const openSalesRealm = async () => {
  const sales = await Realm.open({
    path: '../realm/sales',
    schema: [SalesSchema],
    schemaVersion: 4,
  });
  return sales;
};

export const createSales = async (
  sales: Omit<Sales, '_id'>[],
  salesRealm?: Realm
) => {
  const realm = salesRealm || (await openSalesRealm());

  realm.write(() => {
    sales.forEach((sale) => {
      realm.create<Sales>(SALES, sale);
    });
  });
};

export const salesPurchase = async (
  items: { _id: string; quantity: number }[],
  transactBy: string,
  transactByUserId: string,
  payment: 'cash' | 'gcash',
  transactionId: string
) => {
  let productsRealm: Realm | undefined;
  let salesRealm: Realm | undefined;
  try {
    productsRealm = await openProductsRealm();
    salesRealm = await openSalesRealm();
    items.forEach((item) => {
      const product = productsRealm?.objectForPrimaryKey<Product>(
        PRODUCTS,
        new Realm.BSON.ObjectID(item._id)
      );
      if (product) {
        const total_price = item.quantity * product.price;
        salesRealm?.write(() => {
          salesRealm?.create<Sales>(SALES, {
            product_id: product._id.toString(),
            product_name: product.name,
            quantity: item.quantity,
            price: product.price,
            total_price,
            payment,
            date_created: new Date(),
            transact_by: transactBy,
            transact_by_user_id: transactByUserId,
            transaction_id: transactionId,
          });
        });
        productsRealm?.write(() => {
          product.quantity -= item.quantity;
          product.last_transaction_date = new Date();
        });
      }
    });

    productsRealm?.close();
    salesRealm?.close();

    return {
      isSuccess: true,
      message: 'Successfully purchased the products',
    };
  } catch (error) {
    productsRealm?.close();
    salesRealm?.close();
    return {
      isSuccess: false,
      message: 'Failed to purchase products',
      error,
    };
  }
};

export const getSalesByProducts = async (filter?: {
  transactBy?: string;
  startDate?: Date;
  endDate?: Date;
}): Promise<Response<Sales[]>> => {
  let realm: Realm | undefined;
  try {
    realm = await openSalesRealm();
    let sales = realm.objects<Sales>(SALES);

    const transactBy = filter?.transactBy;
    const startDate = filter?.startDate;
    const endDate = filter?.endDate;

    const query: string[] = [];
    const args = [];

    if (transactBy) {
      query.push(`transact_by == $${args.length}`);
      args.push(transactBy);
    }
    if (startDate) {
      query.push(`date_created >= $${args.length}`);
      args.push(startDate);
    }
    if (endDate) {
      query.push(`date_created <= $${args.length}`);
      args.push(endDate);
    }
    sales = args.length ? sales.filtered(query.join(' && '), ...args) : sales;

    const salesMap = new Map<string, Sales>();
    const result: Sales[] = [];

    sales.forEach((sale) => {
      const saleObj = sale.toJSON() as Sales;
      saleObj._id = saleObj._id.toString();
      const { product_name, quantity, total_price } = saleObj;

      if (salesMap.has(product_name)) {
        const item = salesMap.get(product_name);
        item &&
          salesMap.set(product_name, {
            ...item,
            quantity: item.quantity + quantity,
            total_price: item.total_price + total_price,
          });
      } else {
        salesMap.set(product_name, saleObj);
      }
    });
    const values = salesMap.values();
    let entry: IteratorResult<any, any> | undefined;
    do {
      entry = values.next();
      entry.value && result.push(entry.value);
    } while (!entry.done);

    realm?.close();
    return {
      isSuccess: true,
      message: 'Successfully get sales',
      result,
    };
  } catch (error) {
    realm?.close();
    return {
      isSuccess: false,
      message: 'Failed to get sales',
      error,
    };
  }
};

export const getSalesByTransactions = async (filter?: {
  transactByUserId?: string;
  startDate?: Date;
  endDate?: Date;
  productName?: string;
}): Promise<Response<Sales[]>> => {
  let realm: Realm | undefined;
  try {
    realm = await openSalesRealm();
    let sales = realm.objects<Sales>(SALES);

    const transactBy = filter?.transactByUserId;
    const startDate = filter?.startDate;
    const endDate = filter?.endDate;
    const productName = filter?.productName;

    const query: string[] = [];
    const args = [];

    if (productName) {
      query.push(`product_name CONTAINS[c] $${args.length}`);
      args.push(productName);
    }

    if (transactBy) {
      query.push(`transact_by_user_id == $${args.length}`);
      args.push(transactBy);
    }
    if (startDate) {
      query.push(`date_created >= $${args.length}`);
      args.push(startDate);
    }
    if (endDate) {
      query.push(`date_created <= $${args.length}`);
      args.push(endDate);
    }
    sales = args.length
      ? sales.filtered(`${query.join(' && ')} SORT(date_created DESC)`, ...args)
      : sales;
    const salesObj = sales.toJSON() as Sales[];
    realm?.close();
    return {
      isSuccess: true,
      message: 'Successfully get sales',
      result: salesObj.map((sale) => ({ ...sale, _id: sale._id.toString() })),
    };
  } catch (error) {
    realm?.close();
    return {
      isSuccess: false,
      message: 'Failed to get sales',
      error,
    };
  }
};

export const deleteSale = async (salesId: string) => {
  let salesRealm: Realm | undefined;
  let productsRealm: Realm | undefined;
  try {
    salesRealm = await openSalesRealm();
    productsRealm = await openProductsRealm();
    let sale = salesRealm.objectForPrimaryKey<Sales>(
      SALES,
      new Realm.BSON.ObjectID(salesId)
    );
    if (!sale) {
      salesRealm?.close();
      return {
        isSuccess: false,
        message: 'Sale id not found',
      };
    }
    const product =
      sale.product_id === 'gcash'
        ? null
        : productsRealm.objectForPrimaryKey<Product>(
            PRODUCTS,
            new Realm.BSON.ObjectID(sale.product_id)
          );

    if (product) {
      productsRealm.write(() => {
        product.quantity += sale?.quantity || 0;
      });
    }
    salesRealm.write(() => {
      salesRealm?.delete(sale);
      sale = null;
    });

    salesRealm?.close();
    productsRealm.close();
    return {
      isSuccess: true,
      message: 'Successfully deleted a sale',
    };
  } catch (error) {
    salesRealm?.close();
    productsRealm?.close();
    return {
      isSuccess: false,
      message: 'Failed to delete sale',
      error,
    };
  }
};

export const updateSalesByGcashTransDelete = async (gcashTrans: Gcash) => {
  const { _id, transaction_id, type, is_product_gcash_pay, related_gcash_id } =
    gcashTrans;
  let realm: Realm | undefined;
  let query = `product_id == '${
    type === 'gcash pay' ? related_gcash_id : _id
  }'`;
  try {
    if (!transaction_id) throw new Error('No transaction id');

    if (is_product_gcash_pay) {
      query = `transaction_id == '${transaction_id}'`;
    }

    realm = await openSalesRealm();
    const sales = realm?.objects<Sales>(SALES).filtered(query);
    if (sales.length === 0) throw new Error('No sales found');
    let product_name = '';
    realm.write(() => {
      if (type === 'gcash pay')
        for (const sale of sales) {
          sale.payment = 'cash';
        }
      else {
        product_name = sales[0].product_name;
        realm?.delete(sales);
      }
    });
    const message =
      type === 'gcash pay'
        ? 'Sales payment type is updated'
        : `Sales with product name ${product_name} is deleted`;
    realm?.close();

    return {
      isSuccess: true,
      message,
    };
  } catch (error) {
    realm?.close();
    return {
      isSuccess: false,
      message: 'Failed to update sales',
      error,
    };
  }
};
