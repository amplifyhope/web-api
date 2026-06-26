import * as Sentry from '@sentry/node'
import { nodeProfilingIntegration } from '@sentry/profiling-node'
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [
    nodeProfilingIntegration()
  ],
  tracesSampleRate: 0.1,
  profilesSampleRate: 0.1
})
