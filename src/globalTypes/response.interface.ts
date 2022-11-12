export interface Response<T> {
  isSuccess: boolean;
  result?: T;
  message: string;
  error?: unknown;
}
