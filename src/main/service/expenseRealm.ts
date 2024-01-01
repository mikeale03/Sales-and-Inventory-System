import Realm, { ObjectSchema } from 'realm';
import {
  CreateExpenseData,
  CreateExpenseRequest,
  Expense,
  ExpenseDescriptionJson,
  GetExpensesFilter,
} from '../../globalTypes/realm/expenses.type';
import { create } from './realm';
import { PRODUCTS, openProductsRealm } from './productsRealm';
import { Product } from '../../globalTypes/realm/products.types';

const EXPENSES = 'expenses';

export class ExpensesSchema extends Realm.Object<Expense> {
  static schema: ObjectSchema = {
    name: EXPENSES,
    properties: {
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      type: 'string',
      amount: 'float',
      description: 'string?',
      date_created: { type: 'date', indexed: true },
      transact_by: 'string',
      transact_by_user_id: 'string',
      charge_to_user_id: 'string?',
      charge_to_user: 'string?',
    },
    primaryKey: '_id',
  };
}

export const openExpensesRealm = async () => {
  try {
    const realm = await Realm.open({
      path: '../realm/expenses',
      schema: [ExpensesSchema],
      schemaVersion: 2,
    });
    return realm;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const createExpense = async (expense: CreateExpenseRequest) => {
  const realm = await openExpensesRealm();
  let productsRealm: Realm | undefined;

  if (!realm)
    return {
      isSuccess: false,
      message: 'Error opening realm db',
    };

  try {
    if (expense.type === 'item charge') {
      productsRealm = await openProductsRealm();

      const { items } = JSON.parse(
        expense.description
      ) as ExpenseDescriptionJson;

      items.forEach((item) => {
        const product = productsRealm?.objectForPrimaryKey<Product>(
          PRODUCTS,
          new Realm.BSON.ObjectID(item.productId)
        );
        if (product) {
          productsRealm?.write(() => {
            product.quantity -= item.quantity;
            product.last_transaction_date = new Date();
          });
        }
      });
    }

    const task = create<CreateExpenseData>(realm, EXPENSES, {
      ...expense,
      date_created: new Date(),
    });

    const newExpense = task?.toJSON() as Expense;
    realm.close();
    productsRealm?.close();
    return {
      isSuccess: true,
      message: 'Successfully created an expense',
      result: { ...newExpense, _id: newExpense._id.toString() },
    };
  } catch (error) {
    realm.close();
    productsRealm?.close();
    console.log(error);
    return {
      isSuccess: false,
      message: 'Failed to create an expense',
      error,
    };
  }
};

export const getExpenses = async (filter?: GetExpensesFilter) => {
  const realm = await openExpensesRealm();
  if (!realm)
    return {
      isSuccess: false,
      message: 'Error opening realm db',
    };

  try {
    let expenses = realm.objects<Expense>(EXPENSES);
    const transactBy = filter?.transactBy;
    const chargeToUser = filter?.chargeToUser;
    const excludeItemCharge = filter?.excludeItemCharge;
    const startDate = filter?.startDate;
    const endDate = filter?.endDate;

    const query: string[] = [];
    const args = [];

    if (transactBy) {
      query.push(`transact_by_user_id == $${args.length}`);
      args.push(transactBy);
    }
    if (chargeToUser === 'all') {
      query.push(`type == $${args.length}`);
      args.push('item charge');
    } else if (chargeToUser) {
      query.push(`charge_to_user_id == $${args.length}`);
      args.push(chargeToUser);
    }
    if (excludeItemCharge) {
      query.push(`type != $${args.length}`);
      args.push('item charge');
    }
    if (startDate) {
      query.push(`date_created >= $${args.length}`);
      args.push(startDate);
    }
    if (endDate) {
      query.push(`date_created <= $${args.length}`);
      args.push(endDate);
    }
    expenses = args.length
      ? expenses.filtered(query.join(' && '), ...args)
      : expenses;

    const expensesArray = expenses.toJSON() as Expense[];
    realm.close();
    return {
      isSuccess: true,
      message: 'Successfully get expenses',
      result: expensesArray.map((d) => ({ ...d, _id: d._id.toString() })),
    };
  } catch (error) {
    console.log(error);
    return {
      isSuccess: false,
      message: 'Failed to get expenses',
      error,
    };
  }
};

export const deleteExpense = async (id: string) => {
  const realm = await openExpensesRealm();
  let productsRealm: Realm | undefined;

  if (!realm)
    return {
      isSuccess: false,
      message: 'Error opening realm db',
    };

  try {
    let expense = realm.objectForPrimaryKey<Expense>(
      EXPENSES,
      new Realm.BSON.ObjectID(id)
    );

    if (!expense) {
      return {
        isSuccess: false,
        message: 'Expense not found',
      };
    }

    if (expense.type === 'item charge') {
      productsRealm = await openProductsRealm();
      const desc =
        expense.description &&
        (JSON.parse(expense.description) as ExpenseDescriptionJson);

      if (desc) {
        desc.items.forEach((item) => {
          const product = productsRealm?.objectForPrimaryKey<Product>(
            PRODUCTS,
            new Realm.BSON.ObjectID(item.productId)
          );
          if (product) {
            productsRealm?.write(() => {
              product.quantity += item.quantity;
            });
          }
        });
      }
    }
    realm.write(() => {
      realm.delete(expense);
      expense = null;
    });
    realm.close();
    productsRealm?.close();
    return {
      isSuccess: true,
      message: 'Successfully delete an expense',
    };
  } catch (error) {
    console.log(error);
    realm.close();
    productsRealm?.close();
    return {
      isSuccess: false,
      message: 'Failed to delete expense',
      error,
    };
  }
};
