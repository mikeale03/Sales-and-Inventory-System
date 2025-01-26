import { ChangeEvent, useEffect, useState } from 'react';
import { FormSelect } from 'react-bootstrap';

export type Props = {
  onSelect: (params: { startDate: Date; endDate: Date }) => void;
  startDate: Date;
  endDate: Date;
};

let shiftAStart = new Date();
let shiftAEnd = new Date();
let shiftBStart = new Date();
let shiftBEnd = new Date();
let shiftCStart = new Date();
let shiftCEnd = new Date();

function ShiftSelect({ startDate, endDate, onSelect }: Props) {
  const [val, setVal] = useState('');
  shiftAStart = new Date(startDate);
  shiftAStart.setHours(0, 0, 0, 0);
  shiftAEnd = new Date(endDate);
  shiftAEnd.setHours(6, 59, 59, 999);
  shiftBStart = new Date(startDate);
  shiftBStart.setHours(7, 0, 0, 0);
  shiftBEnd = new Date(endDate);
  shiftBEnd.setHours(15, 59, 59, 999);
  shiftCStart = new Date(startDate);
  shiftCStart.setHours(16, 0, 0, 0);
  shiftCEnd = new Date(endDate);
  shiftCEnd.setHours(23, 59, 59, 999);

  useEffect(() => {
    if (
      startDate.getTime() === shiftAStart.getTime() &&
      endDate.getTime() === shiftAEnd.getTime()
    )
      setVal('a');
    else if (
      startDate.getTime() === shiftBStart.getTime() &&
      endDate.getTime() === shiftBEnd.getTime()
    )
      setVal('b');
    else if (
      startDate.getTime() === shiftCStart.getTime() &&
      endDate.getTime() === shiftCEnd.getTime()
    )
      setVal('c');
    else setVal('');
  }, [startDate, endDate]);

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    if (value === 'a') {
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(6, 59, 59, 999);
    } else if (value === 'b') {
      startDate.setHours(7, 0, 0, 0);
      endDate.setHours(15, 59, 59, 999);
    } else if (value === 'c') {
      startDate.setHours(16, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
    }
    onSelect({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });
  };
  return (
    <FormSelect value={val} onChange={handleSelect}>
      <option value="">Select Time Shift</option>
      <option value="a">12:00 AM - 6:59 AM</option>
      <option value="b">07:00 AM - 3:59 PM</option>
      <option value="c">04:00 PM - 11:59 PM</option>
    </FormSelect>
  );
}

export default ShiftSelect;
