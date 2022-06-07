import { load } from "cheerio"
import { parse } from "date-fns"
import { House } from "./house"

export type Parser = (url: string, body: string) => House

export const parserS: Parser = (url, body) => {
  const $ = load(body)

  const title = $("h1.section_h1-header-title").text()
  const type = $(`th:contains("建物種別")`).next().text()
  const floors = $(`th:contains("階建")`).next().text()
  const size = $(`th:contains("専有面積")`).next().text()
  const address = $(`th:contains("所在地")`).next().text()
  const direction = $(`th:contains("向き")`).next().text()
  const age = $(`th:contains("築年数")`).next().text()
  const structure = $(`th:contains("構造")`).next().text().replace(/\s/g, "")

  const publishedAt = $(`th:contains("情報更新日")`).next().text()
  const layout = $(`th:contains("間取り")`)
    .filter(function () {
      return $(this).text() === "間取り"
    })
    .next()
    .text()

  const rent = $(`span.property_view_note-emphasis`).text()
  const managementFee = $(`span:contains("管理費")`).text()
  const securityDeposit = $(`span:contains("敷金")`).text()
  const keyMoney = $(`span:contains("礼金")`).text()
  const brokeRageFee = $(`th:contains("仲介手数料")`)
    .next()
    .text()
    .replace(/\s/g, "")

  const [floor, maxFloor] = floors.split("/")

  const house: House = {
    name: title,
    type,
    structure,
    layout,
    floor: Number(floor?.slice(0, -1)),
    maxFloor: Number(maxFloor?.slice(0, -2)),
    address,
    age: Number(age.slice(1, -1)),
    direction,
    publishedAt: parse(publishedAt, "yyyy/MM/dd", new Date()),
    rent: Number(rent.slice(0, -2)) * 10000,
    managementFee: Number(managementFee.slice(8, -1)),
    securityDeposit: Number(securityDeposit.slice(4, -2)) * 10000,
    keyMoney: Number(keyMoney.slice(3, -2)) * 10000,
    brokeRageFee,

    size: Number(size.slice(0, -2)),
    url,
  }

  return house
}
