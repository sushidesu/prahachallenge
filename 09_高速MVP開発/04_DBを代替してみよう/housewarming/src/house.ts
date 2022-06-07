export type House = {
  // 基本情報
  name: string
  type: string // マンション/アパートなど
  structure: string // 木造, 鉄筋など
  layout: string // 1K 1Rなど
  floor: number // 階数
  maxFloor: number // 階建て
  address: string // 住所
  age: number // 築年数
  direction: string // 向き
  publishedAt: Date // 掲載日
  size: number // m^2
  // 料金
  rent: number // 賃料
  managementFee: number // 管理費
  securityDeposit: number // 敷金
  keyMoney: number // 礼金
  brokeRageFee: string // 仲介手数料
  // その他
  url: string // 掲載ページのURL
}
