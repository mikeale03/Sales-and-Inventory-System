import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import TagsSelect from '../common/selects/tagsSelect';
import CategorySelect from '../common/selects/categorySelect';

type Props = {
  onFilter: (filter: { category: string; tags: string[] }) => void;
};

const ProductsFilter = ({ onFilter }: Props) => {
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState('');

  useEffect(() => {
    onFilter({
      category,
      tags,
    });
  }, [category, tags, onFilter]);

  return (
    <Row>
      <Col sm="6" xl="3">
        <CategorySelect
          value={category}
          onSelect={setCategory}
          defaltValue="All"
        />
      </Col>
      <Col sm="6" xl="3">
        <TagsSelect
          value={tags}
          onChange={setTags}
          isCreatable
          placeholder="All"
        />
      </Col>
    </Row>
  );
};

export default ProductsFilter;
