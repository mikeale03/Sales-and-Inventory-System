import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';
import {
  GetMobileLoadsResponse,
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
import { createGcashTransactions } from 'renderer/service/gcash';
import {
  createMobileLoad,
  deleteMobileLoad,
  getMobileLoads,
} from 'renderer/service/mobileLoads';
import { pesoFormat } from 'renderer/utils/helper';

const MobileLoadPage = () => {
  const [showMobileLoadModal, setShowMobileLoadModal] = useState(false);
  const [mobileLoads, setMobileLoads] = useState<GetMobileLoadsResponse[]>([]);
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
      console.log(response.result);
    }
  }, [filter]);

  const handleSetMobileLoad = async (mobileLoad: MobileLoadResponse) => {
    if (!user) return;

    const transaction_id = uuid();

    const response = await createMobileLoad({
      ...mobileLoad,
      transact_by: user.username,
      transact_by_user_id: user._id,
      transaction_id,
    });
    if (response.isSuccess) {
      handleGetMobileLoads();
    } else {
      toast.error(response.message);
      return;
    }

    if (mobileLoad.source === 'gcash') {
      const response2 = await createGcashTransactions([
        {
          type: 'mobile load',
          amount: mobileLoad.amount,
          charge: mobileLoad.charge,
          number: mobileLoad.number,
          date_transacted: mobileLoad.date_transacted,
          transact_by: user.username,
          transact_by_user_id: user._id,
          charge_payment: 'cash',
          transaction_id,
        },
      ]);
      if (!response2.isSuccess) {
        toast.error(response2.message);
      }
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
      <Button className="mt-1" onClick={() => setShowMobileLoadModal(true)}>
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
                  <td
                    title={d.numberName && d.number}
                    className={d.numberName && 'text-success'}
                  >
                    {d.numberName || d.number}
                  </td>
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
