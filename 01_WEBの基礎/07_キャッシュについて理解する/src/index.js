import server from "./server"

const PORT = 8000

server.listen(PORT, () => {
  console.log(`server at localhost:${PORT}`)
})
