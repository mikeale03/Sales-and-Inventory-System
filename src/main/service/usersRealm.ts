import { Response } from 'globalTypes/realm/response.types';
import Realm from 'realm';
import { isValidPassword, saltAndHash } from '../util';

const USERS = 'Users';

export type User = {
  _id: string;
  username: string;
  password: string;
  salt: string;
  role: string;
  date_created: Date;
};

export class UsersSchema extends Realm.Object {
  static schema = {
    name: USERS,
    properties: {
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      username: 'string',
      password: 'string',
      salt: 'string',
      role: 'string',
      date_created: 'date',
    },
    primaryKey: '_id',
  };
}

export const openUsersRealm = async () => {
  try {
    const realm = await Realm.open({
      path: 'realm/users',
      schema: [UsersSchema],
      deleteRealmIfMigrationNeeded: true,
    });
    return realm;
  } catch (error) {
    return undefined;
  }
};

export const createUser = async (user: {
  username: string;
  password: string;
  role: 'admin' | 'staff';
}): Promise<Response<User>> => {
  const realm = await openUsersRealm();
  if (!realm)
    return {
      isSuccess: false,
      message: 'Error opening Sales realm db',
    };

  const users = realm.objects<User>(USERS);
  let task: (User & Realm.Object<unknown, never>) | undefined;

  if (users.filtered(`username == '${user.username}'`).length) {
    return {
      isSuccess: false,
      message: 'Username already exist!',
    };
  }
  const { salt, hash } = saltAndHash(user.password);
  try {
    realm.write(() => {
      task = realm?.create<User>(USERS, {
        ...user,
        password: hash,
        salt,
        date_created: new Date(),
      });
    });
  } catch (error) {
    realm?.close();
    return {
      isSuccess: false,
      error,
      message: 'Failed to create product',
    };
  }

  const userObj = task?.toJSON() as User;
  realm.close();
  return {
    isSuccess: true,
    message: 'Successfully created a user',
    result: {
      ...userObj,
      _id: userObj._id.toString(),
    },
  };
};

export const getUsersQuantity = async (): Promise<Response<number>> => {
  const realm = await openUsersRealm();
  if (!realm)
    return {
      isSuccess: false,
      message: 'Error opening Sales realm db',
    };

  const quantity = realm.objects(USERS).length;
  return {
    isSuccess: true,
    result: quantity,
    message: 'Successfully get users quantity',
  };
};

export const userLogin = async (
  username: string,
  password: string
): Promise<Response<User>> => {
  const realm = await openUsersRealm();
  if (!realm)
    return {
      isSuccess: false,
      message: 'Error opening Sales realm db',
    };

  const users = realm.objects<User>(USERS);
  const user = users.filtered(`username == '${username}'`)[0];

  if (user && isValidPassword(password, user.password, user.salt)) {
    const userObj = user.toJSON() as User;
    realm.close();
    return {
      isSuccess: true,
      message: 'Successfully login!',
      result: {
        ...userObj,
        _id: userObj._id.toString(),
      },
    };
  }
  realm.close();
  return {
    isSuccess: false,
    message: 'Invalid username or password',
  };
};
