import { Response } from 'globalTypes/realm/response.types';
import { User, UserCreate, UserUpdate } from 'globalTypes/realm/user.types';
import Realm, { ObjectSchema } from 'realm';
import { isValidPassword, saltAndHash } from '../util';

const USERS = 'Users';

export class UsersSchema extends Realm.Object {
  static schema: ObjectSchema = {
    name: USERS,
    properties: {
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      username: 'string',
      password: 'string',
      salt: 'string',
      role: 'string',
      accessCode: 'string?',
      date_created: 'date',
    },
    primaryKey: '_id',
  };
}

export const openUsersRealm = async () => {
  try {
    const realm = await Realm.open({
      path: '../realm/users',
      schema: [UsersSchema],
      schemaVersion: 2,
    });
    return realm;
  } catch (error) {
    return undefined;
  }
};

export const createUser = async (user: UserCreate): Promise<Response<User>> => {
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

  const { _id, username, role, date_created } = task?.toJSON() as User;

  realm.close();
  return {
    isSuccess: true,
    message: 'Successfully created a user',
    result: { _id: _id.toString(), username, role, date_created },
  };
};

export const getAdminUsersQuantity = async (): Promise<Response<number>> => {
  const realm = await openUsersRealm();
  if (!realm)
    return {
      isSuccess: false,
      message: 'Error opening Sales realm db',
    };

  const quantity = realm.objects(USERS).filtered("role == 'admin'").length;
  realm.close();
  return {
    isSuccess: true,
    result: quantity,
    message: 'Successfully get admin users quantity',
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

  const users = realm.objects<Required<User>>(USERS);
  const user = users.filtered(`username == '${username}'`)[0];

  if (user && isValidPassword(password, user.password, user.salt)) {
    const { _id, role, date_created } = user.toJSON() as User;
    realm.close();
    return {
      isSuccess: true,
      message: 'Successfully login!',
      result: { _id: _id.toString(), username, role, date_created },
    };
  }
  realm.close();
  return {
    isSuccess: false,
    message: 'Invalid username or password',
  };
};

export const getUsers = async () => {
  const realm = await openUsersRealm();
  if (!realm)
    return {
      isSuccess: false,
      message: 'Error opening Sales realm db',
    };
  let users: User[];
  try {
    users = realm.objects(USERS).toJSON() as User[];
  } catch (error) {
    realm.close();
    return {
      isSucces: false,
      message: 'Failed to get users',
      error,
    };
  }
  realm.close();
  return {
    isSuccess: true,
    result: users.map((user) => {
      const { _id, username, role, accessCode, date_created } = user;
      return { _id: _id.toString(), username, role, accessCode, date_created };
    }),
    message: 'Successfully get users',
  };
};

export const updateUser = async (updates: UserUpdate) => {
  const realm = await openUsersRealm();
  if (!realm)
    return {
      isSuccess: false,
      message: 'Error opening Sales realm db',
    };
  const user = realm.objectForPrimaryKey<User>(
    USERS,
    new Realm.BSON.ObjectID(updates._id)
  );
  if (!user)
    return {
      isSuccess: false,
      message: 'User _id not found',
    };

  if (updates.username !== user.username) {
    const users = realm.objects(USERS);
    if (users.filtered(`username == '${updates.username}'`).length) {
      return {
        isSuccess: false,
        message: 'Username already exist!',
      };
    }
  }
  try {
    realm.write(() => {
      const { username, password, role, accessCode } = updates;
      if (username) user.username = username;
      if (role) user.role = role;
      if (password) {
        const { salt, hash } = saltAndHash(password);
        user.password = hash;
        user.salt = salt;
      }
      if (accessCode !== undefined) {
        user.accessCode = accessCode;
      }
    });

    const { _id, username, role, date_created, accessCode } =
      user.toJSON() as User;

    realm.close();
    return {
      isSuccess: true,
      message: 'Successfully updated user',
      result: { _id: _id.toString(), username, role, accessCode, date_created },
    };
  } catch (error) {
    realm.close();
    return {
      isSucces: false,
      message: 'Failed to update user',
      error,
    };
  }
};

export const deleteUser = async (id: string) => {
  const realm = await openUsersRealm();
  if (!realm)
    return {
      isSuccess: false,
      message: 'Error opening Sales realm db',
    };

  let user = realm.objectForPrimaryKey<User>(
    USERS,
    new Realm.BSON.ObjectID(id)
  );
  try {
    realm.write(() => {
      user && realm.delete(user);
      user = null;
    });
    realm?.close();
    return {
      isSuccess: true,
      message: 'Successfully deleted a user',
    };
  } catch (error) {
    realm?.close();
    return {
      isSuccess: false,
      message: 'Failed to delete a user',
      error,
    };
  }
};
