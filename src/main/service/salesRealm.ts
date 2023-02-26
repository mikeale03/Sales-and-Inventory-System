import Realm from 'realm';
import { Response } from '../../globalTypes/realm/response.types';
import { openProductsRealm, Product } from './productsRealm';

const PRODUCTS = 'Products';
const SALES = 'Sales';

export type Sales = {
  _id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  total_price: number;
  date_created: Date;
  transact_by: string;
  transact_by_user_id: string;
};

export class SalesSchema extends Realm.Object {
  static schema = {
    name: SALES,
    properties: {
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      product_id: 'string',
      product_name: 'string',
      quantity: 'int',
      price: 'float',
      total_price: 'float',
      date_created: 'date',
      transact_by: 'string',
      transact_by_user_id: 'string',
    },
    primaryKey: '_id',
  };
}

export const openSalesRealm = async () => {
  const sales = await Realm.open({
    path: 'realm/sales',
    schema: [SalesSchema],
    // schemaVersion: 4,
    deleteRealmIfMigrationNeeded: true,
  });
  return sales;
};

export const salesPurchase = async (
  items: { _id: string; quantity: number }[],
  transactBy: string,
  transactByUserId: string
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
        salesRealm?.write(() => {
          salesRealm?.create<Sales>(SALES, {
            product_id: product._id.toString(),
            product_name: product.name,
            quantity: item.quantity,
            price: product.price,
            total_price: item.quantity * product.price,
            date_created: new Date(),
            transact_by: transactBy,
            transact_by_user_id: transactByUserId,
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
}): Promise<Response<Sales[]>> => {
  let realm: Realm | undefined;
  try {
    realm = await openSalesRealm();
    let sales = realm.objects<Sales>(SALES);

    const transactBy = filter?.transactByUserId;
    const startDate = filter?.startDate;
    const endDate = filter?.endDate;

    const query: string[] = [];
    const args = [];

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
    sales = args.length ? sales.filtered(query.join(' && '), ...args) : sales;
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
