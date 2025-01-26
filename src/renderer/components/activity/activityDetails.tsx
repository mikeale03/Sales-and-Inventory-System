import format from 'date-fns/format';
import { Activity } from 'globalTypes/realm/activities.types';
import { Gcash } from 'globalTypes/realm/gcash.types';
import { ProductForm } from 'globalTypes/realm/products.types';
import { Items, Sales } from 'globalTypes/realm/sales.types';
import { pesoFormat } from 'renderer/utils/helper';

export type Props = {
  activity: Activity;
};

function GcashDetails({ details }: { details: Gcash & { reason: string } }) {
  return (
    <div>
      <p className="m-0">Type: {details.type}</p>
      <p className="m-0">Amount: {details.amount.toLocaleString()}</p>
      <p className="m-0">Charge: {details.charge}</p>
      <p className="m-0">Number: {details.number}</p>
      {details.date_transacted && (
        <p className="m-0">
          Date Transacted:{' '}
          {format(new Date(details.date_transacted), 'MM/dd/yyyy hh:mm aaa')}
        </p>
      )}
      {details.date_created && (
        <p className="m-0">
          Date Created:{' '}
          {format(new Date(details.date_created), 'MM/dd/yyyy hh:mm aaa')}
        </p>
      )}
      <p className="m-0">
        Gcash Balance: {details.gcash_balance.toLocaleString()}
      </p>
      <p className="m-0">User: {details.transact_by}</p>
      <p className="m-0">Reason: {details.reason}</p>
    </div>
  );
}

function ProductDetails({ product }: { product: ProductForm }) {
  return (
    <div>
      <p className="m-0">Product Name: {product.name}</p>
      {product.barcode && <p className="m-0">Barcode: {product.barcode}</p>}
      <p className="m-0">Price: {product.price.toLocaleString()}</p>
      <p className="m-0">Quantity: {product.quantity.toLocaleString()}</p>
      {product.inventory_verified && (
        <p className="m-0">Verified: {String(product.inventory_verified)}</p>
      )}
    </div>
  );
}

function ProductEditDetails({
  details,
}: {
  details: {
    product_name: string;
    updates: {
      prop: string;
      from: string | number | boolean;
      to: string | number | boolean;
    }[];
  };
}) {
  return (
    <div>
      <p className="m-0">Product Name: {details.product_name}</p>
      {details.updates.map((d, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <p key={`${i}`} className="m-0">
          Change{' '}
          <span className="text-capitalize fw-bold">
            {d.prop === 'inventory_verified' ? 'Verified' : d.prop}
          </span>{' '}
          from{' '}
          <span className="text-capitalize fw-bold">
            {String(d.from ?? 'Blank') || 'Blank'}
          </span>{' '}
          to{' '}
          <span className="text-capitalize fw-bold">
            {String(d.to ?? 'Blank') || 'Blank'}
          </span>
        </p>
      ))}
    </div>
  );
}

function ProductAddQtyDetails({
  details,
}: {
  details: {
    product_name: string;
    quantity: number;
  };
}) {
  return (
    <div>
      <p className="m-0">Product Name: {details.product_name}</p>
      <p className="m-0">Quantity Added: {details.quantity}</p>
    </div>
  );
}

function SalesDetails({ details }: { details: Sales & { void_by: string } }) {
  return (
    <div>
      <p className="m-0">Product Name: {details.product_name}</p>
      <p className="m-0">Quantity: {details.quantity.toLocaleString()}</p>
      <p className="m-0">Total Price: {details.total_price.toLocaleString()}</p>
      <p className="m-0">Payment: {details.payment}</p>
      <p className="m-0">
        Sales Date:{' '}
        {format(new Date(details.date_created), 'MM/dd/yyyy hh:mm aaa')}
      </p>
      <p className="m-0">User: {details.transact_by}</p>
      {details.void_by && <p className="m-0">Voided by: {details.void_by}</p>}
    </div>
  );
}

function CancelCashRegisterDetails({ details }: { details: Items }) {
  const items = Object.values(details);
  const totalAmount = items.reduce((total, item) => total + item.totalPrice, 0);
  return (
    <div>
      {items.map((item) => (
        <p className="m-0" key={`${item._id}`}>
          {item.name} - {item.quantity} qty - {pesoFormat(item.totalPrice)}
        </p>
      ))}
      <p className="fw-bold">Total Amount: {pesoFormat(totalAmount)}</p>
    </div>
  );
}

function ActivityDetails({ activity }: Props) {
  const details = JSON.parse(activity.details);
  if (
    activity.activity === 'create product' ||
    activity.activity === 'delete product'
  )
    return <ProductDetails product={details} />;
  if (activity.activity === 'edit product')
    return <ProductEditDetails details={details} />;
  if (activity.activity === 'add product quantity')
    return <ProductAddQtyDetails details={details} />;
  if (
    activity.activity === 'delete sales' ||
    activity.activity === 'void sales'
  )
    return <SalesDetails details={details} />;
  if (activity.activity === 'delete gcash')
    return <GcashDetails details={details} />;
  if (activity.activity === 'cancel cash register')
    return <CancelCashRegisterDetails details={details} />;
  return <p> </p>;
}

export default ActivityDetails;
