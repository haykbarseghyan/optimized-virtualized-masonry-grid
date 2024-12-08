export const debounce = (func: (value: string) => void, delay: number) => {
  let timer: ReturnType<typeof setTimeout>;
  return (value: string) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(value), delay);
  };
};
