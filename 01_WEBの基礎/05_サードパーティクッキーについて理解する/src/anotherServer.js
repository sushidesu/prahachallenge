import Express from "express"
import cookieParser from "cookie-parser"

const server = Express()

server.use(cookieParser())

// /images -> 画像配信・クッキーセット用
server.use(
  "/images",
  Express.static("public", {
    setHeaders: (res) => {
      res
        .cookie("3rdParty", "cookie", {
          httpOnly: true,
        })
        .cookie("3rdPartySameSiteStrict", "cookie", {
          httpOnly: true,
          sameSite: "strict",
        })
        .cookie("3rdPartySameSiteLax", "cookie", {
          httpOnly: true,
          sameSite: "lax",
        })
        .cookie("3rdPartySameSiteNone", "cookie", {
          httpOnly: true,
          sameSite: "none",
        })
        .cookie("3rdPartySameSiteSecureNone", "cookie", {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        })
    },
  })
)

// /set-cookies -> クッキーセット用
server.get("/set-cookies", (_, res) => {
  res
    .cookie("3rdParty", "cookie", {
      httpOnly: true,
    })
    .cookie("3rdPartySameSiteStrict", "cookie", {
      httpOnly: true,
      sameSite: "strict",
    })
    .cookie("3rdPartySameSiteLax", "cookie", {
      httpOnly: true,
      sameSite: "lax",
    })
    .cookie("3rdPartySameSiteNone", "cookie", {
      httpOnly: true,
      sameSite: "none",
    })
    .cookie("3rdPartySameSiteSecureNone", "cookie", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    })
    .send("<p>Cookies set.</p>")
})

// / -> 受け取ったクッキーを表示する（クッキーのセットは行わない）
server.get("/", (req, res) => {
  res.send(
    `<div><p><a href="/">same-site request</a></p><pre>${JSON.stringify(
      req.cookies,
      undefined,
      2
    )}</pre></div>`
  )
})

export default server
