const app = require("./server")
const request = require("supertest")

describe("GET /", () => {
  test("Return JSON 'hello world (200)'", (done) => {
    request(app)
      .get("/")
      .expect(200)
      .expect({ text: "hello world" }, done)
  })
})

describe("POST /", () => {
  const data = {
    hoge: "fuga",
    piyo: {
      age: 100
    }
  }

  test("Return recieved JSON (201)", (done) => {
    request(app)
      .post("/")
      .send(data)
      .set("Content-Type", "application/json")
      .expect(201)
      .expect(data, done)
  })

  test("Return 400 when Content-Type is other than application/json", (done) => {
    request(app)
      .post("/")
      .set("Content-Type", "text/plain")
      .expect(400, done)
  })
})
