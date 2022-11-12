export type Response<T> = {
  isSuccess: boolean;
  result?: T;
  message: string;
  error?: unknown;
};
