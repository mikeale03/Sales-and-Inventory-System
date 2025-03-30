import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GcashAccount } from 'globalTypes/realm/gcashAccount.types';
import { useEffect, useState } from 'react';
import { Button, Card, Col, Row, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SetGcashAccountModal from 'renderer/components/gcashAccounts/setGashAccountModal';
import {
  deleteGcashAccount,
  getGcashAccounts,
} from 'renderer/service/gcashAccounts';

const GCashAccountsPage = () => {
  const [accounts, setAccounts] = useState<GcashAccount[]>([]);
  const [showSetGCashAccountModal, setShowSetGCashAccountModal] =
    useState(false);
  const [selectedAccount, setSelectedAccount] = useState<
    GcashAccount | undefined
  >();
  const navigate = useNavigate();

  const handleDeleteGCashAccount = async (number: string) => {
    const response = await deleteGcashAccount(number);

    if (response.isSuccess) {
      toast.success('Gcash Account deleted');
      setAccounts(accounts.filter((v) => v.number !== number));
    } else {
      toast.error('Failed to delete access code');
    }
  };

  const handleShowSetGCashAccountModal = (account?: GcashAccount) => {
    setSelectedAccount(account);
    setShowSetGCashAccountModal(true);
  };

  const onAddAccount = (newAccount: GcashAccount) =>
    setAccounts([newAccount, ...accounts]);

  const onUpdateAccount = (newAccount: GcashAccount) =>
    setAccounts(
      accounts.map((v) =>
        selectedAccount?.number === v.number ? newAccount : v
      )
    );

  useEffect(() => {
    (async () => {
      const { isSuccess, result } = await getGcashAccounts();
      if (isSuccess && result) setAccounts(result);
    })();
  }, []);

  return (
    <div>
      <SetGcashAccountModal
        show={showSetGCashAccountModal}
        toggle={setShowSetGCashAccountModal}
        selectedGcashAccount={selectedAccount}
        onCreate={onAddAccount}
        onUpdate={onUpdateAccount}
      />

      <h3>GCash Accounts</h3>
      <Button
        className="mb-3 mt-1"
        onClick={() => handleShowSetGCashAccountModal()}
      >
        Add GCash Account
      </Button>
      <Row>
        <Col xl="6" xxl="4">
          <Card className="mb-3">
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Number</th>
                    <th>Name</th>
                    <th>MPIN</th>
                    <th>Email</th>
                    <th> </th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((d) => (
                    <tr key={d.number}>
                      <td>{d.number}</td>
                      <td>{d.name}</td>
                      <td>{d.mpin}</td>
                      <td>{d.email}</td>
                      <td>
                        <FontAwesomeIcon
                          onClick={() => handleShowSetGCashAccountModal(d)}
                          icon={faPenToSquare}
                          title="Edit"
                          size="xl"
                          className="me-2"
                        />
                        <FontAwesomeIcon
                          onClick={() => handleDeleteGCashAccount(d.number)}
                          icon={faTrashCan}
                          title="Delete"
                          size="xl"
                          className="me-2"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {accounts.length === 0 && (
                <span className="ms-2 fw-light fst-italic text-secondary">
                  no gcash accounts
                </span>
              )}
            </Card.Body>
          </Card>
          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Back
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default GCashAccountsPage;
