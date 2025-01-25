import { useEffect, useState, ChangeEvent } from 'react';
import { Col, FormLabel, FormSelect, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import UsersSelect from '../common/selects/usersSelect';
import ProductSelect, { Opt } from './productSelect';
import TimeSelect from '../common/selects/timeSelect';

export type OnFilterParams = {
  user: string;
  startDate: Date;
  endDate: Date;
  productId: string | null;
};

export type Props = {
  onFilter: (filter: OnFilterParams) => void;
};

export type Filter = {
  selectedDate: Date;
  userOption: string;
  selectedPeriod: string;
  startDate: Date;
  endDate: Date;
  productId: string | null;
};

const ActivitiesFilter = ({ onFilter }: Props) => {
  const [activitiesFilter, setActivitiesFilter] = useState<Filter>({
    selectedDate: new Date(),
    userOption: '',
    selectedPeriod: 'Daily',
    startDate: new Date(new Date().setHours(0, 0, 0, 0)),
    endDate: new Date(new Date().setHours(23, 59, 59, 999)),
    productId: null,
  });
  const isDaily = activitiesFilter.selectedPeriod === 'Daily';
  const [minDate, setMinDate] = useState<Date>(activitiesFilter.startDate);
  const [maxDate, setMaxDate] = useState<Date>(activitiesFilter.endDate);
  const [productInputVal, setProductInputVal] = useState('');
  const [productSelectVal, setProductSelectVal] = useState<Opt | null>(null);

  useEffect(() => {
    const { userOption, startDate, endDate, productId } = activitiesFilter;
    onFilter({
      user: userOption === 'all' ? '' : userOption,
      startDate,
      endDate,
      productId,
    });
  }, [activitiesFilter, onFilter]);

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
    setActivitiesFilter({
      ...activitiesFilter,
      selectedDate,
      selectedPeriod: period,
      startDate: sDate,
      endDate: eDate,
    });
  };

  const handlePeriodSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    if (!activitiesFilter) return;
    const { value } = e.target;
    setDateRange(value, activitiesFilter.selectedDate);
  };

  const handleDateSelect = (date: Date | null) => {
    if (!date) return;
    setDateRange(activitiesFilter.selectedPeriod, date);
  };

  const handleProductSelect = (opt: Opt | null) => {
    setActivitiesFilter({
      ...activitiesFilter,
      productId: opt && opt.product._id,
    });
    setProductSelectVal(opt);
  };

  const handleStartTimeSelect = (hour: string) => {
    const { startDate } = activitiesFilter;
    const [h] = hour.split(':');
    hour && startDate.setHours(+h, 0, 0, 0);
    setActivitiesFilter({ ...activitiesFilter, startDate });
  };

  const handleEndTimeSelect = (hour: string) => {
    const { endDate } = activitiesFilter;
    if (hour === '23:59') {
      endDate.setHours(23, 59, 59, 999);
    } else if (hour) {
      const [h] = hour.split(':');
      endDate.setHours(+h, 0, 0, 0);
    }
    setActivitiesFilter({ ...activitiesFilter, endDate });
  };

  return (
    <Row>
      <Col md="2" className="mb-3">
        <UsersSelect
          value={activitiesFilter.userOption}
          onSelect={(value) =>
            setActivitiesFilter({ ...activitiesFilter, userOption: value })
          }
        />
      </Col>
      <Col md="2" className="mb-3">
        <FormLabel>Period</FormLabel>
        <FormSelect
          value={activitiesFilter.selectedPeriod}
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
          selected={activitiesFilter?.selectedDate}
          onChange={handleDateSelect}
          dateFormat={
            activitiesFilter?.selectedPeriod === 'Daily'
              ? 'MM/dd/yyyy'
              : 'MM/yyyy'
          }
          showMonthYearPicker={activitiesFilter?.selectedPeriod === 'Monthly'}
          todayButton="Today"
        />
      </Col>
      <Col md="3" className="mb-3">
        <FormLabel>Start {isDaily ? 'Time' : 'Date'}</FormLabel>
        <DatePicker
          className="form-control"
          selected={activitiesFilter?.startDate}
          onChange={(date) =>
            date &&
            activitiesFilter &&
            setActivitiesFilter({ ...activitiesFilter, startDate: date })
          }
          minDate={minDate}
          maxDate={activitiesFilter?.endDate}
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
          selected={activitiesFilter?.endDate}
          onChange={(date) =>
            date &&
            activitiesFilter &&
            setActivitiesFilter({ ...activitiesFilter, endDate: date })
          }
          minDate={activitiesFilter?.startDate}
          maxDate={maxDate}
          showTimeSelectOnly={isDaily}
          dateFormat={isDaily ? 'h:mm aa' : 'MM/dd/yyyy h:mm aa'}
          showTimeInput
          customTimeInput={
            <TimeSelect onSelect={handleEndTimeSelect} type="end-date" />
          }
        />
      </Col>
      <Row className="mb-3">
        <Col lg="6">
          <FormLabel>Product</FormLabel>
          <ProductSelect
            inputValue={productInputVal}
            onInputChange={setProductInputVal}
            onSelect={handleProductSelect}
            value={productSelectVal}
          />
        </Col>
      </Row>
    </Row>
  );
};

export default ActivitiesFilter;
