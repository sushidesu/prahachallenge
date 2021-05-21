import { Router } from "express"

const router = Router()

router.get("/", (req, res) => {
  res
    .cookie("1stParty", "cookie", {
      httpOnly: true,
    })
    .render("top.ejs", {
      cookies: JSON.stringify(req.cookies, undefined, 2)
    })
})

export default router
