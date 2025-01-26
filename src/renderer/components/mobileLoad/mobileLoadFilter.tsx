import { useEffect, useState, ChangeEvent } from 'react';
import { Col, FormLabel, FormSelect, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import UsersSelect from 'renderer/components/common/selects/usersSelect';
import { MobileLoadFilterParams } from 'globalTypes/realm/mobileLoad.types';
import useMobileLoadFilterStore from 'renderer/store/filtersStore/mobileLoadFilterStore';
import StartEndDatePicker from '../common/startEndDatePicker';
import ShiftSelect from '../common/selects/shiftSelect';

export type OnFilterParams = { user: string; startDate: Date; endDate: Date };

export type Props = {
  onFilter: (filter: MobileLoadFilterParams) => void;
};

// export const initFilter = {
//   selectedDate: new Date(),
//   userOption: '',
//   source: '',
//   selectedPeriod: 'Daily',
//   startDate: new Date(new Date().setHours(0, 0, 0, 0)),
//   endDate: new Date(new Date().setHours(23, 59, 59, 999)),
// };

const MobileLoadFilter = ({ onFilter }: Props) => {
  // const [filter, setFilter] = useState(initFilter);
  const { state: filter, setState: setFilter } = useMobileLoadFilterStore(
    (filterState) => filterState
  );
  const isDaily = filter.selectedPeriod === 'Daily';

  useEffect(() => {
    onFilter({
      transactBy: filter.userOption === 'all' ? '' : filter.userOption,
      startDate: filter.startDate,
      endDate: filter.endDate,
      source: filter.source,
    });
  }, [filter, onFilter]);

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

  const handleSourceSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    if (!filter) return;
    const { value } = e.target;
    setFilter({ ...filter, source: value });
  };

  const handleDateSelect = (date: Date | null) => {
    if (!date) return;
    setDateRange(filter.selectedPeriod, date);
  };

  return (
    <Row>
      <Col lg="2" className="mb-3">
        <UsersSelect
          value={filter.userOption}
          onSelect={(value) => setFilter({ ...filter, userOption: value })}
        />
      </Col>
      <Col lg="1" className="mb-3">
        <FormLabel>Source</FormLabel>
        <FormSelect value={filter.source} onChange={handleSourceSelect}>
          <option value="">All</option>
          <option value="other">Other</option>
          <option value="gcash">Gcash</option>
        </FormSelect>
      </Col>
      <Col lg="1" className="mb-3">
        <FormLabel>Period</FormLabel>
        <FormSelect value={filter.selectedPeriod} onChange={handlePeriodSelect}>
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
  );
};

export default MobileLoadFilter;
