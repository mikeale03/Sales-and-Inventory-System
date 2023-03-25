import { Sales } from 'globalTypes/realm/sales.types';
import Realm, { ObjectSchema } from 'realm';
import {
  Gcash,
  GcashCreate,
  GcashTransFilter,
} from '../../globalTypes/realm/gcash.types';
import { Response } from '../../globalTypes/realm/response.types';
import { create } from './realm';
import { createSales, openSalesRealm } from './salesRealm';

const GCASH = 'Gcash';

export class GcashSchema extends Realm.Object {
  static schema: ObjectSchema = {
    name: GCASH,
    properties: {
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      type: 'string',
      amount: 'float',
      charge: 'float',
      number: 'string?',
      date_created: 'date',
      transact_by: 'string',
      transact_by_user_id: 'string',
      updated_by: 'string?',
      updated_by_user_id: 'string?',
      date_updated: 'date?',
    },
    primaryKey: '_id',
  };
}

export const openGcashRealm = async () => {
  try {
    const realm = await Realm.open({
      path: '../realm/gcash',
      schema: [GcashSchema],
    });
    return realm;
  } catch (error) {
    return undefined;
  }
};

export const createGcashTransactions = async (
  gcashTrans: GcashCreate[]
): Promise<Response<Gcash[]>> => {
  let salesRealm: Realm | undefined;
  const realm = await openGcashRealm();
  if (!realm)
    return {
      isSuccess: false,
      message: 'Error opening realm db',
    };
  const trans: Gcash[] = [];
  const sales: Omit<Sales, '_id'>[] = [];
  try {
    gcashTrans.forEach((gcashTran) => {
      const task = create(realm, GCASH, {
        ...gcashTran,
        date_created: new Date(),
      });

      if (gcashTran.charge_payment === 'gcash') {
        const task2 = create(realm, GCASH, {
          type: 'gcash pay',
          amount: gcashTran.charge,
          charge: 0,
          transact_by: gcashTran.transact_by,
          transact_by_user_id: gcashTran.transact_by_user_id,
          date_created: new Date(),
        });
        trans.push(task2?.toJSON() as Gcash);
      }

      trans.push(task?.toJSON() as Gcash);
      task &&
        task.type !== 'gcash pay' &&
        sales.push({
          product_id: 'gcash',
          product_name: `GCash-${task.type === 'cash in' ? 'In' : 'Out'} - ${
            gcashTran.amount
          }`,
          quantity: 1,
          price: gcashTran.charge,
          total_price: gcashTran.charge,
          payment: gcashTran.charge_payment,
          date_created: new Date(),
          transact_by: gcashTran.transact_by,
          transact_by_user_id: gcashTran.transact_by_user_id,
        });
    });
    // const newGcash = task?.toJSON() as Gcash;
    if (sales.length) {
      salesRealm = await openSalesRealm();
      createSales(sales, salesRealm);
      salesRealm.close();
    }
    realm.close();
    salesRealm?.close();
    return {
      isSuccess: true,
      message: 'Successfully created a gcash transaction',
      result: trans.map((newGcash) => ({
        ...newGcash,
        _id: newGcash._id.toString(),
      })),
    };
  } catch (error) {
    realm.close();
    salesRealm?.close();
    return {
      isSuccess: false,
      message: 'Failed to create a gcash transaction',
      error,
    };
  }
};

export const createGcashTransQuery = (filter: GcashTransFilter) => {
  const { transactBy, startDate, endDate, number, type } = filter;
  const query: string[] = [];
  const params = [];

  if (number) {
    query.push(`number CONTAINS[c] $${params.length}`);
    params.push(number);
  }
  if (transactBy) {
    query.push(`transact_by_user_id == $${params.length}`);
    params.push(transactBy);
  }
  if (type) {
    query.push(`type == $${params.length}`);
    params.push(type);
  }
  if (startDate) {
    query.push(`date_created >= $${params.length}`);
    params.push(startDate);
  }
  if (endDate) {
    query.push(`date_created <= $${params.length}`);
    params.push(endDate);
  }

  return {
    query: query.join(' && '),
    params,
  };
};

export const getGcashTransactions = async (
  filter?: GcashTransFilter
): Promise<Response<Gcash[]>> => {
  const realm = await openGcashRealm();
  if (!realm)
    return {
      isSuccess: false,
      message: 'Error opening realm db',
    };
  try {
    const task = realm?.objects<Gcash>(GCASH);
    const query = filter && createGcashTransQuery(filter);
    const filtered = query?.query
      ? task.filtered(query.query, ...query.params)
      : task;
    const gcashTrans = filtered.toJSON() as Gcash[];
    realm.close();
    return {
      isSuccess: true,
      message: 'Successfully get GCash transactions',
      result: gcashTrans.map((item) => ({
        ...item,
        _id: item._id.toString(),
      })),
    };
  } catch (error) {
    realm.close();
    return {
      isSuccess: false,
      message: 'Failed to get GCash transactions',
      error,
    };
  }
};
