export type DonationRequestBody = {
  email: string
  amount: number
  interval?: IntervalOptions
  fund: FundOptions
}

export enum IntervalOptions {
  month = 'month',
  quarter = 'quarter',
  year = 'year'
}

export enum FundOptions {
  general = 'general'
}
