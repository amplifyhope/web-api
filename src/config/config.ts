import dotenv from 'dotenv'
dotenv.config()

export default {
  db: {
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    host: process.env.DBHOST,
    port: Number(process.env.DBPORT),
    database: process.env.DBDATABASE
  },
  port: Number(process.env.PORT),
  environment: process.env.NODE_ENV,
  sentryDsn: process.env.SENTRY_DSN,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripeWebHookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  StripeRecurringProductId: process.env.STRIPE_RECURRING_PRODUCT_ID
}
