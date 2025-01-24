import { FormSelect } from 'react-bootstrap';

export type Props = {
  value?: Date | string;
  onSelect: (time: string) => void;
  type: 'start-date' | 'end-date';
};

function TimeSelect({ value, onSelect, type }: Props) {
  const val =
    value instanceof Date ? `${value.getHours()}:${value.getMinutes()}` : value;

  console.log(val);
  return (
    <FormSelect
      size="sm"
      value={val ?? ''}
      onChange={(e) => onSelect(e.target.value)}
    >
      <option value=""> </option>
      {type === 'start-date' && <option value="00:00">12:00 AM</option>}
      <option value="07:00">07:00 AM</option>
      <option value="16:00">04:00 PM</option>
      {type === 'end-date' && <option value="23:59">11:59 PM</option>}
    </FormSelect>
  );
}

export default TimeSelect;
