/* eslint-disable lines-between-class-members */
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

export class GcashSchema extends Realm.Object<Gcash> {
  static schema: ObjectSchema = {
    name: GCASH,
    properties: {
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      type: 'string',
      amount: 'float',
      charge: 'float',
      number: 'string?',
      date_transacted: { type: 'date?', indexed: true },
      date_created: { type: 'date', indexed: true },
      transact_by: 'string',
      transact_by_user_id: 'string',
      updated_by: 'string?',
      updated_by_user_id: 'string?',
      date_updated: 'date?',
      transaction_id: 'string',
      is_product_gcash_pay: 'bool?',
      charge_payment: 'string',
      related_gcash_id: 'string?',
      note: 'string?',
      gcash_balance: 'float',
    },
    primaryKey: '_id',
  };
}

export const openGcashRealm = async () => {
  try {
    const realm = await Realm.open({
      path: '../realm/gcash',
      schema: [GcashSchema],
      schemaVersion: 6,
    });
    return realm;
  } catch (error) {
    return undefined;
  }
};

export const getGcashBeforeDate = (
  gcashObjects: Realm.Results<Gcash>,
  date: Date
) => {
  const result = gcashObjects.filtered(
    'date_transacted != $0 AND date_transacted <= $1 SORT(date_transacted DESC) LIMIT(1)',
    null,
    date
  );

  return result.length ? result[0] : null;
};

export const addBalanceFromDate = (
  gcashRealm: Realm,
  gcashObjects: Realm.Results<Gcash>,
  date: Date,
  amount: number
) => {
  const transactions = gcashObjects.filtered(
    'date_transacted != $0 AND date_transacted > $1',
    null,
    date
  );
  gcashRealm.write(() => {
    for (const tran of transactions) {
      tran.gcash_balance = tran.gcash_balance
        ? +(tran.gcash_balance + amount).toFixed(2)
        : amount;
    }
  });
  return transactions;
};

export const deductBalanceFromDate = (
  gcashRealm: Realm,
  gcashObjects: Realm.Results<Gcash>,
  date: Date,
  amount: number
) => {
  const transactions = gcashObjects.filtered(
    'date_transacted != $0 AND date_transacted > $1',
    null,
    date
  );
  gcashRealm.write(() => {
    for (const tran of transactions) {
      tran.gcash_balance = tran.gcash_balance
        ? +(tran.gcash_balance - amount).toFixed(2)
        : 0 - amount;
    }
  });
  return transactions;
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
      const { date_transacted, type, amount } = gcashTran;
      const gcashObjects = realm.objects<Gcash>(GCASH);
      const { gcash_balance = 0 } =
        getGcashBeforeDate(gcashObjects, date_transacted) ?? {};

      let balance = gcash_balance;

      if (type === 'cash in' || type === 'deduct balance') {
        balance = +(gcash_balance - amount).toFixed(2);
        deductBalanceFromDate(realm, gcashObjects, date_transacted, amount);
      } else if (type === 'cash out' || type === 'add balance') {
        balance = +(gcash_balance + amount).toFixed(2);
        addBalanceFromDate(realm, gcashObjects, date_transacted, amount);
      }

      const data = {
        ...gcashTran,
        date_created: new Date(),
        gcash_balance: balance,
      };

      const task = create<typeof data & { _id?: string; date_created: Date }>(
        realm,
        GCASH,
        data
      );

      // if (gcashTran.charge_payment === 'gcash') {
      //   const task2 = create<Omit<Gcash, '_id'>>(realm, GCASH, {
      //     type: 'gcash pay',
      //     amount: gcashTran.charge,
      //     charge: 0,
      //     transact_by: gcashTran.transact_by,
      //     transact_by_user_id: gcashTran.transact_by_user_id,
      //     date_created: new Date(),
      //     transaction_id: gcashTran.transaction_id,
      //     related_gcash_id: task?._id?.toString(),
      //   });
      //   trans.push(task2?.toJSON() as Gcash);
      // }

      trans.push(task?.toJSON() as Gcash);
      task &&
        task.type !== 'gcash pay' &&
        sales.push({
          product_id: task._id?.toString() ?? 'gcash',
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
          transaction_id: gcashTran.transaction_id,
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
    console.log(error);
    return {
      isSuccess: false,
      message: 'Failed to create a gcash transaction',
      error,
    };
  }
};

export const createGcashTransQuery = (filter: GcashTransFilter) => {
  const { transactBy, startDate, endDate, number, type, dateFilter } = filter;
  const query: string[] = [];
  const params = [];
  const dateField =
    dateFilter === 'Date Created' ? 'date_created' : 'date_transacted';

  if (number) {
    query.push(
      `(number CONTAINS[c] $${params.length} || amount == $${
        params.length + 1
      })`
    );
    params.push(number);
    params.push(+number);
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
    query.push(`${dateField} >= $${params.length}`);
    params.push(startDate);
  }
  if (endDate) {
    query.push(`${dateField} <= $${params.length}`);
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
    const { dateFilter } = filter ?? {};
    const sortFilter =
      dateFilter === 'Date Created'
        ? 'SORT(date_created ASC)'
        : 'SORT(date_transacted ASC)';

    const query = filter && createGcashTransQuery(filter);
    const filtered = query?.query
      ? task.filtered(`${query.query} ${sortFilter}`, ...query.params)
      : task;
    // console.log(filtered[0].date_transacted);
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
    console.log(error);
    realm.close();
    return {
      isSuccess: false,
      message: 'Failed to get GCash transactions',
      error,
    };
  }
};

export const deleteGcashTransaction = async (
  id: string
): Promise<Response<undefined>> => {
  const realm = await openGcashRealm();
  if (!realm)
    return {
      isSuccess: false,
      message: 'Error opening Sales realm db',
    };
  try {
    let gcash = realm.objectForPrimaryKey<Gcash>(
      GCASH,
      new Realm.BSON.ObjectID(id)
    );
    if (!gcash) {
      realm.close();
      return {
        isSuccess: false,
        message: 'GCash transaction not found',
      };
    }
    const gcashObjects = realm.objects<Gcash>(GCASH);
    if (gcash.type === 'cash in' || gcash.type === 'deduct balance') {
      gcash.date_transacted &&
        addBalanceFromDate(
          realm,
          gcashObjects,
          gcash.date_transacted,
          gcash.amount
        );
    } else if (gcash.type === 'cash out' || gcash.type === 'add balance') {
      gcash.date_transacted &&
        deductBalanceFromDate(
          realm,
          gcashObjects,
          gcash.date_transacted,
          gcash.amount
        );
    }

    realm.write(() => {
      realm.delete(gcash);
      gcash = null;
    });
    realm?.close();
    return {
      isSuccess: true,
      message: 'Successfully deleted a GCash transaction',
    };
  } catch (error) {
    realm?.close();
    return {
      isSuccess: false,
      message: 'Failed to delete a GCash transaction',
      error,
    };
  }
};

export const getLatestBalance = async () => {
  const realm = await openGcashRealm();
  if (!realm)
    return {
      isSuccess: false,
      message: 'Error opening Sales realm db',
    };
  try {
    const task = realm?.objects<Gcash>(GCASH);
    const latestGcash = task.filtered(
      'date_transacted != $0 SORT(date_transacted DESC) LIMIT(1)',
      null
    );
    const balance = latestGcash[0].gcash_balance;
    realm.close();
    return {
      isSuccess: true,
      message: 'Successfully get GCash Balance',
      result: balance,
    };
  } catch (error) {
    realm.close();
    return {
      isSuccess: false,
      message: 'Failed to get GCash Balance',
      error,
    };
  }
};
