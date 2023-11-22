export type DonationRequestBody = {
  email: string
  amount: number
  interval?: IntervalOptions
  fund: FundOptions
  notes?: string
}

export enum IntervalOptions {
  month = 'month',
  quarter = 'quarter',
  year = 'year'
}

export enum FundOptions {
  general = 'general'
}

export type DBConfig = {
  user: string
  password?: string
  host: string
  port: number
  database: string
}

export type Config = {
  db: DBConfig
  port: number
  environment: string
  sentryDsn: string
  stripeSecretKey: string
  stripeWebHookSecret: string
  StripeRecurringProductId: string
}

export type ConfigSource = {
  name: string
  data: Record<string, unknown>
}

export type ConfigPath = {
  source: string
  path: string
}

export type ConfigResult = {
  val: unknown
  source: string
  path: string
}

export type UpsertQueryConfig = {
  tableName: string
  pkFieldNames: string[]
  jsonFieldNames?: string[]
  setterOverrides?: { [key: string]: string }
  obj: any
}

export type DeleteQueryConfig = {
  tableName: string
  key: Record<string, any>
}

export type RequestLogInput = {
  endpoint: string
  ipAddress: string
  baseUrl: string
  method: string
  statusCode: number
  status: string
}

export type UpsertProductInput = {
  name: string
  description?: string | null
  stripeProductId: string
  createdAt: string
  updatedAt: string
  isActive: boolean
}
