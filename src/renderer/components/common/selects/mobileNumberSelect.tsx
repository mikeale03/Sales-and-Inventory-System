import { KeyboardEvent, forwardRef, useEffect, useState } from 'react';
import Select, { SelectInstance } from 'react-select';
import { debounce } from 'renderer/utils/helper';
import { MobileNumber } from 'globalTypes/realm/mobileNumber.types';
import { getMobileNumbers } from 'renderer/service/mobileNumbers';

type Opt = {
  value: string;
  label: string;
  mobileNumber: MobileNumber;
};

type Props = {
  onSelect: (mobileNumber: MobileNumber) => void;
  inputValue: string;
  onInputChange: (input: string) => void;
};

const handleGetMobileNumbers = debounce(async (searchText: string) => {
  return getMobileNumbers(searchText);
}, 300);

const MobileNumberSelect = forwardRef<SelectInstance<Opt> | null, Props>(
  ({ onSelect, inputValue, onInputChange }, ref) => {
    const [options, setOptions] = useState<Opt[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [menuIsOpen, setMenuIsOpen] = useState(false);

    const handleGetOptions = async (searchText: string): Promise<Opt[]> => {
      const response = await handleGetMobileNumbers(searchText);
      if (response?.isSuccess && response.result) {
        const data = response.result;
        const opts: Opt[] = data.map((item) => ({
          value: item.number,
          label: `${item.number} - ${item.name}`,
          mobileNumber: item,
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
        // onInputChange('');
        setMenuIsOpen(false);
      }
    };

    const onBlur = () => {
      onInputChange(inputValue);
    };

    useEffect(() => {
      (async () => {
        setIsLoading(true);
        const opt = await handleGetOptions(inputValue);
        setIsLoading(false);
        setOptions(opt);
      })();
    }, [inputValue]);

    return (
      <Select
        ref={ref}
        isClearable
        isSearchable
        inputValue={inputValue}
        onInputChange={handleInputChange}
        // value={null}
        onChange={(opt) => opt && !isLoading && onSelect(opt.mobileNumber)}
        options={options}
        autoFocus
        onKeyDown={onKeyDown}
        isLoading={isLoading}
        menuIsOpen={menuIsOpen}
        onMenuOpen={() => setMenuIsOpen(true)}
        onMenuClose={() => setMenuIsOpen(false)}
        onBlur={onBlur}
      />
    );
  }
);

export default MobileNumberSelect;
