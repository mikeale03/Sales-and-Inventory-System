import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { getCategories } from 'renderer/service/categories';

type Props = {
  value: string;
  onSelect: (selected: string) => void;
  defaltValue?: string;
  options?: string[];
};

const CategorySelect = ({ value, onSelect, defaltValue, options }: Props) => {
  const [opts, setOpts] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      if (options) {
        setOpts(options);
        return;
      }
      const response = await getCategories();
      if (response.isSuccess && response.result) {
        setOpts(response.result.map((v) => v.name));
      }
    })();
  }, [options]);

  return (
    <Form.Group>
      <Form.Label>Category</Form.Label>
      <Form.Control
        as="select"
        value={value}
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="">{defaltValue}</option>
        {opts.map((opt, ind) => (
          // eslint-disable-next-line react/no-array-index-key
          <option key={`${ind}`}>{opt}</option>
        ))}
      </Form.Control>
    </Form.Group>
  );
};

export default CategorySelect;
