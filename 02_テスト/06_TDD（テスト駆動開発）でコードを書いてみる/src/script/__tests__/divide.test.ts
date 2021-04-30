import { divide } from "../divide";

describe("divide 関数は先頭の引数から残りの引数を除算して結果を返す", () => {
  describe("結果の少数点以下の桁数が10桁未満の場合はそのまま返す", () => {
    it("10, 2 を渡すと 5 を返す", () => {
      expect(divide(10, 2)).toBeCloseTo(5, 10);
    });
    it("1, 10, 10, 10 を渡すと 0.001 を返す", () => {
      expect(divide(1, 10, 10, 10)).toBeCloseTo(0.001, 10);
    });
  });
  describe("それ以外の場合は 小数第10位で四捨五入した結果を返す", () => {
    it("0.12345678905 を渡すと 0.1234567891 を返す", () => {
      expect(divide(0.12345678905)).toBeCloseTo(0.1234567891, 10);
    });
  });
  describe("引数に関する例外", () => {
    it("引数がない場合 0 を返す", () => {
      expect(divide()).toBe(0);
    });
    it("先頭の引数以外に0が含まれる場合、例外を発生させる", () => {
      expect(() => divide(1, 0)).toThrowError("Cannot divide by zero");
    });
  });
});
