export const Channels = {
  purchase: 'sales:purchase',
  getByProducts: 'sales:get-by-products',
  getByTransactions: 'sales:get-by-transactions',
  delete: 'sales:delete',
} as const;

export type SalesChannels = (typeof Channels)[keyof typeof Channels];
