import Express from "express"

const api = Express()

api.use(Express.urlencoded({ extended: true }))

api.use("/", (_, res, next) => {
  res.header({
    "Access-Control-Allow-Origin": "http://localhost:8000",
    "Access-Control-Allow-Methods": "POST",
    "Access-Control-Allow-Headers": "X-Test",
  })
  next()
})

api.post("/", (req, res) => {
  const result = {
    message: "POST request recieved",
    recieved: req.body,
  }

  res.json(result)
  console.log("POST request recieved")
  console.log(result)
})

api.options("/", (_, res) => {
  res.send("OPTIONS OK")

  console.log(`OPTIONS request recieved`)
})

export default api
