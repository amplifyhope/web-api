import Stripe from 'stripe'
import { Request, Response } from 'express'
import config from '../../config/config'

export const createPortalSession = async (req: Request, res: Response) => {
  const stripe = new Stripe(config.stripe.secretKey, { typescript: true })

  const { email } = req.body

  try {
    const customer = await stripe.customers.list({ email })

    const session = await stripe.billingPortal.sessions.create({
      customer: customer.data[0].id,
      return_url: req.headers.origin ?? 'http://localhost:3000'
    })

    res.status(200).json(session)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Internal Server error'

    res.status(500).json({ statusCode: 500, message: errorMessage })
  }
}
