import Express from "express"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const server = Express()

server.set("views", path.join(__dirname, "templates"))
server.set("view engine", "ejs")

server.get("/", (_, res) => {
  res.render("top.ejs")
})

export default server
