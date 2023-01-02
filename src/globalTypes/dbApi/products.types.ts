export interface IProduct {
  _id?: string;
  _rev?: string;
  name: string;
  barcode?: number;
  description?: string;
  quantity: number;
  image?: string;
}
