import { app } from './app'
import { initConfig, getConfig } from './config/config'

const main = async () => {
  await initConfig()
  const config = getConfig()
  const port = config.port

  app.listen(port, () => console.log(`Server is listening on port ${port}...`))
}

main()
