import { Response } from 'globalTypes/realm/response.types';
import Realm from 'realm';
import * as ProductsRealm from '../productsRealm';

describe('Prod_Test', () => {
  const product = {
    name: 'test',
    quantity: 3,
    price: 10,
    category: 'category',
    tags: ['tag1', 'tag2'],
    created_by: 'test',
    created_by_user_id: 'test',
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

  it('should_create_and_get_product', async () => {
    expect.assertions(5);
    const response = await ProductsRealm.createProduct(product);
    expect(ProductsRealm.openProductsRealm).toHaveBeenCalled();
    expect(response.isSuccess).toBe(true);
    expect(response.result?.name).toEqual('test');
    productId = response.result?._id;
    const getResponse = await ProductsRealm.getAllProducts({
      tags: ['tag1', 'tag2'],
      category: 'category',
    });
    expect(getResponse.isSuccess).toBe(true);
    expect(getResponse.result?.length).toBe(1);
  });

  it('should update product', async () => {
    expect.assertions(3);
    const response = productId
      ? await ProductsRealm.updateProduct({
          _id: productId,
          name: 'Taekwondo',
          updated_by: 'mike',
          updated_by_user_id: '123',
        })
      : undefined;
    expect(ProductsRealm.openProductsRealm).toHaveBeenCalled();
    expect(response?.isSuccess).toBe(true);
    expect(response?.result?.name).toEqual('Taekwondo');
  });

  it('can purchase product', async () => {
    expect.assertions(6);
    const createResponse = await ProductsRealm.createProduct({
      name: 'bear brand',
      description: 'makatulog',
      quantity: 10,
      price: 10,
      created_by: 'Mike',
      created_by_user_id: '123',
    });
    expect(createResponse.isSuccess).toBe(true);
    const getResponse = await ProductsRealm.getAllProducts();
    expect(getResponse.isSuccess).toBe(true);
    const { result } = getResponse;
    expect(result).toBeTruthy();
    let purchaseResponse: Response<ProductsRealm.Product[]> | undefined;
    if (result) {
      purchaseResponse = await ProductsRealm.purchaseProduct(
        result.map((r) => ({
          _id: r._id,
          quantity: 2,
        }))
      );
    }
    expect(purchaseResponse?.isSuccess).toBe(true);

    const result1 = purchaseResponse?.result && purchaseResponse.result[0];
    const result2 = purchaseResponse?.result && purchaseResponse.result[1];

    expect(result1?.quantity).toBe(10);
    expect(result2?.quantity).toBe(8);
  });

  it('should delete product', async () => {
    expect.assertions(1);
    const response = productId
      ? await ProductsRealm.deleteProduct(productId)
      : undefined;
    expect(response?.isSuccess).toBe(true);
  });
});
