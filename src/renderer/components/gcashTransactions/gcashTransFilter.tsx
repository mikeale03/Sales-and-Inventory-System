import { User } from 'globalTypes/realm/user.types';
import { useContext, useEffect, useState, useRef, ChangeEvent } from 'react';
import { Col, FormLabel, FormSelect, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import UserContext from 'renderer/context/userContext';
import { getUsers } from 'renderer/service/users';

type Props = {
  onChange: (filter: {
    userOption: string;
    startDate: Date;
    endDate: Date;
  }) => void;
};

const GcashTransFilter = ({ onChange }: Props) => {
  const { user } = useContext(UserContext);
  const selectedDateRef = useRef<Date>(new Date());
  const selectedPeriodRef = useRef('Daily');
  const isDaily = selectedPeriodRef.current === 'Daily';
  const [userOption, setUserOption] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [startDate, setStartDate] = useState(
    new Date(new Date().setHours(0, 0, 0, 0))
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().setHours(23, 59, 59, 999))
  );
  const [minDate, setMinDate] = useState<Date>(startDate);
  const [maxDate, setMaxDate] = useState<Date>(endDate);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const response = await getUsers();
      if (response.isSuccess && response.result) {
        setUsers(response.result);
      }
    })();
    setUserOption(user._id);
  }, [user]);

  useEffect(() => {
    userOption &&
      onChange({
        userOption,
        startDate,
        endDate,
      });
  }, [userOption, startDate, endDate, onChange]);

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
    setStartDate(sDate);
    setEndDate(eDate);
    setMinDate(sDate);
    setMaxDate(eDate);
  };

  const handlePeriodSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    selectedPeriodRef.current = value;
    setDateRange(value, selectedDateRef.current);
  };

  const handleDateSelect = (date: Date | null) => {
    if (!date) return;
    selectedDateRef.current = date;
    setDateRange(selectedPeriodRef.current, date);
  };
  return (
    <Row>
      <Col md="2" className="mb-3">
        <FormLabel>User</FormLabel>
        <FormSelect
          value={userOption}
          onChange={(e) => setUserOption(e.target.value)}
        >
          <option value="all">All</option>
          {users.map((opt) => (
            <option key={opt._id} value={opt._id}>
              {opt.username}
            </option>
          ))}
        </FormSelect>
      </Col>
      <Col md="2" className="mb-3">
        <FormLabel>Period</FormLabel>
        <FormSelect onChange={handlePeriodSelect}>
          <option>Daily</option>
          <option>Monthly</option>
        </FormSelect>
      </Col>
      <Col md="2" className="mb-3">
        <FormLabel>Select {isDaily ? 'Date' : 'Month'}</FormLabel>
        <DatePicker
          className="form-control"
          selected={selectedDateRef.current}
          onChange={handleDateSelect}
          dateFormat={
            selectedPeriodRef.current === 'Daily' ? 'MM/dd/yyyy' : 'MM/yyyy'
          }
          showMonthYearPicker={selectedPeriodRef.current === 'Monthly'}
        />
      </Col>
      <Col md="3" className="mb-3">
        <FormLabel>Start {isDaily ? 'Time' : 'Date'}</FormLabel>
        <DatePicker
          className="form-control"
          selected={startDate}
          onChange={(date) => date && setStartDate(date)}
          minDate={minDate}
          maxDate={endDate}
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
          selected={endDate}
          onChange={(date) => date && setEndDate(date)}
          minDate={startDate}
          maxDate={maxDate}
          showTimeSelect
          showTimeSelectOnly={isDaily}
          timeIntervals={30}
          timeCaption="Time"
          dateFormat={isDaily ? 'h:mm aa' : 'MM/dd/yyyy h:mm aa'}
          injectTimes={[
            new Date(
              new Date(selectedDateRef.current).setHours(23, 59, 59, 999)
            ),
          ]}
        />
      </Col>
    </Row>
  );
};

export default GcashTransFilter;
