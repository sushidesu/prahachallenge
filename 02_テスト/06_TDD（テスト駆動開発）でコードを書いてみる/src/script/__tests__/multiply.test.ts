import { multiply } from "../multiply";

describe("multiply 関数は引数を全て乗算して結果を返す", () => {
  describe("計算結果が1000以下の場合は結果をそのまま返す", () => {
    it("2, 3 を渡すと 6 を返す", () => {
      expect(multiply(2, 3)).toBe(6);
    });
    it("2, 3, 0 を渡すと 0 を返す", () => {
      expect(multiply(2, 3, 0)).toBe(0);
    });
  });
  describe(`計算結果が1000を越える場合は "big big number" という文字列を返す`, () => {
    it(`1001 を渡すと "big big number" を返す`, () => {
      expect(multiply(1001)).toBe("big big number");
    });
    it(`10, 10, 10 を渡すと 1000 を返す`, () => {
      expect(multiply(10, 10, 10)).toBe(1000);
    });
  });
});
