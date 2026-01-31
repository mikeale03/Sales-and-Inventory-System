import AsyncSelect from 'react-select/async';
import { getCustomers } from 'renderer/service/mobileNumbers';

const handleGetCustomers = async (inputValue: string) => {
  const { isSuccess, result } = await getCustomers(inputValue, 20);
  if (isSuccess && result) {
    return result.map((i) => ({
      label: i.name,
      value: i.number,
    }));
  }
  return [];
};

const loadOptions = (
  inputValue: string,
  callback: (options: { label: string; value: string }[]) => void
) => {
  handleGetCustomers(inputValue)
    // eslint-disable-next-line promise/no-callback-in-promise
    .then((opt) => callback(opt))
    .catch((err) => console.error(err));
};

const CustomerSelect = () => {
  return <AsyncSelect cacheOptions loadOptions={loadOptions} defaultOptions />;
};

export default CustomerSelect;
