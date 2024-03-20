import { Response } from 'globalTypes/realm/response.types';
import Realm, { ObjectSchema } from 'realm';

export const PRODUCTS = 'Products';

export type Product = {
  _id: string;
  name: string;
  barcode?: number;
  description?: string;
  quantity: number;
  price: number;
  category?: string;
  tags?: string[];
  date_created: Date;
  date_updated?: Date;
  created_by: string;
  created_by_user_id: string;
  updated_by?: string;
  updated_by_user_id?: string;
  last_transaction_date?: Date;
  inventory_verified?: boolean;
  image?: string;
};

export class ProductsSchema extends Realm.Object {
  static schema: ObjectSchema = {
    name: PRODUCTS,
    properties: {
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      name: { type: 'string', indexed: true },
      barcode: { type: 'int?', indexed: true },
      description: 'string?',
      quantity: 'int',
      price: 'float',
      category: 'string?',
      tags: 'string[]',
      date_created: 'date',
      date_updated: 'date?',
      created_by: 'string',
      created_by_user_id: 'string',
      updated_by: 'string?',
      updated_by_user_id: 'string?',
      last_transaction_date: 'date?',
      inventory_verified: 'bool?',
      image: 'string?',
    },
    primaryKey: '_id',
  };
}

export const openProductsRealm = async () => {
  const products = await Realm.open({
    path: '../realm/products',
    schema: [ProductsSchema],
    schemaVersion: 3,
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
  product: Omit<Product, '_id' | 'date_created'>
): Promise<Response<Product>> => {
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

export const getAllProducts = async (filter?: {
  searchText?: string;
  sortProp?: keyof Product;
  sortAs?: 'asc' | 'desc';
  limit?: number;
  category?: string;
  tags?: string[];
}): Promise<Response<Product[]>> => {
  let realm: Realm | undefined;
  try {
    realm = await openProductsRealm();
    let products = realm?.objects(PRODUCTS);

    const name = filter?.searchText ?? '';
    const barcode = filter?.searchText && +filter.searchText;
    const category = filter?.category;
    const tags = filter?.tags;
    const args = [];
    let query = '';
    query += `name CONTAINS[c] $${args.length}`;
    args.push(name);

    if (barcode) {
      query += ` OR barcode == $${args.length}`;
      args.push(barcode);
    }
    if (category) {
      query += ` AND category == $${args.length}`;
      args.push(category);
    }
    if (tags) {
      const l = args.length;
      query += ` AND ALL { ${tags.map((v, i) => {
        args.push(v);
        return `$${l + i}`;
      })} } IN tags`;
    }
    if (filter?.sortProp) {
      const sort = filter.sortAs || 'desc';
      query += ` SORT(${filter.sortProp} ${sort})`;
    }
    if (filter?.limit) {
      query += ` LIMIT(${filter.limit})`;
    }

    products = args.length ? products.filtered(query, ...args) : products;

    const result = products.map((item) => {
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
    console.error(error);
    realm?.close();
    return {
      isSuccess: false,
      message: 'Failed to get products',
      error,
    };
  }
};

export const updateProduct = async (
  updates: Partial<Product> & {
    _id: string;
    updated_by: string;
    updated_by_user_id: string;
  }
) => {
  let realm: Realm | undefined;
  interface ProductRecord {
    [key: string]:
      | number
      | string
      | boolean
      | Date
      | string[]
      | undefined
      | null;
  }

  const { name, barcode } = updates;
  try {
    realm = await openProductsRealm();
    const product = realm?.objectForPrimaryKey<ProductRecord>(
      'Products',
      new Realm.BSON.ObjectID(updates._id)
    );
    const checkProp: { name?: string; barcode?: number } = {};

    if (
      name &&
      name.toLowerCase() !== (product?.name as string).toLowerCase()
    ) {
      checkProp.name = name;
    }

    if (barcode && barcode !== product?.barcode) {
      checkProp.barcode = barcode;
    }

    if (checkProp.barcode || checkProp.name) {
      const { isExist, prop } = checkProductNameOrBarcodeExist(
        realm,
        checkProp
      );
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
        product.date_updated = new Date();
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

export const purchaseProduct = async (
  items: { _id: string; quantity: number }[]
) => {
  let realm: Realm | undefined;
  const products: (Product & Realm.Object<unknown, never>)[] = [];

  try {
    realm = await openProductsRealm();
    items.forEach((item) => {
      const product = realm?.objectForPrimaryKey<Product>(
        PRODUCTS,
        new Realm.BSON.ObjectID(item._id)
      );
      if (product) {
        realm?.write(() => {
          product.quantity -= item.quantity;
          products.push(product);
        });
      }
    });

    const newProducts = products.map((prod) => {
      const prodObject = prod.toJSON() as Product;
      return {
        ...prodObject,
        _id: prodObject._id.toString(),
      };
    });
    realm?.close();

    return {
      isSuccess: true,
      message: 'Successfully purchased the products',
      result: newProducts,
    };
  } catch (error) {
    realm?.close();
    return {
      isSuccess: false,
      message: 'Failed to purchase products',
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
