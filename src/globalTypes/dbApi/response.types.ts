import { Response } from '../response.interface';
import { User } from './users.interface';

export type CreateResponse = Response<PouchDB.Core.Response>;
export type DeleteResponse = Response<undefined>;
export type GetResponse = Response<
  User & PouchDB.Core.IdMeta & PouchDB.Core.GetMeta
>;
