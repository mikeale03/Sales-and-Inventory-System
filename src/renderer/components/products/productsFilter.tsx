import { useEffect, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { MultiValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';

type Props = {
  onFilter: (filter: { category: string; tags: string[] }) => void;
};

const ProductsFilter = ({ onFilter }: Props) => {
  const [tags, setTags] = useState<
    MultiValue<{
      label: string;
      value: string;
      __new__: boolean;
    }>
  >([]);
  const [category, setCategory] = useState('');

  useEffect(() => {
    onFilter({
      category,
      tags: tags.map((v) => v.value),
    });
  }, [category, tags, onFilter]);

  return (
    <Row>
      <Col md="3">
        <Form.Group className="mb-3">
          <Form.Label>Tags</Form.Label>
          <CreatableSelect
            value={tags}
            isMulti
            isClearable
            onChange={(newValue) => setTags(newValue)}
          />
        </Form.Group>
      </Col>
    </Row>
  );
};

export default ProductsFilter;
