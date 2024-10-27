import {
  CreateMobileLoadData,
  CreateMobileLoadParams,
  MobileLoad,
  MobileLoadFilterParams,
} from 'globalTypes/realm/mobileLoad.types';
import Realm, { ObjectSchema } from 'realm';
import { create } from './realm';

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
    },
    primaryKey: '_id',
  };
}

export const openMobileLoadRealm = async () => {
  try {
    const realm = await Realm.open({
      path: '../realm/mobile-load',
      schema: [MobileLoadSchema],
      schemaVersion: 1,
    });
    return realm;
  } catch (error) {
    return undefined;
  }
};

export const createMobileLoad = async (data: CreateMobileLoadParams) => {
  const realm = await openMobileLoadRealm();
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

    const result = task?.toJSON() as MobileLoad;
    realm.close();
    return {
      isSuccess: true,
      message: 'Successfully created Mobile Load data',
      result,
    };
  } catch (error) {
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
  if (!realm) {
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
    if (source) {
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
    const result = filtered.toJSON() as MobileLoad[];
    realm.close();
    return {
      isSuccess: true,
      message: 'Successfully get Mobile Load transactions',
      result: result.map((d) => ({ ...d, _id: d._id.toString() })),
    };
  } catch (error) {
    realm.close();
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
  if (!realm) {
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
        message: 'GCash transaction not found',
      };
    }

    realm.write(() => {
      realm.delete(mobileLoad);
      mobileLoad = null;
    });
    realm?.close();
    return {
      isSuccess: true,
      message: 'Successfully deleted a Mobile Load transaction',
    };
  } catch (error) {
    realm?.close();
    return {
      isSuccess: false,
      message: 'Failed to delete a Mobile Load transaction',
      error,
    };
  }
};
