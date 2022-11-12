import { IResponse } from '../response.interface';
import { User } from './users.interface';

export type CreateResponse = IResponse<PouchDB.Core.Response>;
export type DeleteResponse = IResponse<undefined>;
export type GetResponse = IResponse<
  User & PouchDB.Core.IdMeta & PouchDB.Core.GetMeta
>;
