import { useContext, useEffect, useState, ChangeEvent } from 'react';
import { Col, FormLabel, FormSelect, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import FilterContext from 'renderer/context/filterContext';
import UserContext from 'renderer/context/userContext';
import UsersSelect from '../common/selects/usersSelect';

type Props = {
  className?: string;
};

const SalesFilter = ({ className }: Props) => {
  const { user } = useContext(UserContext);
  const { salesFilter, setSalesFilter } = useContext(FilterContext);
  const isDaily = salesFilter.selectedPeriod === 'Daily';
  const [minDate, setMinDate] = useState<Date>(salesFilter.startDate);
  const [maxDate, setMaxDate] = useState<Date>(salesFilter.endDate);

  useEffect(() => {
    if (!user) return;
    if (!salesFilter.userOption) {
      setSalesFilter({
        ...salesFilter,
        userOption: user._id,
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
          showTimeSelect
          showTimeSelectOnly={isDaily}
          timeIntervals={30}
          timeCaption="Time"
          dateFormat={isDaily ? 'h:mm aa' : 'MM/dd/yyyy h:mm aa'}
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
          showTimeSelect
          showTimeSelectOnly={isDaily}
          timeIntervals={30}
          timeCaption="Time"
          dateFormat={isDaily ? 'h:mm aa' : 'MM/dd/yyyy h:mm aa'}
          injectTimes={[
            new Date(
              new Date(salesFilter.selectedDate).setHours(23, 59, 59, 999)
            ),
          ]}
        />
      </Col>
    </Row>
  );
};

export default SalesFilter;
