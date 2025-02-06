/* eslint-disable radix */
import { useEffect, useState, useContext, useMemo, useCallback } from 'react';
import {
  Button,
  Table,
  Card,
  Row,
  Col,
  FormControl,
  Badge,
} from 'react-bootstrap';
import { debounce, pesoFormat } from 'renderer/utils/helper';
import { deleteProduct, getProducts } from 'renderer/service/products';
import AddQuantityModal from 'renderer/components/products/addQuantityModal';
import SetProductModal from 'renderer/components/products/setProductModal';
import ConfirmationModal from 'renderer/components/common/modals/confirmation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { Product } from 'main/service/productsRealm';
import { toast } from 'react-toastify';
import UserContext from 'renderer/context/userContext';
import format from 'date-fns/format';
import { createProductDeleteActivity } from 'renderer/service/activities';
import ProductsFilter from 'renderer/components/products/productsFilter';

type Filter = { category: string; tags: string[] };

const ProductsPage = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [products, setProducts] = useState<Product[]>([]);
  const [showSetProductModal, setShowSetProductModal] =
    useState<boolean>(false);
  const [showAddQuantityModal, setShowAddQuantityModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [pageSize] = useState(50);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState<Filter>({
    category: '',
    tags: [],
  });
  const [searchInput, setSearchInput] = useState('');
  const [searchText, setSearchText] = useState('');
  const { user } = useContext(UserContext);

  const handleGetProducts = useCallback(async () => {
    const response = await getProducts({
      searchText,
      sortProp: 'name',
      sortAs: 'asc',
      ...filter,
    });
    if (response.isSuccess) {
      const data = response.result;
      const prods = data ?? [];
      setTotalPages(Math.ceil(prods.length / pageSize));
      setProducts(prods);
    }
  }, [pageSize, filter, searchText]);

  const handleUpdateProduct = async (product: Product) => {
    setProducts(
      products.map((prod) => (prod._id === product._id ? product : prod))
    );
  };

  const handleAddProduct = async (product: Product) => {
    setProducts([product, ...products]);
  };

  const handleShowSetProductModal = (product: Product | undefined) => {
    setSelectedProduct(product);
    setShowSetProductModal(true);
  };

  const handleShowAddQuantityModal = (product: Product) => {
    setSelectedProduct(product);
    setShowAddQuantityModal(true);
  };

  const handleShowConfirmationModal = (product: Product) => {
    setSelectedProduct(product);
    setShowConfirmationModal(true);
  };

  const handleDeleteProduct = async () => {
    if (!user) return;
    if (selectedProduct) {
      const response = await deleteProduct(selectedProduct._id);
      if (response.isSuccess) {
        setProducts(
          products.filter((prod) => prod._id !== selectedProduct._id)
        );
        createProductDeleteActivity({
          product: selectedProduct,
          transact_by: user.username,
          transact_by_user_id: user._id,
          product_id: selectedProduct._id,
        });
      }
      toast.error(response.message);
    }
  };

  const handleSearchText = useMemo(
    () =>
      debounce<void>(async (search: string) => {
        setSearchText(search);
      }, 500),
    []
  );

  const handleSearchInput = (search: string) => {
    setSearchInput(search);
    handleSearchText(search);
  };

  const displayProducts = useMemo(() => {
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return products.slice(startIndex, endIndex);
  }, [pageNumber, pageSize, products]);

  useEffect(() => {
    handleGetProducts();
  }, [handleGetProducts]);

  return (
    <div>
      <SetProductModal
        show={showSetProductModal}
        toggle={setShowSetProductModal}
        selectedProduct={selectedProduct}
        onCreate={handleAddProduct}
        onUpdate={handleUpdateProduct}
      />

      <AddQuantityModal
        show={showAddQuantityModal}
        toggle={setShowAddQuantityModal}
        onUpdate={handleUpdateProduct}
        selectedProduct={selectedProduct}
      />

      <ConfirmationModal
        show={showConfirmationModal}
        toggle={setShowConfirmationModal}
        message={
          <p className="text-center">
            Are you sure to delete product name <b>{selectedProduct?.name}</b>
          </p>
        }
        onConfirm={handleDeleteProduct}
      />

      <h3>Products</h3>
      <Button
        className="mb-3 mt-1"
        onClick={() => handleShowSetProductModal(undefined)}
      >
        Add Product
      </Button>

      <ProductsFilter onFilter={setFilter} />

      <Card className="d-flex">
        <Card.Body className="flex-grow-1">
          <Row className="mb-3">
            <Col md="6">
              <FormControl
                type="search"
                placeholder="Search name or barcode"
                value={searchInput}
                onChange={(e) => handleSearchInput(e.target.value.trim())}
                autoFocus
              />
            </Col>
          </Row>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Barcode</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Category</th>
                <th>Tags</th>
                <th>Last Updated By</th>
                <th>Last Updated Date</th>
                <th>Verified</th>
                <th> </th>
              </tr>
            </thead>
            <tbody>
              {displayProducts.map((d) => (
                <tr key={d._id}>
                  <td className="text-capitalize">{d.name}</td>
                  <td>{d.barcode}</td>
                  <td>{pesoFormat(d.price)}</td>
                  <td>{d.quantity.toLocaleString()}</td>
                  <td>{d.category}</td>
                  <td>
                    {d.tags?.map((t) => (
                      <Badge key={t}>{t}</Badge>
                    ))}
                  </td>
                  <td>{d.updated_by}</td>
                  <td>
                    {d.date_updated &&
                      format(d.date_updated, 'MM/dd/yyy hh:mm aaa')}
                  </td>
                  <td className="text-center">
                    {d.inventory_verified && <FontAwesomeIcon icon={faCheck} />}
                  </td>
                  <td>
                    <FontAwesomeIcon
                      onClick={() => handleShowAddQuantityModal(d)}
                      icon={faCirclePlus}
                      title="Add quantity"
                      size="xl"
                      className="me-2 cursor-pointer"
                      role="button"
                      tabIndex={0}
                    />
                    {(user?.role === 'admin' || user?.role === 'manager') && (
                      <FontAwesomeIcon
                        onClick={() => handleShowSetProductModal(d)}
                        icon={faPenToSquare}
                        title="Edit"
                        size="xl"
                        className="me-2 cursor-pointer"
                        role="button"
                        tabIndex={0}
                      />
                    )}
                    {(user?.role === 'admin' ||
                      (user?.role === 'manager' && !d.inventory_verified)) && (
                      <FontAwesomeIcon
                        onClick={() => handleShowConfirmationModal(d)}
                        icon={faTrashCan}
                        title="Delete"
                        size="xl"
                        className="me-2 cursor-pointer"
                        role="button"
                        tabIndex={0}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {displayProducts.length === 0 && (
            <span className="ms-2 fw-light fst-italic text-secondary">
              no products
            </span>
          )}
        </Card.Body>
      </Card>
      <div className="d-flex justify-content-between align-items-center">
        <Button
          variant="outline-primary"
          onClick={() => pageNumber > 1 && setPageNumber(pageNumber - 1)}
        >
          Previous
        </Button>
        <p className="pt-3 fw-bold">{pageNumber}</p>
        <Button
          variant="outline-primary"
          onClick={() =>
            pageNumber < totalPages && setPageNumber(pageNumber + 1)
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ProductsPage;
