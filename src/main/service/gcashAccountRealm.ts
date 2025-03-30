import {
  GcashAccount,
  GcashAccountCreate,
} from 'globalTypes/realm/gcashAccount.types';
import Realm, { ObjectSchema } from 'realm';
import { create } from './realm';

const GCASH_ACCOUNT = 'GcashAccount';

export class GcashAccountSchema extends Realm.Object<GcashAccount> {
  static schema: ObjectSchema = {
    name: GCASH_ACCOUNT,
    properties: {
      number: 'string',
      name: 'string',
      mpin: 'string',
      email: 'string?',
    },
    primaryKey: 'number',
  };
}

export const openGcashAccountRealm = async () => {
  try {
    const realm = await Realm.open({
      path: '../realm/gcash-account',
      schema: [GcashAccountSchema],
      schemaVersion: 1,
    });
    return realm;
  } catch (error) {
    return undefined;
  }
};

export const createGcashAccount = async (data: GcashAccountCreate) => {
  const realm = await openGcashAccountRealm();
  if (!realm) {
    return {
      isSuccess: false,
      message: 'Error opening realm db',
    };
  }

  try {
    const task = create<GcashAccountCreate>(realm, GCASH_ACCOUNT, {
      ...data,
    });

    const result = task?.toJSON() as GcashAccount;
    realm.close();

    return {
      isSuccess: true,
      message: 'Successfully created Gcash Account',
      result,
    };
  } catch (error: any) {
    realm.close();
    console.log(error);
    let message = 'Failed to create Gcash Account';
    if (error.code === 'ObjectAlreadyExists') message = 'Number already exists';
    return {
      isSuccess: false,
      message,
      error,
    };
  }
};

export const getGcashAccounts = async () => {
  const realm = await openGcashAccountRealm();

  if (!realm) {
    return {
      isSuccess: false,
      message: 'Error opening realm db',
    };
  }

  try {
    const task = realm.objects<GcashAccount>(GCASH_ACCOUNT);
    const result = task.toJSON() as GcashAccount[];
    realm.close();

    return {
      isSuccess: true,
      message: 'Successfully get Gcash Accounts',
      result,
    };
  } catch (error) {
    realm.close();
    console.log(error);
    return {
      isSuccess: false,
      message: 'Failed to get Gcash Accounts',
      error,
    };
  }
};

export const updateGcashAccount = async (
  accountNumber: string,
  updates: GcashAccount
) => {
  const realm = await openGcashAccountRealm();
  if (!realm) {
    return {
      isSuccess: false,
      message: 'Error opening realm db',
    };
  }

  try {
    const account = realm.objectForPrimaryKey<GcashAccount>(
      GCASH_ACCOUNT,
      accountNumber
    );
    if (!account)
      return {
        isSuccess: false,
        message: 'Number not found',
      };
    if (updates.number !== account.number) {
      const duplicateNumber = realm.objectForPrimaryKey<GcashAccount>(
        GCASH_ACCOUNT,
        updates.number
      );
      if (duplicateNumber) {
        return {
          isSuccess: false,
          message: 'Number already exists',
        };
      }
    }

    realm.write(() => {
      account.number = updates.number;
      account.name = updates.name;
      account.mpin = updates.mpin;
      account.email = updates.email;
    });

    const result = account.toJSON();
    realm.close();

    return {
      isSuccess: true,
      message: 'Successfully updated Gcash Account',
      result,
    };
  } catch (error) {
    realm.close();
    console.log(error);
    return {
      isSuccess: false,
      message: 'Failed to update Gcash Account',
      error,
    };
  }
};

export const deleteGcashAccount = async (number: string) => {
  const realm = await openGcashAccountRealm();
  if (!realm) {
    return {
      isSuccess: false,
      message: 'Error opening realm db',
    };
  }

  try {
    let mobileNumber = realm.objectForPrimaryKey<GcashAccount>(
      GCASH_ACCOUNT,
      number
    );
    if (!mobileNumber)
      return {
        isSuccess: false,
        message: 'Number not found',
      };

    realm.write(() => {
      realm.delete(mobileNumber);
      mobileNumber = null;
    });

    realm.close();

    return {
      isSuccess: true,
      message: 'Successfully deleted Gcash Account',
    };
  } catch (error) {
    realm.close();
    console.log(error);
    return {
      isSucces: false,
      message: 'Failed to delete Gcash Account',
      error,
    };
  }
};
