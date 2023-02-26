import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Product } from 'main/service/productsRealm';
import { useState, useMemo } from 'react';
import { Card, Col, Row, Table } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';
import PaymentCard from 'renderer/components/cashRegister/paymentCard';
import QuantityInputModal from 'renderer/components/cashRegister/quantityInputModal';
import { getProducts } from 'renderer/service/products';
import { debounce, pesoFormat } from 'renderer/utils/helper';

type Value = {
  value: string;
  label: string;
  product: Product;
};

const handleGetProducts = debounce(async (searchText: string) => {
  return getProducts({
    searchText,
    sortProp: 'last_transaction_date',
    limit: 10,
  });
}, 300);

function CashRegisterPage() {
  const [showInputQuantityModal, setShowInputQuantityModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [isPaymentDone, setIsPaymentDone] = useState(false);
  const [value, setValue] = useState<Value | null>(null);
  const [items, setItems] = useState<
    Record<string, Product & { totalPrice: number }>
  >({});

  const itemKeys = useMemo(() => Object.keys(items), [items]);

  const handleGetOptions = async (searchText: string) => {
    const response = await handleGetProducts(searchText);
    window.console.log(response);
    if (response?.isSuccess && response.result) {
      const data = response.result;
      const opts: Value[] = data.map((item) => ({
        value: item._id,
        label: `${item.name} ${item.barcode ? `- ${item.barcode}` : ''}`,
        product: item,
      }));
      return opts;
    }
    return [];
  };

  const handleSelect = (option: Value | null) => {
    if (isPaymentDone) {
      setItems({});
      setIsPaymentDone(false);
    }
    const product = option?.product && { ...option.product };

    if (product) {
      const itemQuantity = items[product._id]?.quantity ?? 0;
      product.quantity -= itemQuantity;
    }
    setShowInputQuantityModal(true);
    setSelectedProduct(product);
    setValue(null);
  };

  const handleConfirmQuantity = async (
    quantity: string | number
  ): Promise<undefined | void> => {
    if (!selectedProduct) return;

    if (items[selectedProduct._id]) {
      const itemQuantity = items[selectedProduct._id].quantity;
      const { price } = items[selectedProduct._id];
      setItems({
        ...items,
        [selectedProduct._id]: {
          ...selectedProduct,
          quantity: itemQuantity + Number(quantity),
          totalPrice: price * (itemQuantity + Number(quantity)),
        },
      });
      return;
    }
    const product = { ...selectedProduct, totalPrice: selectedProduct.price };
    product.quantity = +quantity;
    product.totalPrice = product.price * +quantity;
    setItems({ ...items, [selectedProduct._id]: product });
  };

  const handleDeleteItem = (key: keyof typeof items) => {
    const newItems = { ...items };
    delete newItems[items[key]._id];
    setItems(newItems);
  };

  return (
    <div>
      <QuantityInputModal
        show={showInputQuantityModal}
        toggle={setShowInputQuantityModal}
        product={selectedProduct}
        onConfirm={handleConfirmQuantity}
      />

      <h3>Cash Register</h3>

      <AsyncSelect
        className="flex-grow-1"
        value={value}
        placeholder="Enter product name or barcode"
        onChange={handleSelect}
        loadOptions={handleGetOptions}
        defaultOptions
        isSearchable
        cacheOptions
        autoFocus
      />
      <Row className="my-3">
        <Col lg="8" style={{ position: 'relative' }}>
          <Card style={{ minHeight: '100%' }}>
            <Card.Body>
              <Table size="sm">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th className="text-center">Quantity</th>
                    <th className="text-center">Price</th>
                    <th className="text-center">Total Price</th>
                    <th> </th>
                  </tr>
                </thead>
                <tbody>
                  {itemKeys.map((key) => (
                    <tr key={items[key]._id}>
                      <td className="align-middle">{items[key].name}</td>
                      <td className="align-middle text-center">
                        {items[key].quantity}
                      </td>
                      <td className="align-middle text-center">
                        {pesoFormat(items[key].price)}
                      </td>
                      <td className="align-middle text-center">
                        {pesoFormat(items[key].totalPrice)}
                      </td>
                      <td className="align-middle text-center">
                        <FontAwesomeIcon
                          title="remove"
                          icon={faXmark}
                          className="btn"
                          onClick={() => handleDeleteItem(key)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {itemKeys.length === 0 && (
                <span className="ms-2 fw-light fst-italic text-secondary">
                  no items
                </span>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col lg="4">
          <PaymentCard
            items={items}
            onPaymentDone={() => setIsPaymentDone(true)}
            onReset={() => {
              setIsPaymentDone(false);
              setItems({});
            }}
          />
        </Col>
      </Row>
    </div>
  );
}

export default CashRegisterPage;
