const { Router } = require("express")

const router = Router()

router.get("/", (_, res) => {
  res.status(200).send({ text: "hello world" })
})

router.post("/", (request, response) => {
  if (request.headers["content-type"] === "application/json") {
    response.status(201).json(request.body)
  } else {
    response.status(400).send("400 Error: Use `application/json`")
  }
})

module.exports = router
