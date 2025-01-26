import DatePicker from 'react-datepicker';

export type Props = {
  selected: Date;
  startDate: Date;
  endDate: Date;
  onChange: (params: { startDate: Date; endDate: Date }) => void;
  type: 'start-date' | 'end-date';
  isDaily: boolean;
};

const StartEndDatePicker = ({
  selected,
  startDate,
  endDate,
  onChange,
  isDaily,
  type,
}: Props) => {
  const handleChange = (date: Date) => {
    if (type === 'start-date') {
      onChange({
        startDate: date,
        endDate,
      });
    } else {
      onChange({
        endDate: date,
        startDate,
      });
    }
  };

  return (
    <DatePicker
      className="form-control"
      selected={selected}
      onChange={(date) => date && handleChange(date)}
      minDate={type === 'start-date' ? undefined : startDate}
      maxDate={type === 'end-date' ? undefined : endDate}
      showTimeSelect
      timeIntervals={60}
      showTimeSelectOnly={isDaily}
      dateFormat={isDaily ? 'h:mm aa' : 'MM/dd/yyyy h:mm aa'}
      injectTimes={
        type === 'end-date'
          ? [new Date(new Date(selected).setHours(23, 59, 59, 999))]
          : undefined
      }
    />
  );
};

export default StartEndDatePicker;
