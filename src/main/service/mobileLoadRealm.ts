import {
  CreateMobileLoadData,
  CreateMobileLoadParams,
  MobileLoad,
  MobileLoadFilterParams,
} from 'globalTypes/realm/mobileLoad.types';
import { Gcash } from 'globalTypes/realm/gcash.types';
import { Sales } from 'globalTypes/realm/sales.types';
import { MobileNumber } from 'globalTypes/realm/mobileNumber.types';
import { GcashAccount } from 'globalTypes/realm/gcashAccount.types';
import Realm, { ObjectSchema } from 'realm';
import { create } from './realm';
import { createSales, openSalesRealm } from './salesRealm';
import { openGcashRealm } from './gcashRealm';
import { adjustBalanceOnDelete } from './utils/gcashRealmHelper';
import { MOBILENUMBER, openMobileNumberRealm } from './mobileNumbersRealm';
import { GCASH_ACCOUNT, openGcashAccountRealm } from './gcashAccountRealm';

const MOBILELOAD = 'MobileLoad';

export class MobileLoadSchema extends Realm.Object<MobileLoad> {
  static schema: ObjectSchema = {
    name: MOBILELOAD,
    properties: {
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      amount: 'float',
      charge: 'float',
      number: 'string',
      source: 'string',
      total_amount: 'float',
      date_transacted: { type: 'date', indexed: true },
      date_created: { type: 'date', indexed: true },
      transact_by: 'string',
      transact_by_user_id: 'string',
      updated_by: 'string?',
      updated_by_user_id: 'string?',
      transaction_id: 'string',
    },
    primaryKey: '_id',
  };
}

export const openMobileLoadRealm = async () => {
  try {
    const realm = await Realm.open({
      path: '../realm/mobile-load',
      schema: [MobileLoadSchema],
      schemaVersion: 2,
    });
    return realm;
  } catch (error) {
    return undefined;
  }
};

export const createMobileLoad = async (data: CreateMobileLoadParams) => {
  const realm = await openMobileLoadRealm();
  let salesRealm: Realm | undefined;
  if (!realm) {
    return {
      isSuccess: false,
      message: 'Error opening realm db',
    };
  }

  try {
    const task = create<CreateMobileLoadData>(realm, MOBILELOAD, {
      ...data,
      date_created: new Date(),
    });

    salesRealm = await openSalesRealm();
    await createSales(
      [
        {
          product_id: 'mobile-load',
          product_name: `MobileLoad - ${data.amount}`,
          quantity: 1,
          price: data.total_amount,
          total_price: data.total_amount,
          payment: 'cash',
          date_created: new Date(),
          transact_by: data.transact_by,
          transact_by_user_id: data.transact_by_user_id,
          transaction_id: data.transaction_id,
          product_tags: [],
        },
      ],
      salesRealm
    );

    const result = task?.toJSON() as MobileLoad;
    salesRealm?.close();
    realm.close();

    return {
      isSuccess: true,
      message: 'Successfully created Mobile Load data',
      result,
    };
  } catch (error) {
    salesRealm?.close();
    realm.close();
    console.log(error);
    return {
      isSuccess: false,
      message: 'Failed to create Mobile Load transaction',
      error,
    };
  }
};

export const getMobileLoads = async (params: MobileLoadFilterParams) => {
  const realm = await openMobileLoadRealm();
  const numberRealm = await openMobileNumberRealm();
  const accountRealm = await openGcashAccountRealm();

  if (!realm || !numberRealm || !accountRealm) {
    return {
      isSuccess: false,
      message: 'Error opening realm db',
    };
  }

  try {
    const task = realm.objects<MobileLoad>(MOBILELOAD);

    const args = [];
    let query = '';

    const {
      mobileNumber = '',
      source,
      transactBy,
      startDate,
      endDate,
    } = params;

    query += `number CONTAINS[c] $${args.length}`;
    args.push(mobileNumber);

    if (transactBy) {
      query += ` AND transact_by_user_id == $${args.length}`;
      args.push(transactBy);
    }

    if (source === 'gcash') {
      query += ` AND source != $${args.length}`;
      args.push('other');
    } else if (source) {
      query += ` AND source == $${args.length}`;
      args.push(source);
    }

    if (startDate) {
      query += ` AND date_transacted >= $${args.length}`;
      args.push(startDate);
    }
    if (endDate) {
      query += ` AND date_transacted <= $${args.length}`;
      args.push(endDate);
    }

    const filtered = task.filtered(
      `${query} SORT(date_transacted DESC)`,
      ...args
    );
    const json = filtered.toJSON() as MobileLoad[];
    const result = json.map((d) => {
      const number = numberRealm.objectForPrimaryKey<MobileNumber>(
        MOBILENUMBER,
        d.number
      );

      const account =
        d.source !== 'other' &&
        d.source !== 'gcash' &&
        accountRealm.objectForPrimaryKey<GcashAccount>(GCASH_ACCOUNT, d.source);

      const numberName = number ? number.name : '';

      return {
        ...d,
        _id: d._id.toString(),
        numberName,
        sourceName: account ? account.name : '',
      };
    });

    realm.close();
    numberRealm.close();
    accountRealm.close();
    return {
      isSuccess: true,
      message: 'Successfully get Mobile Load transactions',
      result,
    };
  } catch (error) {
    realm.close();
    numberRealm.close();
    accountRealm.close();
    console.log(error);
    return {
      isSuccess: false,
      message: 'Failed to get Mobile Load transactions',
      error,
    };
  }
};

export const deleteMobileLoad = async (id: string) => {
  const realm = await openMobileLoadRealm();
  const salesRealm = await openSalesRealm();
  if (!realm || !salesRealm) {
    return {
      isSuccess: false,
      message: 'Error opening realm db',
    };
  }
  try {
    let mobileLoad = realm.objectForPrimaryKey<MobileLoad>(
      MOBILELOAD,
      new Realm.BSON.ObjectID(id)
    );
    if (!mobileLoad) {
      realm.close();
      return {
        isSuccess: false,
        message: 'Mobile load transaction not found',
      };
    }

    if (mobileLoad.source !== 'other') {
      const gcashRealm = await openGcashRealm();
      if (!gcashRealm) {
        return {
          isSuccess: false,
          message: 'Error opening realm db',
        };
      }
      const gcashObjects = gcashRealm.objects<Gcash>('Gcash');

      const gcash = gcashObjects.filtered(
        `transaction_id == $0`,
        mobileLoad.transaction_id
      )[0];

      if (gcash) {
        adjustBalanceOnDelete(gcashRealm, gcashObjects, gcash);

        gcashRealm?.write(() => {
          gcashRealm.delete(gcash);
        });
        gcashRealm.close();
      }
    }

    salesRealm.write(() => {
      const sales = salesRealm
        .objects<Sales>('Sales')
        .filtered(`transaction_id == $0`, mobileLoad?.transaction_id);
      salesRealm.delete(sales);
    });

    realm.write(() => {
      realm.delete(mobileLoad);
      mobileLoad = null;
    });

    realm?.close();
    salesRealm.close();
    return {
      isSuccess: true,
      message: 'Successfully deleted a Mobile Load transaction',
    };
  } catch (error) {
    realm?.close();
    salesRealm.close();
    return {
      isSuccess: false,
      message: 'Failed to delete a Mobile Load transaction',
      error,
    };
  }
};
