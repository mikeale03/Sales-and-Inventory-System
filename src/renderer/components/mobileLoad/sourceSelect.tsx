import { ChangeEvent, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getGcashAccounts } from 'renderer/service/gcashAccounts';
import useGcashAccountStore from 'renderer/store/gcashAccountsStore';

type Props = {
  value?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  asFilter?: boolean;
};

const SourceSelect = ({
  value,
  onChange,
  required = false,
  asFilter = false,
}: Props) => {
  const { isFetched, gcashAccounts, setGcashAccounts } = useGcashAccountStore(
    (state) => state
  );

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

  return (
    <Form.Group className="mb-3">
      <Form.Label>
        Source {required && <span className="text-danger">*</span>}
      </Form.Label>
      <Form.Control
        as="select"
        value={value ?? ''}
        onChange={onChange}
        required={required}
      >
        {asFilter && <option value="">All</option>}
        <option value="other">Other</option>
        {asFilter && <option value="gcash">Gcash</option>}
        {gcashAccounts.length > 0 ? (
          gcashAccounts.map((v) => (
            <option key={v.number} value={v.number}>
              {`${asFilter ? '' : 'Gcash - '}${v.name}`}
            </option>
          ))
        ) : (
          <option value="gcash">GCash</option>
        )}
      </Form.Control>
    </Form.Group>
  );
};

export default SourceSelect;
