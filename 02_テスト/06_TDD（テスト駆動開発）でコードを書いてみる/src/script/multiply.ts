export const multiply = (...numbers: number[]): number | string => {
  const BIG_BIG_NUMBER = "big big number";
  const result = numbers.reduce((prev, cur) => prev * cur, 1);
  if (result > 1000) {
    return BIG_BIG_NUMBER;
  } else {
    return result;
  }
};
