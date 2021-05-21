const server = require("./server")

const PORT = 8000

server.listen(PORT, () => {
  console.log(`listening at http://localhost:${PORT}`)
})
