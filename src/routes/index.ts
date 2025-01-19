import express, { json, raw } from 'express'
import {
  createPortalSession,
  getCheckoutSessionById,
  oneTimeDonationCheckout,
  recurringDonationCheckout,
  stripeWebhooks
} from '../controllers'
import { loginHandler } from '../controllers/identity/login-handler'
import { verifyMagicLink } from '../controllers/identity/verify-magic-link'

const router = express.Router()

router.get('/health', (_req, res) => {
  res.status(200).json({
    health: 'ok'
  })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.get('/debug-sentry', (_req, _res) => {
  throw new Error('Sentry Error')
})

router.get('/checkout-sessions/:id', json(), getCheckoutSessionById)
router.post('/checkouts/one-time', json(), oneTimeDonationCheckout)
router.post('/checkouts/recurring', json(), recurringDonationCheckout)
router.post('/create-portal-session', json(), createPortalSession)
router.post(
  '/stripe-webhooks',
  raw({ type: 'application/json' }),
  stripeWebhooks
)

router.post('/login', json(), loginHandler)
router.get('/verify', json(), verifyMagicLink)

export default router
