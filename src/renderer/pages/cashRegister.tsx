import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Product } from 'main/service/productsRealm';
import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Card, Col, Row, Table } from 'react-bootstrap';
import { useOutletContext } from 'react-router-dom';
import AsyncSelect from 'react-select/async';
import { toast } from 'react-toastify';
import {
  GroupBase,
  OptionsOrGroups,
  SelectInstance,
} from 'react-select/dist/declarations/src';
import PaymentCard from 'renderer/components/cashRegister/paymentCard';
import PaymentConfirmationModal from 'renderer/components/cashRegister/paymentConfirmationModal';
import QuantityInputModal from 'renderer/components/cashRegister/quantityInputModal';
import { getProducts } from 'renderer/service/products';
import { debounce, pesoFormat } from 'renderer/utils/helper';
import { BarcodeContext } from './home';

type Opt = {
  value: string;
  label: string;
  product: Product;
};

const handleGetProducts = debounce(async (searchText: string) => {
  return getProducts({
    searchText,
    sortProp: 'last_transaction_date',
    limit: 20,
  });
}, 300);

function CashRegisterPage() {
  const [showInputQuantityModal, setShowInputQuantityModal] = useState(false);
  const [showPaymentConfirmationModal, setShowPaymentConfirmationModal] =
    useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [paymentAmount, setPaymentAmount] = useState('');
  const [value, setValue] = useState<Opt | null>(null);
  const [items, setItems] = useState<
    Record<string, Product & { totalPrice: number }>
  >({});
  const [defaultOptions, setDefaultOptions] = useState<
    OptionsOrGroups<Opt, GroupBase<Opt>> | undefined
  >();
  const productSelectRef = useRef<SelectInstance<Opt> | null>(null);
  const itemKeys = useMemo(() => Object.keys(items), [items]);
  const { barcode, setBarcode } = useOutletContext<BarcodeContext>();

  const handleGetOptions = async (
    searchText: string
  ): Promise<OptionsOrGroups<Opt, GroupBase<Opt>>> => {
    const response = await handleGetProducts(searchText);
    if (response?.isSuccess && response.result) {
      const data = response.result;
      const opts: Opt[] = data.map((item) => ({
        value: item._id,
        label: `${item.name} - ${pesoFormat(item.price)} ${
          item.barcode ? `-    #${item.barcode}` : ''
        }`,
        product: item,
      }));
      return opts;
    }
    return [];
  };

  const handleSelect = (option: Opt | null) => {
    const product = option?.product && { ...option.product };

    if (product) {
      const itemQuantity = items[product._id]?.quantity ?? 0;
      product.quantity -= itemQuantity;
    }
    setShowInputQuantityModal(true);
    setSelectedProduct(product);
    setValue(null);
  };

  const handleConfirmQuantity = useCallback(
    async (quantity: string | number): Promise<undefined | void> => {
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
    },
    [items, selectedProduct]
  );

  const handleDeleteItem = (key: keyof typeof items) => {
    const newItems = { ...items };
    delete newItems[items[key]._id];
    setItems(newItems);
  };

  useEffect(() => {
    productSelectRef.current?.focus();
  }, [items]);

  useEffect(() => {
    (async () => {
      if (barcode) {
        const response = await handleGetProducts(barcode);
        if (response?.isSuccess && response.result) {
          if (!response.result.length) {
            toast.error('Barcode not found!');
            return;
          }
          setShowInputQuantityModal(true);
          setSelectedProduct(response.result[0]);
          setValue(null);
          setBarcode('');
        } else {
          toast.error(response.message);
        }
      }
    })();
  }, [barcode, setBarcode]);

  return (
    <>
      <QuantityInputModal
        show={showInputQuantityModal}
        toggle={setShowInputQuantityModal}
        product={selectedProduct}
        onConfirm={handleConfirmQuantity}
      />
      <PaymentConfirmationModal
        show={showPaymentConfirmationModal}
        toggle={setShowPaymentConfirmationModal}
        items={items}
        paymentAmount={+paymentAmount}
        onSuccess={useCallback(async () => {
          setPaymentAmount('');
          setItems({});
          const opts = await handleGetOptions('');
          setDefaultOptions(opts);
        }, [])}
        onExited={useCallback(() => {
          setTimeout(() => productSelectRef.current?.focus(), 50);
        }, [])}
      />
      <div>
        <h3>Cash Register</h3>

        <AsyncSelect
          ref={productSelectRef}
          className="flex-grow-1"
          value={value}
          placeholder="Enter product name or barcode"
          onChange={handleSelect}
          loadOptions={handleGetOptions}
          defaultOptions={defaultOptions ?? true}
          isSearchable
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
              paymentAmount={paymentAmount}
              setPaymentAmount={setPaymentAmount}
              onPayment={useCallback(() => {
                setShowPaymentConfirmationModal(true);
              }, [])}
            />
          </Col>
        </Row>
      </div>
    </>
  );
}

export default CashRegisterPage;
