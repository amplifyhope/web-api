import express, { json, raw } from 'express'
import {
  createPortalSession,
  getCheckoutSessionById,
  getProducts,
  postCheckoutSession,
  stripeWebhooks
} from '../controllers'
import { loginHandler } from '../controllers/identity/login-handler'
import { verifyMagicLink } from '../controllers/identity/verify-magic-link'
import { getPool } from '../config/db'

const router = express.Router()

router.get('/health', async (_req, res) => {
  try {
    await getPool().query({ text: 'SELECT 1' })
    res.status(200).json({ health: 'ok' })
  } catch {
    res.status(503).json({ health: 'degraded', db: 'unreachable' })
  }
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.get('/debug-sentry', (_req, _res) => {
  throw new Error('Sentry Error')
})

router.get('/products/:type', json(), getProducts)

router.get('/checkout-sessions/:id', json(), getCheckoutSessionById)
router.post('/checkout', json(), postCheckoutSession)

router.post('/create-portal-session', json(), createPortalSession)

router.post(
  '/stripe-webhooks',
  raw({ type: 'application/json' }),
  stripeWebhooks
)

router.post('/login', json(), loginHandler)
router.get('/verify', json(), verifyMagicLink)

export default router
