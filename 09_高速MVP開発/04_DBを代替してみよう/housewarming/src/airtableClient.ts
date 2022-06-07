import "dotenv/config"
import Airtable, { Record, FieldSet } from "airtable"
import { format, parse } from "date-fns"
import { House } from "./house"

export type AirtableClient = {
  insert: (houseList: House[]) => Promise<string[]>
  getAll: () => Promise<House[]>
}

type HouseFields = {
  Name: string
  Layout: string
  Type: string
  Structure: string
  MaxFloor: number
  Floor: number
  Address: string
  Age: number
  Direction: string
  PublishedAt: string
  Rent: number
  ManagementFee: number
  SecurityDeposit: number
  KeyMoney: number
  Size: number
  Url: string
  BrokeRageFee: string
}

export const createAirtableClient = (): AirtableClient => {
  const apiKey = process.env["AIRTABLE_API_KEY"]
  const baseId = process.env["AIRTABLE_BASE_ID"]
  const tableName = process.env["AIRTABLE_TABLE_NAME"]
  if (baseId === undefined || apiKey === undefined || tableName === undefined) {
    throw new Error()
  }

  const airtable = new Airtable({
    apiKey,
  })
  const table = airtable.base(baseId).table(tableName)

  return {
    insert: async (houseList) => {
      const records = await table.create(
        houseList.map((house) => ({
          fields: toField(house),
        }))
      )
      return records.map((r) => r.id)
    },

    getAll: async () => {
      const records = await table.select().all()
      return records.map(fromField)
    },
  }
}

const toField = (house: House): HouseFields => ({
  Name: house.name,
  Layout: house.layout,
  Type: house.type,
  Structure: house.structure,
  MaxFloor: house.maxFloor,
  Floor: house.floor,
  Address: house.address,
  Age: house.age,
  Direction: house.direction,
  PublishedAt: format(house.publishedAt, "yyyy-MM-dd"),
  Rent: house.rent,
  ManagementFee: house.managementFee,
  SecurityDeposit: house.securityDeposit,
  KeyMoney: house.keyMoney,
  Size: house.size,
  Url: house.url,
  BrokeRageFee: house.brokeRageFee,
})

const fromField = (record: Record<FieldSet>): House => ({
  name: record.get("Name") as string,
  layout: record.get("Layout") as string,
  type: record.get("Type") as string,
  structure: record.get("Structure") as string,
  maxFloor: record.get("MaxFloor") as number,
  floor: record.get("Floor") as number,
  address: record.get("Address") as string,
  age: record.get("Age") as number,
  direction: record.get("Direction") as string,
  publishedAt: parse(
    record.get("PublishedAt") as string,
    "yyyy-MM-dd",
    new Date()
  ),
  rent: record.get("Rent") as number,
  managementFee: record.get("ManagementFee") as number,
  securityDeposit: record.get("SecurityDeposit") as number,
  keyMoney: record.get("KeyMoney") as number,
  size: record.get("Size") as number,
  url: record.get("Url") as string,
  brokeRageFee: record.get("BrokeRageFee") as string,
})
