export interface IResponse<T> {
  isSuccess: boolean;
  result?: T;
  message: string;
  error?: unknown;
}
