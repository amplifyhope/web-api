import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import {
  getCheckoutSessionById,
  oneTimeDonationCheckout,
  recurringDonationCheckout,
  stripeWebhooks
} from 'controllers'

const router = express.Router()
router.use(cookieParser())
router.use(bodyParser.json({ limit: '1024kb' }))

router.get('/health', (_req, res) => {
  res.status(200).json({
    health: 'ok'
  })
})

router.get('/checkout-sessions/:id', getCheckoutSessionById)
router.post('/checkouts/one-time', oneTimeDonationCheckout)
router.post('/checkouts/recurring', recurringDonationCheckout)
router.post('/stripe-webhooks', stripeWebhooks)

export default router
