import { useEffect, useState, ChangeEvent } from 'react';
import { Col, FormLabel, FormSelect, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { GetExpensesFilter } from 'globalTypes/realm/expenses.type';
import UsersSelect from 'renderer/components/common/selects/usersSelect';
import useExpensesFilterStore from 'renderer/store/filtersStore/expensesFilterStore';
import ExpenseTypeSelect from './expenseTypeSelect';
import StartEndDatePicker from '../common/startEndDatePicker';
import ShiftSelect from '../common/selects/shiftSelect';

export type OnFilterParams = { user: string; startDate: Date; endDate: Date };

export type Props = {
  onFilter: (filter: GetExpensesFilter) => void;
};

const ExpensesFilter = ({ onFilter }: Props) => {
  // const [filter, setFilter] = useState({
  //   selectedDate: new Date(),
  //   userOption: '',
  //   selectedPeriod: 'Daily',
  //   startDate: new Date(new Date().setHours(0, 0, 0, 0)),
  //   endDate: new Date(new Date().setHours(23, 59, 59, 999)),
  // });
  const { state: filter, setState: setFilter } = useExpensesFilterStore(
    (filterState) => filterState
  );
  const isDaily = filter.selectedPeriod === 'Daily';
  const [type, setType] = useState('all');

  useEffect(() => {
    const { userOption, startDate, endDate } = filter;

    let excludeItemCharge = false;
    let chargeToUser;
    if (type === 'all') {
      chargeToUser = undefined;
      excludeItemCharge = false;
    } else if (type === 'item charge') {
      chargeToUser = 'all'; // show all item charge type
      excludeItemCharge = false;
    } else if (type === 'not item charge') {
      excludeItemCharge = true; // hide all item charge type
      chargeToUser = undefined;
    } else {
      excludeItemCharge = false;
      chargeToUser = type;
    }
    onFilter({
      transactBy: userOption === 'all' ? '' : userOption,
      startDate,
      endDate,
      excludeItemCharge,
      chargeToUser,
    });
  }, [filter, onFilter, type]);

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
    setFilter({
      ...filter,
      selectedDate,
      selectedPeriod: period,
      startDate: sDate,
      endDate: eDate,
    });
  };

  const handlePeriodSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    if (!filter) return;
    const { value } = e.target;
    setDateRange(value, filter.selectedDate);
  };

  const handleDateSelect = (date: Date | null) => {
    if (!date) return;
    setDateRange(filter.selectedPeriod, date);
  };

  const handleStartTimeSelect = (hour: string) => {
    const { startDate } = filter;
    const [h] = hour.split(':');
    hour && startDate.setHours(+h, 0, 0, 0);
    setFilter({ ...filter, startDate });
  };

  const handleEndTimeSelect = (hour: string) => {
    const { endDate } = filter;
    if (hour === '23:59') {
      endDate.setHours(23, 59, 59, 999);
    } else if (hour) {
      const [h] = hour.split(':');
      endDate.setHours(+h, 0, 0, 0);
    }
    setFilter({ ...filter, endDate });
  };

  return (
    <>
      <Row>
        <Col lg="2" className="mb-3">
          <UsersSelect
            value={filter.userOption}
            onSelect={(value) => setFilter({ ...filter, userOption: value })}
          />
        </Col>
        <Col lg="2" className="mb-3">
          <ExpenseTypeSelect onSelect={setType} />
        </Col>
        <Col lg="2" className="mb-3">
          <FormLabel>Period</FormLabel>
          <FormSelect
            value={filter.selectedPeriod}
            onChange={handlePeriodSelect}
          >
            <option>Daily</option>
            <option>Monthly</option>
          </FormSelect>
        </Col>
        <Col lg="2" className="mb-3">
          <FormLabel>Select {isDaily ? 'Date' : 'Month'}</FormLabel>
          <DatePicker
            className="form-control"
            selected={filter?.selectedDate}
            onChange={handleDateSelect}
            dateFormat={
              filter?.selectedPeriod === 'Daily' ? 'MM/dd/yyyy' : 'MM/yyyy'
            }
            showMonthYearPicker={filter?.selectedPeriod === 'Monthly'}
            todayButton="Today"
          />
        </Col>
      </Row>
      <Row>
        <Col lg="2" className="mb-3">
          <FormLabel>Start {isDaily ? 'Time' : 'Date'}</FormLabel>
          <StartEndDatePicker
            selected={filter.startDate}
            onChange={(update) => setFilter({ ...filter, ...update })}
            isDaily={isDaily}
            startDate={filter.startDate}
            endDate={filter.endDate}
            type="start-date"
          />
        </Col>
        <Col lg="2" className="mb-3">
          <FormLabel>End {isDaily ? 'Time' : 'Date'}</FormLabel>
          <StartEndDatePicker
            selected={filter.endDate}
            onChange={(update) => setFilter({ ...filter, ...update })}
            isDaily={isDaily}
            startDate={filter.startDate}
            endDate={filter.endDate}
            type="end-date"
          />
        </Col>
        <Col lg="2" className="mb-3">
          <FormLabel>Shift</FormLabel>
          <ShiftSelect
            startDate={filter.startDate}
            endDate={filter.endDate}
            onSelect={(update) => setFilter({ ...filter, ...update })}
          />
        </Col>
      </Row>
    </>
  );
};

export default ExpensesFilter;
