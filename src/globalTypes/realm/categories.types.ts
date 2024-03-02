import Realm from 'realm';

export type CategoryRealm = {
  _id: Realm.BSON.ObjectId;
  name: string;
  date_created: Date;
};

export type CategoryCreate = Omit<CategoryRealm, '_id' | 'date_created'>;
export type CategoryResult = Omit<CategoryRealm, '_id'> & { _id: string };
