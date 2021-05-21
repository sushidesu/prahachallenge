import Express from "express"
import cookieParser from "cookie-parser"
import router from "./router"

const server = Express()
server.use(cookieParser())
server.set("view engine", "ejs")
server.use(router)

server.use(
  "/images",
  Express.static("public2", {
    setHeaders: (res) => {
      res
        .cookie("1stParty", "cookie", {
          httpOnly: true,
        })
        .cookie("1stPartySameSiteStrict", "cookie", {
          httpOnly: true,
          sameSite: "strict",
        })
        .cookie("1stPartySameSiteLax", "cookie", {
          httpOnly: true,
          sameSite: "lax",
        })
        .cookie("1stPartySameSiteNone", "cookie", {
          httpOnly: true,
          sameSite: "none",
        })
        .cookie("1stPartySameSiteSecureNone", "cookie", {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        })
    },
  })
)

export default server
