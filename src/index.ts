import * as dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors, {CorsOptions} from 'cors'
import routes from './routes'

process.on('SIGTERM', () => process.exit(0))
process.on('SIGINT', () => process.exit(0))

const app = express()

const corsOptions: CorsOptions = {
  origin: [
    'https://amplifyhope.cc',
    'https://stage.amplifyhope.cc',
    'http://dev.amplifyhope.cc:3000',
    'http://localhost:3000'
  ]
}

app.use(cors(corsOptions))
app.use(routes)

const port = process.env.PORT || 3002
app.listen(port, () => console.log(`Server is listening on port ${port}...`))

export default app
