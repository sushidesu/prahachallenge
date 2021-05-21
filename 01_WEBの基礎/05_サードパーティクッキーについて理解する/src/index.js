import ngrok from "ngrok"
import server from "./server"
import another from "./anotherServer"

const PORT = 8000
const ANOTHER_PORT = 9000

// サードパーティークッキー用のサーバー
another.listen(ANOTHER_PORT, () => {
  console.log(`3rd party at localhost:${ANOTHER_PORT}`)
})

!(async () => {
  // ngrok で ANOTHRE_PORT を配信して URL を取得
  const url = await ngrok.connect(ANOTHER_PORT)
  console.log(`3rd party at ${url}`)

  // ファーストパーティークッキー用のサーバー
  server.locals.resourceURL = url
  server.listen(PORT, () => {
    console.log(`1st party at localhost:${PORT}...`)
  })
})()
