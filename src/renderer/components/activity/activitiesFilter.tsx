import { useEffect, useState, ChangeEvent } from 'react';
import { Col, FormLabel, FormSelect, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import UsersSelect from '../common/selects/usersSelect';

export type OnFilterParams = { user: string; startDate: Date; endDate: Date };

export type Props = {
  onFilter: (filter: OnFilterParams) => void;
};

const ActivitiesFilter = ({ onFilter }: Props) => {
  const [activitiesFilter, setActivitiesFilter] = useState({
    selectedDate: new Date(),
    userOption: '',
    selectedPeriod: 'Daily',
    startDate: new Date(new Date().setHours(0, 0, 0, 0)),
    endDate: new Date(new Date().setHours(23, 59, 59, 999)),
  });
  const isDaily = activitiesFilter.selectedPeriod === 'Daily';
  const [minDate, setMinDate] = useState<Date>(activitiesFilter.startDate);
  const [maxDate, setMaxDate] = useState<Date>(activitiesFilter.endDate);

  const { userOption, startDate, endDate } = activitiesFilter;

  useEffect(() => {
    onFilter({
      user: userOption === 'all' ? '' : userOption,
      startDate,
      endDate,
    });
  }, [userOption, startDate, endDate, onFilter]);

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
          selected={activitiesFilter?.endDate}
          onChange={(date) =>
            date &&
            activitiesFilter &&
            setActivitiesFilter({ ...activitiesFilter, endDate: date })
          }
          minDate={activitiesFilter?.startDate}
          maxDate={maxDate}
          showTimeSelect
          showTimeSelectOnly={isDaily}
          timeIntervals={30}
          timeCaption="Time"
          dateFormat={isDaily ? 'h:mm aa' : 'MM/dd/yyyy h:mm aa'}
          injectTimes={[
            new Date(
              new Date(activitiesFilter.selectedDate).setHours(23, 59, 59, 999)
            ),
          ]}
        />
      </Col>
    </Row>
  );
};

export default ActivitiesFilter;
