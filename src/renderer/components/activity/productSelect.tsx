import { KeyboardEvent, forwardRef, useEffect, useState } from 'react';
import { Product } from 'main/service/productsRealm';
import Select, { SelectInstance } from 'react-select';
import { getProducts } from 'renderer/service/products';
import { debounce, toPascalCase } from 'renderer/utils/helper';

export type Opt = {
  value: string;
  label: string;
  product: Product;
};

type Props = {
  onSelect: (opt: Opt | null) => void;
  inputValue: string;
  onInputChange: (input: string) => void;
  value: Opt | null;
};

const handleGetProducts = debounce(async (searchText: string) => {
  return getProducts({
    searchText,
    sortProp: 'last_transaction_date',
    limit: 20,
  });
}, 300);

const ProductSelect = forwardRef<SelectInstance<Opt> | null, Props>(
  ({ onSelect, inputValue, onInputChange, value }, ref) => {
    const [productOptions, setProductOptions] = useState<Opt[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [menuIsOpen, setMenuIsOpen] = useState(false);

    const handleGetOptions = async (searchText: string): Promise<Opt[]> => {
      const response = await handleGetProducts(searchText);
      if (response?.isSuccess && response.result) {
        const data = response.result;
        const opts: Opt[] = data.map((item) => ({
          value: item._id,
          label: toPascalCase(item.name),
          product: item,
        }));
        return opts;
      }
      return [];
    };

    const handleInputChange = (input: string) => {
      input && setIsLoading(true);
      onInputChange(input);
    };

    const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.code === 'Enter') {
        setMenuIsOpen(false);
      }
    };

    useEffect(() => {
      (async () => {
        setIsLoading(true);
        const opt = await handleGetOptions(inputValue);
        setIsLoading(false);
        setProductOptions(opt);
      })();
    }, [inputValue]);

    return (
      <Select
        ref={ref}
        isClearable
        isSearchable
        inputValue={inputValue}
        onInputChange={handleInputChange}
        value={value}
        onChange={(opt) => onSelect(opt)}
        options={productOptions}
        autoFocus
        onKeyDown={onKeyDown}
        isLoading={isLoading}
        menuIsOpen={menuIsOpen}
        onMenuOpen={() => setMenuIsOpen(true)}
        onMenuClose={() => setMenuIsOpen(false)}
      />
    );
  }
);

export default ProductSelect;
