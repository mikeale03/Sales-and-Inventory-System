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
