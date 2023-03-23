export const Channels = {
  getTransactions: 'gcash:get-transactions',
  createTransactions: 'gcash:create-transactions',
} as const;

export type GcashChannels = (typeof Channels)[keyof typeof Channels];
