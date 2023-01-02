import { IProduct } from 'globalTypes/dbApi/products/products.interface';
import { createProduct, deleteProduct } from '../productsDb';

jest.useFakeTimers();

describe('ProductsDb', () => {
  const product: IProduct = {
    name: 'tanduay',
    description: 'makahubog',
    quantity: 12,
    image: '',
  };

  it('should create product', async () => {
    expect.assertions(1);
    const response = await createProduct(product);
    console.log(response);
    expect(response.isSuccess).toEqual(true);
  });

  it('should delete product', async () => {
    expect.assertions(1);
    const response = await deleteProduct(product.name);
    console.log(response);
    expect(response.isSuccess).toEqual(true);
  });
});
