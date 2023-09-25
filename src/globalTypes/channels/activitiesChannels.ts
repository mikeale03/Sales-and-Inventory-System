export const Channels = {
  createProductAddActivity: 'activity:create-product-add',
  createProductEditActivity: 'activity:create-product-edit',
  createProductAddQtyActivity: 'activity:create-product-add-qty',
  createProductDeleteActivity: 'activity:delete-product',
  createSalesDeleteActivity: 'activity:delete-sales',
  getActivities: 'activity:get-activities',
} as const;

export type ActivitiesChannels = (typeof Channels)[keyof typeof Channels];
