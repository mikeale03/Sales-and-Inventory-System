export const Channels = {
  purchase: 'sales:purchase',
  getByProducts: 'sales:get-by-products',
} as const;

export type SalesChannels = (typeof Channels)[keyof typeof Channels];
