export type TResponse<T> = {
  isSuccess: boolean;
  result?: T;
  message: string;
  error?: unknown;
};
