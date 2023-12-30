import { useEffect, useState, ChangeEvent } from 'react';
import { Col, FormLabel, FormSelect, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { GetExpensesFilter } from 'globalTypes/realm/expenses.type';
import UsersSelect from 'renderer/components/common/selects/usersSelect';
import ExpenseTypeSelect from './expenseTypeSelect';

export type OnFilterParams = { user: string; startDate: Date; endDate: Date };

export type Props = {
  onFilter: (filter: GetExpensesFilter) => void;
};

const ExpensesFilter = ({ onFilter }: Props) => {
  const [filter, setFilter] = useState({
    selectedDate: new Date(),
    userOption: '',
    selectedPeriod: 'Daily',
    startDate: new Date(new Date().setHours(0, 0, 0, 0)),
    endDate: new Date(new Date().setHours(23, 59, 59, 999)),
  });
  const isDaily = filter.selectedPeriod === 'Daily';
  const [minDate, setMinDate] = useState<Date>(filter.startDate);
  const [maxDate, setMaxDate] = useState<Date>(filter.endDate);
  const [type, setType] = useState('all');

  const { userOption, startDate, endDate } = filter;

  useEffect(() => {
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
  }, [userOption, startDate, endDate, onFilter, type]);

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
    setMinDate(sDate);
    setMaxDate(eDate);
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

  return (
    <Row>
      <Col md="4" className="mb-3">
        <UsersSelect
          value={filter.userOption}
          onSelect={(value) => setFilter({ ...filter, userOption: value })}
        />
      </Col>
      <Col md="4" className="mb-3">
        <ExpenseTypeSelect onSelect={setType} />
      </Col>
      <Col md="4" className="mb-3">
        <FormLabel>Period</FormLabel>
        <FormSelect value={filter.selectedPeriod} onChange={handlePeriodSelect}>
          <option>Daily</option>
          <option>Monthly</option>
        </FormSelect>
      </Col>
      <Col md="4" className="mb-3">
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
      <Col md="4" className="mb-3">
        <FormLabel>Start {isDaily ? 'Time' : 'Date'}</FormLabel>
        <DatePicker
          className="form-control"
          selected={filter?.startDate}
          onChange={(date) =>
            date && filter && setFilter({ ...filter, startDate: date })
          }
          minDate={minDate}
          maxDate={filter?.endDate}
          showTimeSelect
          showTimeSelectOnly={isDaily}
          timeIntervals={30}
          timeCaption="Time"
          dateFormat={isDaily ? 'h:mm aa' : 'MM/dd/yyyy h:mm aa'}
        />
      </Col>
      <Col md="4" className="mb-3">
        <FormLabel>End {isDaily ? 'Time' : 'Date'}</FormLabel>
        <DatePicker
          className="form-control"
          selected={filter?.endDate}
          onChange={(date) =>
            date && filter && setFilter({ ...filter, endDate: date })
          }
          minDate={filter?.startDate}
          maxDate={maxDate}
          showTimeSelect
          showTimeSelectOnly={isDaily}
          timeIntervals={30}
          timeCaption="Time"
          dateFormat={isDaily ? 'h:mm aa' : 'MM/dd/yyyy h:mm aa'}
          injectTimes={[
            new Date(new Date(filter.selectedDate).setHours(23, 59, 59, 999)),
          ]}
        />
      </Col>
    </Row>
  );
};

export default ExpensesFilter;
