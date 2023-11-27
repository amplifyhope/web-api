import express, { json, raw } from 'express'
import cookieParser from 'cookie-parser'
import {
  getCheckoutSessionById,
  oneTimeDonationCheckout,
  recurringDonationCheckout,
  stripeWebhooks
} from '../controllers'

const router = express.Router()
router.use(cookieParser())

router.get('/health', (_req, res) => {
  res.status(200).json({
    health: 'ok'
  })
})

router.get('/debug-sentry', (_req, _res) => {
  throw new Error("Sentry Error")
})

router.get('/checkout-sessions/:id', json(), getCheckoutSessionById)
router.post('/checkouts/one-time', json(), oneTimeDonationCheckout)
router.post('/checkouts/recurring', json(), recurringDonationCheckout)
router.post(
  '/stripe-webhooks',
  raw({ type: 'application/json' }),
  stripeWebhooks
)

export default router
