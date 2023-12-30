import { ExpenseDescriptionJson } from 'globalTypes/realm/expenses.type';

function ItemChargeDescription({
  description,
}: {
  description: ExpenseDescriptionJson;
}) {
  return (
    <>
      <p className="m-0">Charge to: {description.chargeToUser}</p>
      {description.items.map((item) => (
        <p className="m-0" key={item.productId}>
          Item: {item.productName}, Qty: {item.quantity.toLocaleString()},
          Amount: {item.amount.toLocaleString()}
        </p>
      ))}
    </>
  );
}

export default ItemChargeDescription;
