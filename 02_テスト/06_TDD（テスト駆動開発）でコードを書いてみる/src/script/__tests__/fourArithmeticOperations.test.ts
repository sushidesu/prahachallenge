import { FourArithmeticOperations } from "../fourArithmeticOperations";
import { add } from "../add";
import { multiply } from "../multiply";
import { subtract } from "../subtract";
import { divide } from "../divide";

describe("fourArithmeticOperationsクラスは四則演算を実行する", () => {
  describe("exec関数は渡された引数に対して計算を行い結果を返す", () => {
    let fourArithmeticOperations: FourArithmeticOperations;
    beforeEach(() => {
      fourArithmeticOperations = new FourArithmeticOperations({
        add,
        multiply,
        subtract,
        divide,
      });
    });
    describe("先頭の引数 (任意の文字列) をみて、対応する計算を実行する", () => {
      describe("先頭が multiply の場合 multiply関数を実行する", () => {
        it(`"multiply", 2, 3 を渡すと 6 を返す`, () => {
          expect(fourArithmeticOperations.exec("multiply", 2, 3)).toBe(6);
        });
      });
      describe("先頭が add の場合 add関数を実行する", () => {
        it(`"add", 1, 1 を渡すと 2を返す`, () => {
          expect(fourArithmeticOperations.exec("add", 1, 1)).toBe(2);
        });
      });
      describe("先頭が subtract の場合 subtract関数を実行する", () => {
        it(`"subtract", 10, 3 を渡すと 7 を返す`, () => {
          expect(fourArithmeticOperations.exec("subtract", 10, 3)).toBe(7);
        });
      });
      describe("先頭が divide の場合 divide関数を実行する", () => {
        it(`"divide", 7, 2 を渡すと 3.5 を返す`, () => {
          expect(fourArithmeticOperations.exec("divide", 7, 2)).toBe(3.5);
        });
      });
      describe("先頭が multiply/add/subtract/divide 以外の場合、エラーが発生する", () => {
        it(`"mod", 2 を渡すと エラーが発生する`, () => {
          expect(() => fourArithmeticOperations.exec("mod", 2)).toThrowError(
            "Operation must be one of multiply, add, subtract, divide."
          );
        });
        it(`"mod" を渡すとエラーが発生する`, () => {
          expect(() => fourArithmeticOperations.exec("mod")).toThrowError(
            "Operation must be one of multiply, add, subtract, divide."
          );
        });
        it("何も渡さない場合 エラーが発生する", () => {
          expect(() => fourArithmeticOperations.exec()).toThrowError(
            "Operation is required."
          );
        });
      });
    });

    describe("先頭以外の引数についての制限", () => {
      describe("1個〜30個までの引数を受け取る", () => {
        it("31個以上の引数を指定するとエラーが発生する", () => {
          const NUMS_31 = Array(31).fill(10);
          expect(() =>
            fourArithmeticOperations.exec("add", ...NUMS_31)
          ).toThrowError("Numbers length must be in the range 1-30.");
        });
        it("30個の引数を渡すと結果をそのまま返す", () => {
          const NUMS_30 = Array(30).fill(10);
          expect(fourArithmeticOperations.exec("add", ...NUMS_30)).toBe(300);
        });
        it("引数を渡さない場合エラーが発生する", () => {
          expect(() => fourArithmeticOperations.exec("add")).toThrowError(
            "Numbers length must be in the range 1-30."
          );
        });
      });
      describe("数字ではない場合エラーが発生する", () => {
        it(`"add", "zero" を渡すとエラーが発生する`, () => {
          expect(() =>
            fourArithmeticOperations.exec("add", "zero")
          ).toThrowError("Numbers must be number.");
        });
      });
    });
  });
});
