import Realm from 'realm';
import * as CategoriesRealm from '../categoriesRealm';

describe('Category_Test', () => {
  const category = {
    name: 'test',
  };

  const config = {
    schema: [CategoriesRealm.CategoriesSchema],
  };

  let spy: jest.SpyInstance<Promise<Realm | undefined>, []>;
  let id: string | undefined;

  beforeAll(() => {
    spy = jest.spyOn(CategoriesRealm, 'openCategoriesRealm');
    spy.mockImplementation(async () => {
      try {
        const realm = await Realm.open(config);
        return realm;
      } catch (error) {
        console.log(error);
        return undefined;
      }
    });
  });

  afterAll(() => {
    spy.mockRestore();
    Realm.deleteFile(config);
  });

  it('should_create_and_get_category', async () => {
    expect.assertions(3);
    const response = await CategoriesRealm.createCategory(category.name);
    expect(CategoriesRealm.openCategoriesRealm).toHaveBeenCalled();
    expect(response.isSuccess).toBe(true);
    expect(response.result?.name).toEqual('test');
    // id = response.result?._id;
    // const getResponse = await CategoriesRealm.getAllProducts({
    //   tags: ['tag1', 'tag2'],
    //   category: 'category',
    // });
    // expect(getResponse.isSuccess).toBe(true);
    // expect(getResponse.result?.length).toBe(1);
  });
  it('should_update_category', async () => {
    expect.assertions(4);
    const response = await CategoriesRealm.createCategory(category.name);
    expect(response.isSuccess).toBe(true);
    expect(response.result?.name).toEqual('test');
    id = response.result?._id;
    const getResponse = await CategoriesRealm.updateCategory(id!, 'new name');
    console.log(getResponse.message);
    expect(getResponse.isSuccess).toBe(true);
    expect(getResponse.result?.name).toBe('new name');
  });
});
