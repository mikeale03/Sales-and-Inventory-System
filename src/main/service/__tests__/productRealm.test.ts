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

  afterAll(() => {
    Realm.deleteFile(config);
  });

  it('should create and get product', async () => {
    const spy = jest.spyOn(ProductsRealm, 'openProductsRealm');
    spy.mockImplementation(async () => Realm.open(config));
    expect.assertions(5);
    const response = await ProductsRealm.createProduct(product);
    expect(ProductsRealm.openProductsRealm).toHaveBeenCalled();
    expect(response.isSuccess).toBe(true);
    expect(response.result?.name).toEqual('tanduay');
    const getResponse = await ProductsRealm.getAllProducts();
    expect(getResponse.isSuccess).toBe(true);
    expect(getResponse.result?.length).toBe(1);
    spy.mockRestore();
  });
});
