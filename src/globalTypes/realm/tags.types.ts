import Realm from 'realm';

export type TagRealm = {
  _id: Realm.BSON.ObjectId;
  name: string;
  date_created: Date;
};

export type TagCreate = Omit<TagRealm, '_id' | 'date_created'>;
export type TagResult = Omit<TagRealm, '_id'> & { _id: string };
