import { Command } from "commander";
import { FourArithmeticOperations } from "./script/fourArithmeticOperations";
import { add } from "./script/add";
import { subtract } from "./script/subtract";
import { multiply } from "./script/multiply";
import { divide } from "./script/divide";

function main() {
  const program = new Command();
  program.parse(process.argv);

  const fourArithmeticOperations = new FourArithmeticOperations({
    add,
    subtract,
    multiply,
    divide,
  });
  const result = fourArithmeticOperations.exec(...program.args);
  console.log(result);
}

main();
