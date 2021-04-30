export const divide = (...numbers: number[]): number => {
  const N_1e10 = 10000000000;
  if (numbers.length === 0) {
    return 0;
  }
  const first = numbers[0];
  const rest = numbers.slice(1);
  if (rest.some((n) => n === 0)) {
    throw Error("Cannot divide by zero");
  }
  const result = rest.reduce((prev, cur) => prev / cur, first);
  return Math.round(result * N_1e10) / N_1e10;
};
