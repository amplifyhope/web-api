import dotenv from 'dotenv'
dotenv.config()

import { configUtil } from './config-util'
import { Config } from 'types'

const e = process.env

let config: Config
const c = configUtil()

export const initConfig = async () => {
  c.addSource({ name: 'env', data: e })
  c.ready()
}

export const getConfig = (): Config => {
  if (config == null) {
    config = {
      db: {
        user: c.getStr([{ source: 'env', path: 'DBUSER' }]),
        password: c.getStr([{ source: 'env', path: 'DBPASSWORD' }]),
        host: c.getStr([{ source: 'env', path: 'DBHOST' }]),
        port: c.getNum([{ source: 'env', path: 'DBPORT' }]),
        database: c.getStr([{ source: 'env', path: 'DBDATABASE' }])
      },
      port: c.getNum([{ source: 'env', path: 'PORT' }]),
      environment: c.getStr([{ source: 'env', path: 'NODE_ENV' }]),
      sentryDsn: c.getStr([{ source: 'env', path: 'SENTRY_DSN' }]),
      stripeSecretKey: c.getStr([{ source: 'env', path: 'STRIPE_SECRET_KEY' }]),
      stripeWebHookSecret: c.getStr([
        { source: 'env', path: 'STRIPE_WEBHOOK_SECRET' }
      ]),
      StripeRecurringProductId: c.getStr([
        { source: 'env', path: 'STRIPE_RECURRING_PRODUCT_ID' }
      ])
    }
  }

  return config
}
