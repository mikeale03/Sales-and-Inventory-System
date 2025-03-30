export type GcashAccount = {
  name: string;
  number: string;
  mpin: string;
  email?: string;
};

export type GcashAccountCreate = Omit<GcashAccount, '_id'>;
