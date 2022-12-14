export interface IResponse<T> {
  isSuccess: boolean;
  result?: T;
  message: string;
  error?: unknown;
}

export type GetResponse<T> = IResponse<
  T & PouchDB.Core.IdMeta & PouchDB.Core.GetMeta
>;
export type CreateResponse<T> = IResponse<{ _id: string; _rev: string } & T>;
export type DeleteResponse = IResponse<PouchDB.Core.Response>;
export type AllDocsResponse<T extends Record<string, any>> = IResponse<
  PouchDB.Core.AllDocsResponse<T>
>;
