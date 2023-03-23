import Realm, { BSON } from 'realm';

export const create = <T extends {}>(realm: Realm, name: string, value: T) => {
  let task: (T & Realm.Object<unknown, never>) | undefined;
  realm.write(() => {
    task = realm.create<T>(name, value);
  });
  return task;
};

export const updateById = <T extends {}>(
  realm: Realm,
  name: string,
  id: BSON.ObjectId,
  updates: T
) => {
  let task: (T & Realm.Object<unknown, never>) | undefined;

  const item = realm?.objectForPrimaryKey<T>(name, id) as T;

  type ItemKey = keyof typeof item;

  realm.write(() => {
    type UpdateKey = keyof typeof updates;
    Object.keys(updates).forEach((key) => {
      if (key !== '_id') item[key as ItemKey] = updates[key as UpdateKey];
    });
  });
  return task;
};
