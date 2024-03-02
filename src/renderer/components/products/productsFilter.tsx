import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import TagsSelect from '../common/selects/tagsSelect';

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
      <Col md="3">
        <TagsSelect value={tags} onChange={setTags} isCreatable />
      </Col>
    </Row>
  );
};

export default ProductsFilter;
