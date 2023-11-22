import dotenv from 'dotenv'
dotenv.config()

const e = process.env

export default {
  db: {
    user: e.DBUSER,
    password: e.DBPASSWORD,
    host: e.DBHOST,
    port: Number(e.DBPORT),
    database: e.DBDATABASE
  },
  port: e.PORT,
  environment: e.NODE_ENV,
  sentryDsn: e.SENTRY_DSN,
  stripeSecretKey: e.STRIPE_SECRET_KEY,
  stripeWebHookSecret: e.STRIPE_WEBHOOK_SECRET,
  StripeRecurringProductId: e.STRIPE_RECURRING_PRODUCT_ID
}
