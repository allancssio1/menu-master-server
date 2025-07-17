export class ConvertPrice {
  rawPrice: string | number
  decimal: number

  constructor({
    rawPrice,
    decimal,
  }: {
    rawPrice: string | number
    decimal: number
  }) {
    this.rawPrice = rawPrice
    this.decimal = decimal
  }

  static inInteger({
    rawPrice,
    decimal,
  }: {
    rawPrice: string | number
    decimal: number
  }): number {
    return Math.round(Number(rawPrice) * 10 ** decimal)
  }

  static inDecimal({
    rawPrice,
    decimal,
  }: {
    rawPrice: string | number
    decimal: number
  }) {
    return Number(rawPrice) / 10 ** decimal
  }
}
