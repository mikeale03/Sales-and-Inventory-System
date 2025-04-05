import { ChangeEvent, useEffect } from 'react';
import { Form, FormSelect } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getGcashAccounts } from 'renderer/service/gcashAccounts';
import { setSelectedGcashAccountStorage } from 'renderer/service/localStorage';
import useGcashAccountStore from 'renderer/store/gcashAccountsStore';
import useSelectedGcashAccountStore from 'renderer/store/selectedGcashAccountStore';

const GcashAccountSelect = () => {
  const { isFetched, gcashAccounts, setGcashAccounts } = useGcashAccountStore(
    (state) => state
  );
  const { selectedGcashAccount: acc, setSelectedGcashAccount } =
    useSelectedGcashAccountStore((state) => state);

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
    setSelectedGcashAccount(account ?? '');
    account && setSelectedGcashAccountStorage(account);
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label>
        GCash Account <span className="text-danger">*</span>
      </Form.Label>
      <FormSelect
        value={acc ? acc.number : ''}
        onChange={handleChange}
        required
      >
        <option value=""> </option>
        {gcashAccounts.map((v) => (
          <option key={v.number} value={v.number}>
            {v.name}
          </option>
        ))}
      </FormSelect>
    </Form.Group>
  );
};

export default GcashAccountSelect;
