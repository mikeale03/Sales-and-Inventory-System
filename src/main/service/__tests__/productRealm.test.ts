import Realm from 'realm';
import * as ProductsRealm from '../productsRealm';

describe('ProductsRealm', () => {
  const product: ProductsRealm.CreateProductParam = {
    name: 'tanduay',
    description: 'makahubog',
    quantity: 12,
    price: 10,
    created_by: 'Mike',
  };

  const config = {
    schema: [ProductsRealm.ProductsSchema],
  };

  let spy: jest.SpyInstance<Promise<Realm>, []>;
  let productId: string | undefined;

  beforeAll(() => {
    spy = jest.spyOn(ProductsRealm, 'openProductsRealm');
    spy.mockImplementation(async () => Realm.open(config));
  });

  afterAll(() => {
    spy.mockRestore();
    Realm.deleteFile(config);
  });

  it('should create and get product', async () => {
    expect.assertions(5);
    const response = await ProductsRealm.createProduct(product);
    expect(ProductsRealm.openProductsRealm).toHaveBeenCalled();
    expect(response.isSuccess).toBe(true);
    expect(response.result?.name).toEqual('tanduay');
    productId = response.result?._id;
    const getResponse = await ProductsRealm.getAllProducts();
    expect(getResponse.isSuccess).toBe(true);
    expect(getResponse.result?.length).toBe(1);
  });

  it('should update product', async () => {
    expect.assertions(3);
    const response = productId
      ? await ProductsRealm.updateProduct({ _id: productId, name: 'Tae' })
      : undefined;
    expect(ProductsRealm.openProductsRealm).toHaveBeenCalled();
    expect(response?.isSuccess).toBe(true);
    expect(response?.result?.name).toEqual('Tae');
  });

  it('should delete product', async () => {
    expect.assertions(1);
    const response = productId
      ? await ProductsRealm.deleteProduct(productId)
      : undefined;
    console.log(response);
    expect(response?.isSuccess).toBe(true);
  });
});
