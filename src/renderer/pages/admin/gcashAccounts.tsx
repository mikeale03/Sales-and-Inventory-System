import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GcashAccount } from 'globalTypes/realm/gcashAccount.types';
import { useEffect, useState } from 'react';
import { Button, Card, Col, Row, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ConfirmationModal from 'renderer/components/common/modals/confirmation';
import SetGcashAccountModal from 'renderer/components/gcashAccounts/setGashAccountModal';
import {
  deleteGcashAccount,
  getGcashAccounts,
} from 'renderer/service/gcashAccounts';
import useGcashAccountStore from 'renderer/store/gcashAccountsStore';

const GCashAccountsPage = () => {
  const [showSetGCashAccountModal, setShowSetGCashAccountModal] =
    useState(false);
  const [selectedAccount, setSelectedAccount] = useState<
    GcashAccount | undefined
  >();
  const [confirmationModal, setConfirmationModal] = useState(false);

  const { gcashAccounts, setGcashAccounts } = useGcashAccountStore(
    (state) => state
  );

  const navigate = useNavigate();

  const handleDeleteGCashAccount = async () => {
    if (!selectedAccount) return;

    const { number } = selectedAccount;
    const response = await deleteGcashAccount(number);

    if (response.isSuccess) {
      toast.success('Gcash Account deleted');
      const newAccounts = gcashAccounts.filter((v) => v.number !== number);
      setGcashAccounts(newAccounts);
    } else {
      toast.error('Failed to delete access code');
    }
  };

  const handleShowSetGCashAccountModal = (account?: GcashAccount) => {
    setSelectedAccount(account);
    setShowSetGCashAccountModal(true);
  };

  const onAddAccount = (newAccount: GcashAccount) =>
    setGcashAccounts([newAccount, ...gcashAccounts]);

  const onUpdateAccount = (newAccount: GcashAccount) =>
    setGcashAccounts(
      gcashAccounts.map((v) =>
        selectedAccount?.number === v.number ? newAccount : v
      )
    );

  useEffect(() => {
    (async () => {
      const { isSuccess, result } = await getGcashAccounts();
      if (isSuccess && result) {
        setGcashAccounts(result);
      }
    })();
  }, [setGcashAccounts]);

  return (
    <div>
      <ConfirmationModal
        show={confirmationModal}
        toggle={setConfirmationModal}
        message={
          <p className="text-center">Are sure to delete Gcash Account?</p>
        }
        onConfirm={handleDeleteGCashAccount}
      />
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
                  {gcashAccounts.map((d) => (
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
                          onClick={() => {
                            setSelectedAccount(d);
                            setConfirmationModal(true);
                          }}
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
              {gcashAccounts.length === 0 && (
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
