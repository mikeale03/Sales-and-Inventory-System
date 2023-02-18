import Realm from 'realm';
import { IResponse } from '../../globalTypes/dbApi/response.types';
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
    },
    primaryKey: '_id',
  };
}

export const openSalesRealm = async () => {
  const sales = await Realm.open({
    path: 'realm/sales',
    schema: [SalesSchema],
    deleteRealmIfMigrationNeeded: true,
  });
  return sales;
};

export const salesPurchase = async (
  items: { _id: string; quantity: number }[],
  transactBy: string
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
          });
        });
        productsRealm?.write(() => {
          product.quantity -= item.quantity;
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
  transactBy: string;
  startDate: Date;
  endDate: Date;
}): Promise<IResponse<Sales[]>> => {
  let realm: Realm | undefined;
  try {
    realm = await openSalesRealm();
    let sales = realm.objects<Sales>(SALES);

    const transactBy = filter?.transactBy;
    const startDate = filter?.startDate;
    const endDate = filter?.endDate;

    let query = '';
    const args = [];

    if (transactBy) {
      query += `transact_by == $${args.length} `;
      args.push(transactBy);
    }
    if (startDate) {
      query += `start_date >= $${args.length} `;
      args.push(startDate);
    }
    if (startDate) {
      query += `end_date <= $${args.length} `;
      args.push(endDate);
    }

    sales = args.length ? sales.filtered(query, ...args) : sales;

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
