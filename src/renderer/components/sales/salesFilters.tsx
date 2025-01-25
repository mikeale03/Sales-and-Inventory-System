import { useContext, useEffect, useState, ChangeEvent } from 'react';
import { Col, FormLabel, FormSelect, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import UserContext from 'renderer/context/userContext';
import useSalesFilterStore from 'renderer/store/filtersStore/salesFilterStore';
import UsersSelect from '../common/selects/usersSelect';
import TagsSelect from '../common/selects/tagsSelect';
import CategorySelect from '../common/selects/categorySelect';
import TimeSelect from '../common/selects/timeSelect';

type Props = {
  className?: string;
};

const SalesFilter = ({ className }: Props) => {
  const { user } = useContext(UserContext);
  const { state: salesFilter, setState: setSalesFilter } = useSalesFilterStore(
    (filterState) => filterState
  );
  const isDaily = salesFilter.selectedPeriod === 'Daily';
  const [minDate, setMinDate] = useState<Date>(salesFilter.startDate);
  const [maxDate, setMaxDate] = useState<Date>(salesFilter.endDate);

  useEffect(() => {
    if (!user) return;
    if (!salesFilter.userOption) {
      const newFilter = { ...salesFilter };
      newFilter.userOption = user._id;
      setSalesFilter({
        ...newFilter,
      });
      setMinDate(salesFilter.startDate);
      setMaxDate(salesFilter.endDate);
    }
  }, [user, salesFilter, setSalesFilter]);

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
    setSalesFilter({
      ...salesFilter,
      selectedDate,
      selectedPeriod: period,
      startDate: sDate,
      endDate: eDate,
    });
  };

  const handlePeriodSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    if (!salesFilter) return;
    const { value } = e.target;
    setDateRange(value, salesFilter.selectedDate);
  };

  const handleDateSelect = (date: Date | null) => {
    if (!date) return;
    setDateRange(salesFilter.selectedPeriod, date);
  };

  const handleStartTimeSelect = (hour: string) => {
    const { startDate } = salesFilter;
    const [h] = hour.split(':');
    hour && startDate.setHours(+h, 0, 0, 0);
    setSalesFilter({ ...salesFilter, startDate });
  };

  const handleEndTimeSelect = (hour: string) => {
    const { endDate } = salesFilter;
    if (hour === '23:59') {
      endDate.setHours(23, 59, 59, 999);
    } else if (hour) {
      const [h] = hour.split(':');
      endDate.setHours(+h, 0, 0, 0);
    }
    setSalesFilter({ ...salesFilter, endDate });
  };

  return (
    <Row className={className}>
      <Col md="2" className="mb-3">
        <UsersSelect
          value={salesFilter.userOption}
          onSelect={(value) =>
            setSalesFilter({ ...salesFilter, userOption: value })
          }
        />
      </Col>
      <Col md="2" className="mb-3">
        <FormLabel>Period</FormLabel>
        <FormSelect
          value={salesFilter.selectedPeriod}
          onChange={handlePeriodSelect}
        >
          <option>Daily</option>
          <option>Monthly</option>
        </FormSelect>
      </Col>
      <Col md="2" className="mb-3">
        <FormLabel>Select {isDaily ? 'Date' : 'Month'}</FormLabel>
        <DatePicker
          className="form-control"
          selected={salesFilter?.selectedDate}
          onChange={handleDateSelect}
          dateFormat={
            salesFilter?.selectedPeriod === 'Daily' ? 'MM/dd/yyyy' : 'MM/yyyy'
          }
          showMonthYearPicker={salesFilter?.selectedPeriod === 'Monthly'}
          todayButton="Today"
        />
      </Col>
      <Col md="3" className="mb-3">
        <FormLabel>Start {isDaily ? 'Time' : 'Date'}</FormLabel>
        <DatePicker
          className="form-control"
          selected={salesFilter?.startDate}
          onChange={(date) =>
            date &&
            salesFilter &&
            setSalesFilter({ ...salesFilter, startDate: date })
          }
          minDate={minDate}
          maxDate={salesFilter?.endDate}
          showTimeSelectOnly={isDaily}
          dateFormat={isDaily ? 'h:mm aa' : 'MM/dd/yyyy h:mm aa'}
          showTimeInput
          customTimeInput={
            <TimeSelect onSelect={handleStartTimeSelect} type="start-date" />
          }
        />
      </Col>
      <Col md="3" className="mb-3">
        <FormLabel>End {isDaily ? 'Time' : 'Date'}</FormLabel>
        <DatePicker
          className="form-control"
          selected={salesFilter?.endDate}
          onChange={(date) =>
            date &&
            salesFilter &&
            setSalesFilter({ ...salesFilter, endDate: date })
          }
          minDate={salesFilter?.startDate}
          maxDate={maxDate}
          showTimeSelectOnly={isDaily}
          dateFormat={isDaily ? 'h:mm aa' : 'MM/dd/yyyy h:mm aa'}
          showTimeInput
          customTimeInput={
            <TimeSelect onSelect={handleEndTimeSelect} type="end-date" />
          }
        />
      </Col>
      <Col sm="6" xl="3" className="mb-3">
        <CategorySelect
          value={salesFilter.category ?? ''}
          onSelect={(category) => setSalesFilter({ ...salesFilter, category })}
          defaltValue="All"
        />
      </Col>
      <Col sm="6" xl="3" className="mb-3">
        <TagsSelect
          value={salesFilter.tags ?? []}
          onChange={(tags) => setSalesFilter({ ...salesFilter, tags })}
          isCreatable
          placeholder="All"
        />
      </Col>
    </Row>
  );
};

export default SalesFilter;
