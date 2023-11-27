import dotenv from 'dotenv'
dotenv.config()

import * as Sentry from '@sentry/node'
import { ProfilingIntegration } from '@sentry/profiling-node'
import express from 'express'
import cors, { CorsOptions } from 'cors'
import routes from './routes'

process.on('SIGTERM', () => process.exit(0))
process.on('SIGINT', () => process.exit(0))

export const app = express()

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app }),
    new ProfilingIntegration()
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0
})

const corsOptions: CorsOptions = {
  origin: [
    'https://amplifyhope.cc',
    'https://www.amplifyhope.cc',
    'https://stage.amplifyhope.cc',
    'http://dev.amplifyhope.cc:3000',
    'http://localhost:3000'
  ]
}

app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.tracingHandler())

app.use(cors(corsOptions))
app.use(routes)

app.use(Sentry.Handlers.errorHandler())
