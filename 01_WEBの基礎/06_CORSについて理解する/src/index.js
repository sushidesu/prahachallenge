import ngrok from "ngrok"
import api from "./apiServer"
import server from "./server"

const PORT = 8000
const API_PORT = 9000

api.listen(API_PORT, () => {
  console.log(`api server at localhost:${API_PORT} ...`)
})

!(async () => {
  const apiURL = await ngrok.connect(API_PORT)
  console.log(`localhost:${API_PORT} on ${apiURL}`)

  server.locals.apiURL = apiURL
  server.listen(PORT, () => {
    console.log(`server at localhost:${PORT} ...`)
  })
})()
