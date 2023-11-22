import { app } from './app'
import config from './config/config'

const main = async () => {
  const port = config.port

  app.listen(port, () => console.log(`Server is listening on port ${port}...`))
}

main()
