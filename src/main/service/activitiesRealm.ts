import Realm, { ObjectSchema } from 'realm';
import {
  Activity,
  CreateProductAddActivityParams,
  CreateProductAddQtyActivityParams,
  CreateProductEditActivityParams,
  CreateSalesDeleteActivityParams,
  CreateSalesVoidActivityParams,
  GetActivitiesFilter,
  ProductEditDetails,
} from '../../globalTypes/realm/activities.types';
import { ProductForm } from '../../globalTypes/realm/products.types';

const ACTIVITIES = 'Activities';

export class ActivitiesSchema extends Realm.Object {
  static schema: ObjectSchema = {
    name: ACTIVITIES,
    properties: {
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      date_created: 'date',
      activity: 'string',
      details: 'string',
      transact_by: 'string',
      transact_by_user_id: 'string',
    },
    primaryKey: '_id',
  };
}

export const openActivitiesRealm = async () => {
  try {
    const realm = await Realm.open({
      path: '../realm/activities',
      schema: [ActivitiesSchema],
      schemaVersion: 1,
    });
    return realm;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const createProductEditActivity = async (
  params: CreateProductEditActivityParams
) => {
  const { oldProduct, newProduct, transact_by, transact_by_user_id } = params;
  const productUpdates: ProductEditDetails = {
    product_name: oldProduct.name,
    updates: [],
  };
  type ProductKey = keyof ProductForm;
  const { updates } = productUpdates;
  Object.entries(newProduct).forEach(([key, val]) => {
    const k = key as ProductKey;
    if (oldProduct[k] !== val) {
      updates.push({
        prop: key,
        from: oldProduct[k],
        to: val,
      });
    }
  });

  if (updates.length) {
    const realm = await openActivitiesRealm();
    if (!realm)
      return {
        isSuccess: false,
        message: 'Failed to open Activities Realm DB',
      };

    try {
      realm.write(() => {
        realm.create(ACTIVITIES, {
          details: JSON.stringify(productUpdates),
          transact_by,
          transact_by_user_id,
          activity: 'edit product',
          date_created: new Date(),
        });
      });
      realm.close();
      return {
        isSuccess: true,
        message: 'Successfully created an activity',
      };
    } catch (error) {
      realm.close();
      return {
        isSuccess: false,
        message: 'Failed to create an activity',
        error,
      };
    }
  }
  return {
    isSuccess: false,
    message: 'No changes is made to the product',
  };
};

export const createProductAddActivity = async (
  params: CreateProductAddActivityParams
) => {
  const { product, transact_by, transact_by_user_id } = params;
  const realm = await openActivitiesRealm();
  if (!realm)
    return {
      isSuccess: false,
      message: 'Failed to open Activities Realm DB',
    };

  try {
    realm.write(() => {
      realm.create(ACTIVITIES, {
        details: JSON.stringify(product),
        transact_by,
        transact_by_user_id,
        activity: 'create product',
        date_created: new Date(),
      });
    });
    realm.close();
    return {
      isSuccess: true,
      message: 'Successfully created an activity',
    };
  } catch (error) {
    realm.close();
    console.log(error);
    return {
      isSuccess: false,
      message: 'Failed to create an activity',
      error,
    };
  }
};

export const createProductAddQtyActivity = async ({
  product_name,
  quantity,
  transact_by,
  transact_by_user_id,
}: CreateProductAddQtyActivityParams) => {
  const realm = await openActivitiesRealm();
  if (!realm)
    return {
      isSuccess: false,
      message: 'Failed to open Activities Realm DB',
    };
  try {
    realm.write(() => {
      realm.create(ACTIVITIES, {
        details: JSON.stringify({
          product_name,
          quantity,
        }),
        transact_by,
        transact_by_user_id,
        activity: 'add product quantity',
        date_created: new Date(),
      });
    });
    realm.close();
    return {
      isSuccess: true,
      message: 'Successfully created an activity',
    };
  } catch (error) {
    realm.close();
    console.log(error);
    return {
      isSuccess: false,
      message: 'Failed to create an activity',
      error,
    };
  }
};

export const createProductDeleteActivity = async (
  params: CreateProductAddActivityParams
) => {
  const { product, transact_by, transact_by_user_id } = params;
  const realm = await openActivitiesRealm();
  if (!realm)
    return {
      isSuccess: false,
      message: 'Failed to open Activities Realm DB',
    };

  try {
    realm.write(() => {
      realm.create(ACTIVITIES, {
        details: JSON.stringify(product),
        transact_by,
        transact_by_user_id,
        activity: 'delete product',
        date_created: new Date(),
      });
    });
    realm.close();
    return {
      isSuccess: true,
      message: 'Successfully created an activity',
    };
  } catch (error) {
    realm.close();
    console.log(error);
    return {
      isSuccess: false,
      message: 'Failed to create an activity',
      error,
    };
  }
};

export const createSalesDeleteActivity = async (
  params: CreateSalesDeleteActivityParams
) => {
  const { sales, transact_by, transact_by_user_id } = params;
  const realm = await openActivitiesRealm();
  if (!realm)
    return {
      isSuccess: false,
      message: 'Failed to open Activities Realm DB',
    };

  try {
    realm.write(() => {
      realm.create(ACTIVITIES, {
        details: JSON.stringify(sales),
        transact_by,
        transact_by_user_id,
        activity: 'delete sales',
        date_created: new Date(),
      });
    });
    realm.close();
    return {
      isSuccess: true,
      message: 'Successfully created an activity',
    };
  } catch (error) {
    realm.close();
    console.log(error);
    return {
      isSuccess: false,
      message: 'Failed to create an activity',
      error,
    };
  }
};

export const createSalesVoidActivity = async (
  params: CreateSalesVoidActivityParams
) => {
  const { sales, transact_by, transact_by_user_id, void_by, void_by_user_id } =
    params;
  const realm = await openActivitiesRealm();
  if (!realm)
    return {
      isSuccess: false,
      message: 'Failed to open Activities Realm DB',
    };

  try {
    realm.write(() => {
      realm.create(ACTIVITIES, {
        details: JSON.stringify({
          ...sales,
          void_by,
          void_by_user_id,
        }),
        activity: 'void sales',
        transact_by,
        transact_by_user_id,
        date_created: new Date(),
      });
    });
    realm.close();
    return {
      isSuccess: true,
      message: 'Successfully created an activity',
    };
  } catch (error) {
    realm.close();
    console.log(error);
    return {
      isSuccess: false,
      message: 'Failed to create an activity',
      error,
    };
  }
};

export const getActivities = async (filter?: GetActivitiesFilter) => {
  const realm = await openActivitiesRealm();

  if (!realm)
    return {
      isSuccess: false,
      message: 'Failed to open Activities Realm DB',
    };

  try {
    let activities = realm.objects<Activity>(ACTIVITIES);
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
    activities = args.length
      ? activities.filtered(query.join(' && '), ...args)
      : activities;

    const activitiesArray = activities.toJSON() as Activity[];
    realm.close();
    return {
      isSuccess: true,
      message: 'Successfully get activities',
      result: activitiesArray.map((d) => ({ ...d, _id: d._id.toString() })),
    };
  } catch (error) {
    console.log(error);
    return {
      isSuccess: false,
      message: 'Failed to get activities',
      error,
    };
  }
};
