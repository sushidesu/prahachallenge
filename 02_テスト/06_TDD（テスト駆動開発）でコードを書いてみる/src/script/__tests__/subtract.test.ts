import { subtract } from "../subtract";

describe("subtract関数は先頭の引数から残りの引数を減算して結果を返す", () => {
  describe("結果が0以上の場合は結果をそのまま返す", () => {
    it("10, 1 を渡すと 9 を返す", () => {
      expect(subtract(10, 1)).toBe(9);
    });
    it("10, 2, 1 を渡すと 7 を返す", () => {
      expect(subtract(10, 2, 1)).toBe(7);
    });
  });
  describe(`結果が0より小さい場合は "negative number" という文字列を返す`, () => {
    it(`1, 10 を渡すと "negative number" を返す`, () => {
      expect(subtract(1, 10)).toBe("negative number");
    });
    it(`1, 1 を渡すと 0 を返す`, () => {
      expect(subtract(1, 1)).toBe(0);
    });
  });
  describe("引数がない場合", () => {
    it("引数が一つも無い場合は 0 を返す", () => {
      expect(subtract()).toBe(0);
    });
  });
});
