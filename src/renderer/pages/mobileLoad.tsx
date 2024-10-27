import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import {
  MobileLoad,
  MobileLoadFilterParams,
} from 'globalTypes/realm/mobileLoad.types';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Button, Card, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import ConfirmationModal from 'renderer/components/common/modals/confirmation';
import MobileLoadFilter from 'renderer/components/mobileLoad/mobileLoadFilter';
import SetMobileLoadModal, {
  MobileLoadResponse,
} from 'renderer/components/mobileLoad/setMobileLoadModal';
import UserContext from 'renderer/context/userContext';
import {
  createMobileLoad,
  deleteMobileLoad,
  getMobileLoads,
} from 'renderer/service/mobileLoads';
import { pesoFormat } from 'renderer/utils/helper';

const MobileLoadPage = () => {
  const [showMobileLoadModal, setShowMobileLoadModal] = useState(false);
  const [mobileLoads, setMobileLoads] = useState<MobileLoad[]>([]);
  const [selectedMobileLoad, setSelectedMobileLoad] = useState<
    MobileLoad | undefined
  >();
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [filter, setFilter] = useState<MobileLoadFilterParams | undefined>();
  const { user } = useContext(UserContext);

  const handleGetMobileLoads = useCallback(async () => {
    if (!filter) return;
    const response = await getMobileLoads(filter);
    if (response.isSuccess && response.result) {
      setMobileLoads(response.result);
    }
  }, [filter]);

  const handleSetMobileLoad = async (mobileLoad: MobileLoadResponse) => {
    if (!user) return;

    const response = await createMobileLoad({
      ...mobileLoad,
      transact_by: user.username,
      transact_by_user_id: user._id,
    });
    if (response.isSuccess) {
      handleGetMobileLoads();
    }
  };

  const handleDeleteMobileLoad = async () => {
    if (!selectedMobileLoad) return;
    const response = await deleteMobileLoad(selectedMobileLoad?._id);
    if (!response?.isSuccess) {
      toast.error(response.message);
      return;
    }
    setMobileLoads(mobileLoads.filter((d) => d._id !== selectedMobileLoad._id));
  };

  const handleShowConfirmation = async (selected: MobileLoad) => {
    setConfirmationModal(true);
    setSelectedMobileLoad(selected);
  };

  useEffect(() => {
    handleGetMobileLoads();
  }, [filter, handleGetMobileLoads]);

  return (
    <div>
      <ConfirmationModal
        show={confirmationModal}
        toggle={setConfirmationModal}
        message={
          <p className="text-center">
            Are you sure to delete Mobile Load transaction?.
          </p>
        }
        onConfirm={handleDeleteMobileLoad}
      />
      <SetMobileLoadModal
        show={showMobileLoadModal}
        toggle={setShowMobileLoadModal}
        onConfirm={handleSetMobileLoad}
      />
      <h3>Mobile Load</h3>
      <Button onClick={() => setShowMobileLoadModal(true)}>
        Add Mobile Load
      </Button>

      <div className="mt-3">
        <MobileLoadFilter onFilter={setFilter} />
      </div>

      <Card className="mt-3">
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Number</th>
                <th>Amount</th>
                <th>Charge</th>
                <th>Total Amount</th>
                <th>Source</th>
                <th>Date Transacted</th>
                <th>Transact By</th>
                <th>Date Created</th>
                <th> </th>
              </tr>
            </thead>
            <tbody>
              {mobileLoads.map((d) => (
                <tr key={d._id}>
                  <td>{d.number}</td>
                  <td>{pesoFormat(d.amount)}</td>
                  <td>{pesoFormat(d.charge)}</td>
                  <td>{pesoFormat(d.total_amount)}</td>
                  <td>{d.source}</td>
                  <td>
                    {format(
                      new Date(d.date_transacted),
                      'MM/dd/yyyy hh:mm aaa'
                    )}
                  </td>
                  <td>{d.transact_by}</td>
                  <td>
                    {format(new Date(d.date_created), 'MM/dd/yyyy hh:mm aaa')}
                  </td>
                  <td>
                    <FontAwesomeIcon
                      onClick={() => handleShowConfirmation(d)}
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
        </Card.Body>
      </Card>
    </div>
  );
};

export default MobileLoadPage;
