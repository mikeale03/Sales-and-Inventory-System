import {
  GcashTransDateFilterType,
  GcashTransFilterType,
} from 'globalTypes/realm/gcash.types';
import { User } from 'globalTypes/realm/user.types';
import { useContext, useEffect, useState, ChangeEvent } from 'react';
import { Col, FormLabel, FormSelect, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import UserContext from 'renderer/context/userContext';
import { getUsers } from 'renderer/service/users';
import useGcashFilterStore from 'renderer/store/filtersStore/gcashFilterStore';
import StartEndDatePicker from '../common/startEndDatePicker';
import ShiftSelect from '../common/selects/shiftSelect';

const GcashTransFilter = () => {
  const { user } = useContext(UserContext);
  const { state: gcashTransFilter, setState: setGcashTransFilter } =
    useGcashFilterStore((filterState) => filterState);
  const isDaily = gcashTransFilter.selectedPeriod === 'Daily';
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const response = await getUsers();
      if (response.isSuccess && response.result) {
        setUsers(response.result);
      }
    })();
    if (!gcashTransFilter.userOption) {
      setGcashTransFilter({
        ...gcashTransFilter,
        userOption: user._id,
      });
    }
  }, [user, gcashTransFilter, setGcashTransFilter]);

  const setDateRange = (period: string, selectedDate: Date) => {
    let sDate: Date;
    let eDate: Date;
    if (period === 'Daily') {
      sDate = new Date(new Date(selectedDate).setHours(0, 0, 0, 0));
      eDate = new Date(new Date(selectedDate).setHours(23, 59, 59, 999));
    } else {
      sDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        1,
        0,
        0,
        0,
        0
      );
      eDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );
    }
    setGcashTransFilter({
      ...gcashTransFilter,
      selectedDate,
      selectedPeriod: period,
      startDate: sDate,
      endDate: eDate,
    });
  };

  const handlePeriodSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    if (!gcashTransFilter) return;
    const { value } = e.target;
    setDateRange(value, gcashTransFilter.selectedDate);
  };

  const handleDateSelect = (date: Date | null) => {
    if (!date) return;
    setDateRange(gcashTransFilter.selectedPeriod, date);
  };

  const handleTypeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    if (!gcashTransFilter) return;
    const { value } = e.target;
    setGcashTransFilter({
      ...gcashTransFilter,
      selectedType:
        value === 'all' ? undefined : (value as GcashTransFilterType),
    });
  };

  const handleDateFilterSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    if (!gcashTransFilter) return;
    const { value } = e.target;
    setGcashTransFilter({
      ...gcashTransFilter,
      selectedDateFilter: value as GcashTransDateFilterType,
    });
  };

  return (
    <Row>
      <Col md="3" className="mb-3">
        <FormLabel>User</FormLabel>
        <FormSelect
          value={gcashTransFilter.userOption}
          onChange={(e) =>
            setGcashTransFilter({
              ...gcashTransFilter,
              userOption: e.target.value,
            })
          }
        >
          <option value="all">All</option>
          {users.map((opt) => (
            <option key={opt._id} value={opt._id}>
              {opt.username}
            </option>
          ))}
        </FormSelect>
      </Col>
      <Col md="3" className="mb-3">
        <FormLabel>Period</FormLabel>
        <FormSelect
          value={gcashTransFilter.selectedPeriod}
          onChange={handlePeriodSelect}
        >
          <option>Daily</option>
          <option>Monthly</option>
        </FormSelect>
      </Col>
      <Col md="3" className="mb-3">
        <FormLabel>Type</FormLabel>
        <FormSelect
          value={gcashTransFilter.selectedType ?? 'all'}
          onChange={handleTypeSelect}
        >
          <option value="all">All Type</option>
          <option value="cash in">Cash In</option>
          <option value="cash out">Cash Out</option>
        </FormSelect>
      </Col>
      <Col md="3" xl="2" className="mb-3">
        <FormLabel>Date Filter</FormLabel>
        <FormSelect
          value={gcashTransFilter.selectedDateFilter}
          onChange={handleDateFilterSelect}
        >
          <option>Date Transacted</option>
          <option>Date Created</option>
        </FormSelect>
      </Col>
      <Col md="3" className="mb-3">
        <FormLabel>Select {isDaily ? 'Date' : 'Month'}</FormLabel>
        <DatePicker
          className="form-control"
          selected={gcashTransFilter?.selectedDate}
          onChange={handleDateSelect}
          dateFormat={
            gcashTransFilter?.selectedPeriod === 'Daily'
              ? 'MM/dd/yyyy'
              : 'MM/yyyy'
          }
          showMonthYearPicker={gcashTransFilter?.selectedPeriod === 'Monthly'}
          todayButton="Today"
        />
      </Col>
      <Col md="3" className="mb-3">
        <FormLabel>Start {isDaily ? 'Time' : 'Date'}</FormLabel>
        <StartEndDatePicker
          selected={gcashTransFilter.startDate}
          onChange={(update) =>
            setGcashTransFilter({ ...gcashTransFilter, ...update })
          }
          isDaily={isDaily}
          startDate={gcashTransFilter.startDate}
          endDate={gcashTransFilter.endDate}
          type="start-date"
        />
      </Col>
      <Col md="3" className="mb-3">
        <FormLabel>End {isDaily ? 'Time' : 'Date'}</FormLabel>
        <StartEndDatePicker
          selected={gcashTransFilter.endDate}
          onChange={(update) =>
            setGcashTransFilter({ ...gcashTransFilter, ...update })
          }
          isDaily={isDaily}
          startDate={gcashTransFilter.startDate}
          endDate={gcashTransFilter.endDate}
          type="end-date"
        />
      </Col>
      <Col lg="3" className="mb-3">
        <FormLabel>Shift</FormLabel>
        <ShiftSelect
          startDate={gcashTransFilter.startDate}
          endDate={gcashTransFilter.endDate}
          onSelect={(update) =>
            setGcashTransFilter({ ...gcashTransFilter, ...update })
          }
        />
      </Col>
    </Row>
  );
};

export default GcashTransFilter;
