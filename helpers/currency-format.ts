export const currencyFormat = (num: number) => {
  return num.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    style: 'currency',
    currency: 'INR',
  });
};
