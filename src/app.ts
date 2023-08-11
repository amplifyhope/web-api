import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors, { CorsOptions } from 'cors'
import routes from './routes'
import { requestLogMiddleware } from './middleware/request-log-middleware'
import { asyncHandler } from './utils/async-handler'

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

app.use(asyncHandler(requestLogMiddleware))
app.use(cors(corsOptions))
app.use(routes)
