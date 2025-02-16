import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MobileNumber } from 'globalTypes/realm/mobileNumber.types';
import { useEffect, useState } from 'react';
import { Button, Card, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import ConfirmationModal from 'renderer/components/common/modals/confirmation';
import SetMobileNumberModal from 'renderer/components/mobileNumbers/setMobileNumberModal';
import {
  getMobileNumbers,
  deleteMobileNumber,
} from 'renderer/service/mobileNumbers';

function MobileNumbersPage() {
  const [mobileNumbers, setMobileNumbers] = useState<MobileNumber[]>([]);
  const [mobileNumberModal, setMobileNumberModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedMobileNumber, setSelectedMobileNumber] = useState<
    MobileNumber | undefined
  >();
  const [searchText, setSearchText] = useState('');

  const handleDeleteMobileNumber = async () => {
    if (!selectedMobileNumber) return;
    const response = await deleteMobileNumber(selectedMobileNumber.number);
    if (response.isSuccess) {
      setMobileNumbers(
        mobileNumbers.filter(
          (item) => item.number !== selectedMobileNumber.number
        )
      );
    } else toast.error(response.message);
  };

  const handleShowConfirmationModal = (mn: MobileNumber) => {
    setSelectedMobileNumber(mn);
    setShowConfirmationModal(true);
  };

  const handleSetMobileNumberSuccess = (mobileNumber: MobileNumber) => {
    if (selectedMobileNumber) {
      setMobileNumbers(
        mobileNumbers.map((mn) =>
          selectedMobileNumber.number === mn.number ? mobileNumber : mn
        )
      );
    } else {
      setMobileNumbers([mobileNumber, ...mobileNumbers]);
    }
  };

  const handleSetMobileNumberModal = (mobileNumber?: MobileNumber) => {
    setSelectedMobileNumber(mobileNumber);
    setMobileNumberModal(true);
  };

  useEffect(() => {
    (async () => {
      const response = await getMobileNumbers(searchText);
      if (response.isSuccess && response.result) {
        setMobileNumbers(response.result);
      } else {
        toast.error(response.message);
      }
    })();
  }, [searchText]);

  return (
    <div>
      <ConfirmationModal
        show={showConfirmationModal}
        toggle={setShowConfirmationModal}
        message={
          <p className="text-center">
            Are you sure to delete this Mobile Number?
          </p>
        }
        onConfirm={handleDeleteMobileNumber}
      />
      <SetMobileNumberModal
        show={mobileNumberModal}
        toggle={setMobileNumberModal}
        selectedMobileNumber={selectedMobileNumber}
        onSuccess={handleSetMobileNumberSuccess}
      />
      <h3>Mobile Numbers</h3>
      <Button
        className="mb-3 mt-1"
        onClick={() => handleSetMobileNumberModal()}
      >
        Add Mobile Number
      </Button>

      <Card>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Number</th>
                <th>Name</th>
                <th> </th>
              </tr>
            </thead>
            <tbody>
              {mobileNumbers.map((number) => (
                <tr key={number.number}>
                  <td>{number.number}</td>
                  <td>{number.name}</td>
                  <td>
                    <FontAwesomeIcon
                      onClick={() => handleSetMobileNumberModal(number)}
                      icon={faPenToSquare}
                      title="Edit"
                      size="xl"
                      className="me-2 cursor-pointer"
                      role="button"
                      tabIndex={0}
                    />
                    <FontAwesomeIcon
                      onClick={() => handleShowConfirmationModal(number)}
                      icon={faTrashCan}
                      title="Delete"
                      size="xl"
                      className="me-2 cursor-pointer"
                      role="button"
                      tabIndex={0}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {mobileNumbers.length === 0 && (
            <span className="ms-2 fw-light fst-italic text-secondary">
              no numbers
            </span>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default MobileNumbersPage;
