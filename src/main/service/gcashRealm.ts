/* eslint-disable lines-between-class-members */
import { Sales } from 'globalTypes/realm/sales.types';
import { MobileNumber } from 'globalTypes/realm/mobileNumber.types';
import { GcashAccount } from 'globalTypes/realm/gcashAccount.types';
import Realm, { ObjectSchema } from 'realm';
import {
  Gcash,
  GcashCreate,
  GcashTransFilter,
} from '../../globalTypes/realm/gcash.types';
import { Response } from '../../globalTypes/realm/response.types';
import { create } from './realm';
import { createSales, openSalesRealm } from './salesRealm';
import {
  addBalanceFromDate,
  adjustBalanceOnDelete,
  deductBalanceFromDate,
  getGcashBeforeDate,
} from './utils/gcashRealmHelper';
import { MOBILENUMBER, openMobileNumberRealm } from './mobileNumbersRealm';
import { GCASH_ACCOUNT, openGcashAccountRealm } from './gcashAccountRealm';

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
      account_number: 'string?',
    },
    primaryKey: '_id',
  };
}

export const openGcashRealm = async () => {
  try {
    const realm = await Realm.open({
      path: '../realm/gcash',
      schema: [GcashSchema],
      schemaVersion: 7,
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
      const {
        date_transacted,
        type,
        amount,
        charge_payment,
        charge,
        account_number,
      } = gcashTran;
      const gcashObjects = realm.objects<Gcash>(GCASH);
      const { gcash_balance = 0 } =
        getGcashBeforeDate(gcashObjects, date_transacted, account_number) ?? {};

      let balance = gcash_balance;

      if (
        type === 'cash in' ||
        type === 'deduct balance' ||
        type === 'mobile load'
      ) {
        balance = +(gcash_balance - amount).toFixed(2);
        deductBalanceFromDate(
          realm,
          gcashObjects,
          date_transacted,
          amount,
          account_number
        );
      } else if (type === 'cash out' || type === 'add balance') {
        const totalAmount =
          charge_payment === 'gcash' ? charge + amount : amount;

        balance = +(gcash_balance + totalAmount).toFixed(2);
        addBalanceFromDate(
          realm,
          gcashObjects,
          date_transacted,
          totalAmount,
          account_number
        );
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
        (task.type === 'cash in' || task.type === 'cash out') &&
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
          product_tags: [],
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
  const {
    transactBy,
    startDate,
    endDate,
    number,
    type,
    dateFilter,
    accountNumber,
  } = filter;
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
  if (accountNumber) {
    query.push(`account_number == $${params.length}`);
    params.push(accountNumber);
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
  const numberRealm = await openMobileNumberRealm();
  const accountRealm = await openGcashAccountRealm();

  if (!realm || !numberRealm || !accountRealm)
    return {
      isSuccess: false,
      message: 'Error opening realm db',
    };
  try {
    const task = realm.objects<Gcash>(GCASH);
    const { dateFilter } = filter ?? {};
    const sortFilter =
      dateFilter === 'Date Created'
        ? 'SORT(date_created ASC)'
        : 'SORT(date_transacted ASC, date_created ASC)';

    const query = filter && createGcashTransQuery(filter);
    const filtered = query?.query
      ? task.filtered(`${query.query} ${sortFilter}`, ...query.params)
      : task;

    const gcashTrans = filtered.toJSON() as Gcash[];

    const result = gcashTrans.map((item) => {
      const number =
        item.number &&
        numberRealm.objectForPrimaryKey<MobileNumber>(
          MOBILENUMBER,
          item.number
        );
      const numberName = number ? number.name : '';

      const gcashAccount =
        item.account_number &&
        accountRealm.objectForPrimaryKey<GcashAccount>(
          GCASH_ACCOUNT,
          item.account_number
        );

      return {
        ...item,
        _id: item._id.toString(),
        numberName,
        accountName: gcashAccount && gcashAccount.name,
      };
    });

    realm.close();
    numberRealm.close();

    return {
      isSuccess: true,
      message: 'Successfully get GCash transactions',
      result,
    };
  } catch (error) {
    console.log(error);
    realm.close();
    numberRealm.close();
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
    adjustBalanceOnDelete(realm, gcashObjects, gcash);

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
    console.log(error);
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
      'date_transacted != $0 SORT(date_transacted DESC, date_created DESC) LIMIT(1)',
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
