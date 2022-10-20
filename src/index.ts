import express from 'express'
import dotenv from 'dotenv'
import routes from 'routes'

dotenv.config()

const app = express()

app.use(routes)

const port = process.env.PORT || 3002
app.listen(port, () => console.log(`Server is listening on port ${port}...`))
