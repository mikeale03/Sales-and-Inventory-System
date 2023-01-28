import { IResponse } from 'globalTypes/dbApi/response.types';
import Realm from 'realm';

const PRODUCTS = 'Products';

export type Product = {
  _id: string;
  name: string;
  barcode?: number;
  description?: string;
  quantity: number;
  price: number;
  date_created: Date;
  date_updated?: Date;
  created_by: string;
  updated_by?: string;
  image?: string;
};

export class ProductsSchema extends Realm.Object {
  static schema = {
    name: 'Products',
    properties: {
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      name: { type: 'string', indexed: true },
      barcode: { type: 'int?', indexed: true },
      description: 'string?',
      quantity: 'int',
      price: 'float',
      date_created: 'date',
      date_updated: 'date?',
      created_by: 'string',
      updated_by: 'string?',
      image: 'string?',
    },
    primaryKey: '_id',
  };
}

export const openProductsRealm = async () => {
  const products = await Realm.open({
    path: 'realm/products',
    schema: [ProductsSchema],
    deleteRealmIfMigrationNeeded: true,
  });
  return products;
};

const checkProductNameOrBarcodeExist = (
  realm: Realm,
  { name, barcode }: { name?: string; barcode?: number }
) => {
  const products = realm?.objects<Product>(PRODUCTS);
  let prop = '';
  const isExist = products?.find((item) => {
    if (name && item.name.toLowerCase() === name.toLowerCase()) {
      prop = 'name';
      return true;
    }
    if (barcode && barcode === item.barcode) {
      prop = 'barcode';
      return true;
    }
    return false;
  });

  return {
    isExist,
    prop,
  };
};

export const createProduct = async (
  product: Product
): Promise<IResponse<Product>> => {
  let task: Realm.Object<Product, never> | undefined;
  let realm: Realm | undefined;
  const { name, barcode } = product;
  try {
    realm = await openProductsRealm();
    const { isExist, prop } = checkProductNameOrBarcodeExist(realm, {
      name,
      barcode,
    });
    if (isExist) {
      realm.close();
      return {
        isSuccess: false,
        message: `Product ${prop} already exist`,
      };
    }

    realm.write(() => {
      task = realm?.create(PRODUCTS, {
        ...product,
        date_created: new Date(),
      });
    });
  } catch (error) {
    realm?.close();
    return {
      isSuccess: false,
      error,
      message: 'Failed to create product',
    };
  }

  const newProduct = task?.toJSON() as Product;
  realm.close();
  if (newProduct) {
    return {
      isSuccess: true,
      message: 'Successfully created a product',
      result: {
        ...newProduct,
        _id: newProduct._id.toString(),
      },
    };
  }

  return {
    isSuccess: false,
    message: 'Failed to create product',
  };
};

export const create = <T extends Unmanaged<T, never>>(
  realm: Realm,
  payload: T,
  name: string
) => {
  let task: (T & Realm.Object<unknown, never>) | undefined;
  realm.write(() => {
    task = realm.create<T>(name, {
      ...payload,
    });
  });
  return task;
};

export const getAllProducts = async (): Promise<IResponse<Product[]>> => {
  let realm: Realm | undefined;
  try {
    realm = await openProductsRealm();
    const tasks = realm.objects('Products');
    const result: Product[] = tasks.map((item) => {
      const itemObj = item.toJSON() as Product;
      const _id = itemObj._id.toString();
      return {
        ...itemObj,
        _id,
      };
    });
    realm?.close();
    return {
      isSuccess: true,
      message: 'Successfully get products',
      result,
    };
  } catch (error) {
    realm?.close();
    return {
      isSuccess: false,
      message: 'Failed to get products',
      error,
    };
  }
};

export const updateProduct = async (
  updates: Partial<Product> & { _id: string }
) => {
  let realm: Realm | undefined;
  interface ProductRecord {
    [key: string]: number | string | boolean | Date | undefined | null;
  }

  const { name, barcode } = updates;
  try {
    realm = await openProductsRealm();
    const product = realm?.objectForPrimaryKey<ProductRecord>(
      'Products',
      new Realm.BSON.ObjectID(updates._id)
    );
    if (
      (name &&
        name.toLowerCase() !== (product?.name as string).toLowerCase()) ||
      (barcode && barcode !== product?.barcode)
    ) {
      const { isExist, prop } = checkProductNameOrBarcodeExist(realm, {
        name,
        barcode,
      });
      if (isExist) {
        realm.close();
        return {
          isSuccess: false,
          message: `Product ${prop} already exist`,
        };
      }
    }

    realm.write(() => {
      if (product) {
        type UpdateKey = keyof typeof updates;
        Object.keys(updates).forEach((key) => {
          if (key !== '_id') product[key] = updates[key as UpdateKey];
        });
      }
    });

    const newProduct = product?.toJSON() as Product;
    realm?.close();

    if (newProduct)
      return {
        isSuccess: true,
        message: 'Successfully updated a product',
        result: { ...newProduct, _id: newProduct._id.toString() },
      };

    return {
      isSuccess: false,
      message: 'Failed to update product',
    };
  } catch (error) {
    realm?.close();
    return {
      isSuccess: false,
      message: 'Failed to update product',
      error,
    };
  }
};

export const deleteProduct = async (productId: string) => {
  let realm: Realm | undefined;
  try {
    realm = await openProductsRealm();
    let product = realm?.objectForPrimaryKey<Product>(
      'Products',
      new Realm.BSON.ObjectID(productId)
    );

    realm.write(() => {
      product && realm?.delete(product);
      product = null;
    });
    realm?.close();
    return {
      isSuccess: true,
      message: 'Successfully deleted a product',
    };
  } catch (error) {
    realm?.close();
    return {
      isSuccess: false,
      message: 'Failed to delete a product',
      error,
    };
  }
};
