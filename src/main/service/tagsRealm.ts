import Realm, { ObjectSchema } from 'realm';
import { updateById } from './realm';
import { TagRealm } from '../../globalTypes/realm/tags.types';

const TAGS = 'Tags';

export class TagsSchema extends Realm.Object {
  static schema: ObjectSchema = {
    name: TAGS,
    properties: {
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      date_created: 'date',
      name: 'string',
    },
    primaryKey: '_id',
  };
}

export const openTagsRealm = async () => {
  try {
    const realm = await Realm.open({
      path: '../realm/tags',
      schema: [TagsSchema],
      schemaVersion: 1,
    });
    return realm;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const createTag = async (name: string) => {
  const realm = await openTagsRealm();
  if (!realm) {
    return {
      isSuccess: false,
      message: 'Failed to open Tags Realm DB',
    };
  }

  try {
    let tag: TagRealm | undefined;
    realm.write(() => {
      tag = realm
        .create<TagRealm>(TAGS, {
          name,
          date_created: new Date(),
        })
        .toJSON() as TagRealm;
    });
    realm.close();
    return {
      isSuccess: true,
      message: 'Successfully created a tag',
      result: { ...tag, _id: tag?._id.toString() },
    };
  } catch (error) {
    realm.close();
    console.log(error);
    return {
      isSuccess: false,
      message: 'Failed to create a tag',
      error,
    };
  }
};

export const updateTag = async (_id: string, name: string) => {
  const realm = await openTagsRealm();
  if (!realm) {
    return {
      isSuccess: false,
      message: 'Failed to open Tags Realm DB',
    };
  }

  try {
    const update = updateById<TagRealm>(
      realm,
      TAGS,
      new Realm.BSON.ObjectID(_id),
      { name }
    )?.toJSON() as TagRealm;

    realm.close();

    if (!update) {
      return {
        isSuccess: false,
        message: 'Tags not found',
      };
    }

    return {
      isSuccess: true,
      message: 'Successfully updated a tag',
      result: { ...update, _id: update._id.toString() },
    };
  } catch (error) {
    realm.close();
    console.log(error);
    return {
      isSuccess: false,
      message: 'Failed to update a tag',
      error,
    };
  }
};

export const deleteTag = async (_id: string) => {
  const realm = await openTagsRealm();
  if (!realm) {
    return {
      isSuccess: false,
      message: 'Failed to open Tags Realm DB',
    };
  }
  try {
    let tag = realm?.objectForPrimaryKey<TagRealm>(
      TAGS,
      new Realm.BSON.ObjectID(_id)
    );

    if (!tag) {
      return {
        isSuccess: false,
        message: 'Tags not found',
      };
    }

    realm.write(() => {
      realm?.delete(tag);
      tag = null;
    });

    realm.close();
    return {
      isSuccess: true,
      message: 'Successfully deleted a product',
    };
  } catch (error) {
    realm.close();
    return {
      isSuccess: false,
      message: 'Failed to delete tag',
    };
  }
};

export const getTags = async () => {
  const realm = await openTagsRealm();
  if (!realm) {
    return {
      isSuccess: false,
      message: 'Failed to open Tags Realm DB',
    };
  }

  const categories = realm.objects<TagRealm>(TAGS);

  const categoriesObjects = categories.map((item) => {
    const { _id } = item;
    return {
      ...item.toJSON(),
      _id: _id.toString(),
    };
  });
  realm.close();

  return {
    isSuccess: true,
    message: 'Successfully get categories',
    result: categoriesObjects,
  };
};
