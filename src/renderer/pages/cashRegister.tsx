import { Product } from 'main/service/productsRealm';
import { useState } from 'react';
import { Button, Card, Col, Table } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';
import { toast } from 'react-toastify';
import PaymentModal from 'renderer/components/cashRegister/paymentModal';
import QuantityInputModal from 'renderer/components/cashRegister/quantityInputModal';
import { getProducts } from 'renderer/service/products';
import { debounce } from 'renderer/utils/helper';

type Value = {
  value: string;
  label: string;
  product: Product;
};

const handleGetProducts = debounce(async (searchText) => {
  return getProducts(searchText);
}, 300);

function CashRegisterPage() {
  const [showInputQuantityModal, setShowInputQuantityModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [value, setValue] = useState<Value | null>(null);
  const [items, setItems] = useState<
    Record<string, Product & { totalPrice: number }>
  >({});

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

  const handleChange = (option: Value | null) => {
    const product = option?.product && { ...option.product };

    if (product) {
      const itemQuantity = items[product._id]?.quantity ?? 0;
      product.quantity -= itemQuantity;
    }
    setShowInputQuantityModal(true);
    setSelectedProduct(product);
    setValue(null);
  };

  const handleConfirm = async (
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

  return (
    <div>
      <QuantityInputModal
        show={showInputQuantityModal}
        toggle={setShowInputQuantityModal}
        product={selectedProduct}
        onConfirm={handleConfirm}
      />
      <PaymentModal
        show={showPaymentModal}
        toggle={setShowPaymentModal}
        items={items}
        onDone={() => setItems({})}
      />

      <h3>Cash Register</h3>

      <Col lg="6" className="d-flex flex-row">
        <AsyncSelect
          className="flex-grow-1 me-2"
          value={value}
          placeholder="Enter product name or barcode"
          onChange={handleChange}
          loadOptions={handleGetOptions}
          defaultOptions
          isSearchable
          cacheOptions
        />
        <Button
          onClick={() => setShowPaymentModal(true)}
          disabled={Object.keys(items).length === 0}
        >
          Payment
        </Button>
      </Col>

      <Card className="my-3">
        <Card.Body>
          <Table size="sm">
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(items).map((key) => (
                <tr key={items[key]._id}>
                  <td>{items[key].name}</td>
                  <td>{items[key].quantity}</td>
                  <td>{items[key].price}</td>
                  <td>{items[key].totalPrice}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}

export default CashRegisterPage;
