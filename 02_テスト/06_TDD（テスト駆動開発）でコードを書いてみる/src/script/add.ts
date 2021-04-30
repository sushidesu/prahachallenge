export const add = (...numbers: number[]): string | number => {
  const TOO_BIG = "too big";
  const result = numbers.reduce((prev, cur) => prev + cur, 0);
  if (1000 < result) {
    return TOO_BIG;
  } else {
    return result;
  }
};
