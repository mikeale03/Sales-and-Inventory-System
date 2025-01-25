import { useEffect, useState, ChangeEvent } from 'react';
import { Col, FormLabel, FormSelect, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import UsersSelect from 'renderer/components/common/selects/usersSelect';
import { MobileLoadFilterParams } from 'globalTypes/realm/mobileLoad.types';
import useMobileLoadFilterStore from 'renderer/store/filtersStore/mobileLoadFilterStore';
import TimeSelect from '../common/selects/timeSelect';

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
  const [minDate, setMinDate] = useState<Date>(filter.startDate);
  const [maxDate, setMaxDate] = useState<Date>(filter.endDate);

  const { startDate, endDate } = filter;

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

  const handleSourceSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    if (!filter) return;
    const { value } = e.target;
    setFilter({ ...filter, source: value });
  };

  const handleDateSelect = (date: Date | null) => {
    if (!date) return;
    setDateRange(filter.selectedPeriod, date);
  };

  const handleStartTimeSelect = (hour: string) => {
    const [h] = hour.split(':');
    hour && startDate.setHours(+h, 0, 0, 0);
    setFilter({ ...filter, startDate });
  };

  const handleEndTimeSelect = (hour: string) => {
    if (hour === '23:59') {
      endDate.setHours(23, 59, 59, 999);
    } else if (hour) {
      const [h] = hour.split(':');
      endDate.setHours(+h, 0, 0, 0);
    }
    setFilter({ ...filter, endDate });
  };

  return (
    <Row>
      <Col lg="2" className="mb-3">
        <UsersSelect
          value={filter.userOption}
          onSelect={(value) => setFilter({ ...filter, userOption: value })}
        />
      </Col>
      <Col lg="2" className="mb-3">
        <FormLabel>Source</FormLabel>
        <FormSelect value={filter.source} onChange={handleSourceSelect}>
          <option value="">All</option>
          <option value="other">Other</option>
          <option value="gcash">Gcash</option>
        </FormSelect>
      </Col>
      <Col lg="2" className="mb-3">
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
        <DatePicker
          className="form-control"
          selected={filter?.startDate}
          onChange={(date) =>
            date && filter && setFilter({ ...filter, startDate: date })
          }
          minDate={minDate}
          maxDate={filter?.endDate}
          showTimeSelectOnly={isDaily}
          dateFormat={isDaily ? 'h:mm aa' : 'MM/dd/yyyy h:mm aa'}
          showTimeInput
          customTimeInput={
            <TimeSelect onSelect={handleStartTimeSelect} type="start-date" />
          }
        />
      </Col>
      <Col lg="2" className="mb-3">
        <FormLabel>End {isDaily ? 'Time' : 'Date'}</FormLabel>
        <DatePicker
          className="form-control"
          selected={filter?.endDate}
          onChange={(date) =>
            date && filter && setFilter({ ...filter, endDate: date })
          }
          minDate={filter?.startDate}
          maxDate={maxDate}
          showTimeSelectOnly={isDaily}
          dateFormat={isDaily ? 'h:mm aa' : 'MM/dd/yyyy h:mm aa'}
          showTimeInput
          customTimeInput={
            <TimeSelect onSelect={handleEndTimeSelect} type="end-date" />
          }
        />
      </Col>
    </Row>
  );
};

export default MobileLoadFilter;
