import { Form } from 'react-bootstrap';
import Select, { MultiValue } from 'react-select';
import { getTags } from 'renderer/service/tags';
import CreatableSelect from 'react-select/creatable';
import { useEffect, useState } from 'react';

export type Props = {
  value: string[];
  onChange: (tags: string[]) => void;
  isCreatable?: boolean;
  placeholder?: string;
  options?: string[];
};

function TagsSelect({
  value,
  onChange,
  isCreatable,
  placeholder,
  options,
}: Props) {
  const [opts, setOpts] = useState<
    MultiValue<{
      label: string;
      value: string;
      __new__: boolean;
    }>
  >([]);

  useEffect(() => {
    (async () => {
      if (options) {
        setOpts(
          options.map((v) => ({
            label: v,
            value: v,
            __new__: false,
          }))
        );
        return;
      }
      const response = await getTags();
      if (response.isSuccess && response.result) {
        setOpts(
          response.result.map((v) => ({
            label: v.name,
            value: v.name,
            __new__: false,
          }))
        );
      }
    })();
  }, [options]);

  return (
    <Form.Group>
      <Form.Label>Tags</Form.Label>
      {isCreatable ? (
        <CreatableSelect
          // value={opts.filter((v) => value.includes(v.value))}
          value={value.map((v) => ({ label: v, value: v, __new__: true }))}
          options={opts}
          isMulti
          isClearable
          onChange={(newValue) => onChange(newValue.map((v) => v.value))}
          placeholder={placeholder}
        />
      ) : (
        <Select
          value={opts.filter((v) => value.includes(v.value))}
          options={opts}
          isMulti
          isClearable
          onChange={(newValue) => onChange(newValue.map((v) => v.value))}
          placeholder={placeholder}
        />
      )}
    </Form.Group>
  );
}

export default TagsSelect;
