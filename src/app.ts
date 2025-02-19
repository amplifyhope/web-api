import './instrument'
import dotenv from 'dotenv'
dotenv.config()

import * as Sentry from '@sentry/node'
import express from 'express'
import cors, { CorsOptions } from 'cors'
import routes from './routes'

process.on('SIGTERM', () => process.exit(0))
process.on('SIGINT', () => process.exit(0))

export const app = express()

const corsOptions: CorsOptions = {
  origin: [
    'https://amplifyhope.cc',
    'https://www.amplifyhope.cc',
    'https://stage.amplifyhope.cc',
    'http://dev.amplifyhope.cc:3000',
    'http://localhost:3000',
    'https://billing.stripe.com'
  ]
}

app.use(cors(corsOptions))
app.use(routes)

Sentry.setupExpressErrorHandler(app)
