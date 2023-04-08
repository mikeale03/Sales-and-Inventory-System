import { KeyboardEvent } from 'react';

export const pesoFormat = (amount: number) => {
  const formatter = new Intl.NumberFormat('en-us', {
    style: 'currency',
    currency: 'PHP',
  });
  return formatter.format(amount);
};

export const debounce = <T>(
  func: (...args: any[]) => T,
  milliseconds = 1000
) => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (...args: any[]) =>
    new Promise<T>((resolve) => {
      const onComplete = () => {
        timer = null;
        resolve(func(...args));
      };

      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(onComplete, milliseconds);
    });
};

export const getUpdatedProps = <T extends object>(obj: T, updatedObj: T) => {
  const newObject: Partial<T> = {};
  type Key = keyof T;
  type newObjKey = keyof typeof newObject;
  Object.keys(obj).forEach((key) => {
    if (obj[key as Key] !== updatedObj[key as Key]) {
      newObject[key as newObjKey] = updatedObj[key as Key];
    }
  });
};

export const barcodeScan = (cb: (barcode: string) => void) => {
  let barcode = '';
  let interval: ReturnType<typeof setInterval> | undefined;

  return (event: KeyboardEvent<HTMLDivElement>) => {
    if (interval) clearInterval(interval);
    if (event.code === 'Enter') {
      if (barcode.length > 2) cb(barcode);
      barcode = '';
      return;
    }
    if (event.key !== 'Shift') barcode += event.key;
    interval = setInterval(() => {
      barcode = '';
    }, 20);
  };
};
