export interface IProduct {
  _id?: string;
  _rev?: string;
  name: string;
  barcode?: number;
  description?: string;
  price: number;
  quantity: number;
  image?: string;
}

export type ProductUpdate = Omit<IProduct, '_id' | 'rev'> & {
  _id: string;
  _rev: string;
};

export type AllProductItem = {
  doc?:
    | PouchDB.Core.ExistingDocument<IProduct & PouchDB.Core.AllDocsMeta>
    | undefined;
  id: string;
  key: string;
  value: {
    rev: string;
    deleted?: boolean | undefined;
  };
};
