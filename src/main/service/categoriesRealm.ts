import Realm, { ObjectSchema } from 'realm';
import { updateById } from './realm';
import { CategoryRealm } from '../../globalTypes/realm/categories.types';

const CATEGORIES = 'Categories';

export class CategoriesSchema extends Realm.Object {
  static schema: ObjectSchema = {
    name: CATEGORIES,
    properties: {
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      date_created: 'date',
      name: 'string',
    },
    primaryKey: '_id',
  };
}

export const openCategoriesRealm = async () => {
  try {
    const realm = await Realm.open({
      path: '../realm/categories',
      schema: [CategoriesSchema],
      schemaVersion: 1,
    });
    return realm;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const createCategory = async (name: string) => {
  const realm = await openCategoriesRealm();
  if (!realm) {
    return {
      isSuccess: false,
      message: 'Failed to open Categories Realm DB',
    };
  }

  try {
    let category: CategoryRealm | undefined;
    realm.write(() => {
      category = realm
        .create<CategoryRealm>(CATEGORIES, {
          name,
          date_created: new Date(),
        })
        .toJSON() as CategoryRealm;
    });
    realm.close();
    return {
      isSuccess: true,
      message: 'Successfully created a category',
      result: { ...category, _id: category?._id.toString() },
    };
  } catch (error) {
    realm.close();
    console.log(error);
    return {
      isSuccess: false,
      message: 'Failed to create a category',
      error,
    };
  }
};

export const updateCategory = async (_id: string, name: string) => {
  const realm = await openCategoriesRealm();
  if (!realm) {
    return {
      isSuccess: false,
      message: 'Failed to open Categories Realm DB',
    };
  }

  try {
    const update = updateById<CategoryRealm>(
      realm,
      CATEGORIES,
      new Realm.BSON.ObjectID(_id),
      { name }
    )?.toJSON() as CategoryRealm;

    realm.close();

    if (!update) {
      return {
        isSuccess: false,
        message: 'Category not found',
      };
    }

    return {
      isSuccess: true,
      message: 'Successfully updated a category',
      result: { ...update, _id: update._id.toString() },
    };
  } catch (error) {
    realm.close();
    console.log(error);
    return {
      isSuccess: false,
      message: 'Failed to update a category',
      error,
    };
  }
};

export const deleteCategory = async (_id: string) => {
  const realm = await openCategoriesRealm();
  if (!realm) {
    return {
      isSuccess: false,
      message: 'Failed to open Categories Realm DB',
    };
  }
  try {
    let category = realm?.objectForPrimaryKey<CategoryRealm>(
      CATEGORIES,
      new Realm.BSON.ObjectID(_id)
    );

    if (!category) {
      return {
        isSuccess: false,
        message: 'Category not found',
      };
    }

    realm.write(() => {
      realm?.delete(category);
      category = null;
    });

    realm.close();
    return {
      isSuccess: true,
      message: 'Successfully deleted a product',
    };
  } catch (error) {
    realm.close();
    return {
      isSuccess: false,
      message: 'Failed to delete category',
    };
  }
};

export const getCategories = async () => {
  const realm = await openCategoriesRealm();
  if (!realm) {
    return {
      isSuccess: false,
      message: 'Failed to open Categories Realm DB',
    };
  }

  const categories = realm.objects<CategoryRealm>(CATEGORIES);

  const categoriesObjects = categories.map((item) => {
    const { _id } = item;
    return {
      ...item.toJSON(),
      _id: _id.toString(),
    };
  });
  realm.close();

  return {
    isSuccess: true,
    message: 'Successfully get categories',
    result: categoriesObjects,
  };
};
