import { ChangeEvent, useEffect } from 'react';
import { Form, FormSelect } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getGcashAccounts } from 'renderer/service/gcashAccounts';
import useGcashFilterStore from 'renderer/store/filtersStore/gcashFilterStore';
import useGcashAccountStore from 'renderer/store/gcashAccountsStore';

const GcashAccountFilterSelect = () => {
  const { isFetched, gcashAccounts, setGcashAccounts } = useGcashAccountStore(
    (state) => state
  );
  const { state: gcashTransFilter, setState: setGcashTransFilter } =
    useGcashFilterStore((filterState) => filterState);

  const { accountNumber } = gcashTransFilter;

  useEffect(() => {
    (async () => {
      if (!isFetched) {
        const { isSuccess, result, message } = await getGcashAccounts();
        if (isSuccess && result) {
          setGcashAccounts(result);
        } else {
          toast.error(message);
        }
      }
    })();
  }, [setGcashAccounts, isFetched]);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value: val } = e.target;
    const account = gcashAccounts.find((v) => v.number === val);
    setGcashTransFilter({
      ...gcashTransFilter,
      accountNumber: account?.number,
    });
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label>GCash Account</Form.Label>
      <FormSelect value={accountNumber} onChange={handleChange} required>
        <option value="">All</option>
        {gcashAccounts.map((v) => (
          <option key={v.number} value={v.number}>
            {v.name}
          </option>
        ))}
      </FormSelect>
    </Form.Group>
  );
};

export default GcashAccountFilterSelect;
