import Realm, { BSON } from 'realm';

export const create = <T extends {}>(realm: Realm, name: string, value: T) => {
  let task: (T & Realm.Object<unknown, never>) | undefined;
  realm.write(() => {
    task = realm.create<T>(name, value);
  });
  return task;
};

export const updateById = <T extends Record<string, any>>(
  realm: Realm,
  name: string,
  id: BSON.ObjectId,
  updates: Partial<T>
) => {
  const item = realm?.objectForPrimaryKey<T>(name, id);
  if (!item) return item;

  type ItemKey = keyof T;

  realm.write(() => {
    Object.keys(updates).forEach((key) => {
      if (key !== '_id' && item[key as ItemKey])
        item[key as ItemKey] = updates[key]!;
    });
  });
  return item;
};
