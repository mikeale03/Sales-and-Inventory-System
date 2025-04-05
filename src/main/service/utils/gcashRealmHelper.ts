import Realm from 'realm';
import { Gcash } from '../../../globalTypes/realm/gcash.types';

export const getGcashBeforeDate = (
  gcashObjects: Realm.Results<Gcash>,
  date: Date,
  account_number?: string
) => {
  const args: (null | Date | string)[] = [null, date];
  if (account_number) {
    args.push(account_number);
  }
  const result = gcashObjects.filtered(
    `date_transacted != $0 AND date_transacted <= $1 ${
      account_number ? 'AND account_number == $2' : ''
    } SORT(date_transacted DESC, date_created DESC) LIMIT(1)`,
    ...args
  );

  return result.length ? result[0] : null;
};

export const addBalanceFromDate = (
  gcashRealm: Realm,
  gcashObjects: Realm.Results<Gcash>,
  date: Date,
  amount: number,
  account_number?: string
) => {
  const args: (null | Date | string)[] = [null, date];

  if (account_number) {
    args.push(account_number);
  }

  const transactions = gcashObjects.filtered(
    `date_transacted != $0 AND date_transacted > $1 ${
      account_number ? 'AND account_number == $2' : ''
    }`,
    ...args
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
  amount: number,
  account_number?: string
) => {
  const args: (null | Date | string)[] = [null, date];

  if (account_number) {
    args.push(account_number);
  }

  const transactions = gcashObjects.filtered(
    `date_transacted != $0 AND date_transacted > $1 ${
      account_number ? 'AND account_number == $2' : ''
    }`,
    ...args
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

export const adjustBalanceOnDelete = (
  gcashRealm: Realm,
  gcashObjects: Realm.Results<Gcash>,
  gcashItem: Gcash & Realm.Object<unknown, never>
) => {
  const {
    date_created,
    date_transacted,
    gcash_balance: itemBalance,
    account_number,
  } = gcashItem;

  if (!date_transacted) return;

  const args: (null | Date | string)[] = [null, date_transacted, date_created];

  if (account_number) {
    args.push(account_number);
  }

  const result = gcashObjects.filtered(
    `date_transacted != $0 AND
    ( date_transacted < $1 OR (date_transacted == $1 AND date_created < $2) )
    ${account_number ? 'AND account_number == $3' : ''}
    SORT(date_transacted DESC, date_created DESC) LIMIT(1)`,
    ...args
  );

  const { gcash_balance = 0 } = result.length ? result[0] : {};

  const amount = +(gcash_balance - itemBalance).toFixed(2);

  const transactions = gcashObjects.filtered(
    `date_transacted != $0 AND date_transacted >= $1 ${
      account_number ? 'AND account_number == $2' : ''
    }`,
    null,
    date_transacted
  );

  gcashRealm.write(() => {
    for (const tran of transactions) {
      if (
        tran.date_transacted! > date_transacted ||
        tran.date_created > date_created
      ) {
        tran.gcash_balance = tran.gcash_balance
          ? +(tran.gcash_balance + amount).toFixed(2)
          : amount;
      }
    }
  });
};
