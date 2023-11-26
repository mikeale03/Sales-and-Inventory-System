import format from 'date-fns/format';
import { Activity } from 'globalTypes/realm/activities.types';
import { ProductForm } from 'globalTypes/realm/products.types';
import { Sales } from 'globalTypes/realm/sales.types';

export type Props = {
  activity: Activity;
};

function ProductDetails({ product }: { product: ProductForm }) {
  return (
    <div>
      <p className="m-0">Product Name: {product.name}</p>
      {product.barcode && <p className="m-0">Barcode: {product.barcode}</p>}
      <p className="m-0">Price: {product.price}</p>
      <p className="m-0">Quantity: {product.quantity}</p>
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

function SalesDetails({ details }: { details: Sales }) {
  return (
    <div>
      <p className="m-0">Product Name: {details.product_name}</p>
      <p className="m-0">Quantity: {details.quantity}</p>
      <p className="m-0">Total Price: {details.total_price}</p>
      <p className="m-0">Payment: {details.payment}</p>
      <p className="m-0">
        Sales Date:{' '}
        {format(new Date(details.date_created), 'MM/dd/yyyy hh:mm aaa')}
      </p>
      <p className="m-0">User: {details.transact_by}</p>
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
  if (activity.activity === 'delete sales')
    return <SalesDetails details={details} />;
  return <p> </p>;
}

export default ActivityDetails;
