import { IResponse } from 'globalTypes/dbApi/response.types';
import Realm from 'realm';

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

export type CreateProductParam = Omit<
  Product,
  'barcode' | 'quantity' | 'price' | 'date_created' | '_id'
> & {
  barcode?: number | string;
  quantity: number | string;
  price: number | string;
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
      price: 'int',
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

export const createProduct = async (
  productParam: CreateProductParam
): Promise<IResponse<Product>> => {
  let task: Realm.Object<Product, never> | undefined;
  let realm: Realm | undefined;
  try {
    realm = await openProductsRealm();

    realm.write(() => {
      task = realm?.create('Products', {
        ...productParam,
        barcode: productParam.barcode ? +productParam.barcode : undefined,
        quantity: +productParam.quantity,
        price: +productParam.price,
        date_created: new Date(),
      });

      console.log(task?.toJSON());
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
  productId: string,
  updates: Record<string, any>
) => {
  let realm: Realm | undefined;
  try {
    realm = await openProductsRealm();
    const product: Record<string, any> | null =
      realm.objectForPrimaryKey<Product>('Products', productId);

    console.log(product);

    realm.write(() => {
      if (product) {
        Object.keys(updates).forEach((key) => {
          product[key] = updates[key];
        });
      }
    });

    const result = product?.toJSON();
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
