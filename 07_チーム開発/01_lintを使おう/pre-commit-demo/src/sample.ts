export const hello = () => {
  // 無限ループしてしまう！ (for-directionルール)
  // typescriptでは検知できない
  // for (let i = 0; i < 10; i--) {
  //   console.log(i)
  // }
  for (let i = 0; i < 10; i++) {
    console.log(i)
  }
}
