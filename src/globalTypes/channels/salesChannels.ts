export const Channels = {
  purchase: 'sales:purchase',
  getByProducts: 'sales:get-by-products',
  getByTransactions: 'sales:get-by-transactions',
  delete: 'sales:delete',
  void: 'sales:void',
  updateByGcashDelete: 'sales:update-by-gcash-delete',
  getSalesByDateRange: 'sales:get-by-date-range',
  getSalesGroupByDate: 'sales:get-group-by-date',
  createVoidCode: 'sales:create-void-code',
  getVoidCode: 'sales:get-void-code',
} as const;

export type SalesChannels = (typeof Channels)[keyof typeof Channels];
