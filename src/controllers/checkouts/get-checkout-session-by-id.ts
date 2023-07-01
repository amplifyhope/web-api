import { Request, Response } from 'express'
import Stripe from 'stripe'
import { getConfig } from '../../config/config'

export const getCheckoutSessionById = async (req: Request, res: Response) => {
  const stripe = new Stripe(getConfig().stripeSecretKey, {
    apiVersion: '2020-08-27',
    typescript: true
  })

  const { id } = req.params

  try {
    if (!id.startsWith('cs_')) {
      throw Error('Incorrect CheckoutSession Id.')
    }
    const session: Stripe.Checkout.Session =
      await stripe.checkout.sessions.retrieve(id, {
        expand: ['payment_intent']
      })
    res.status(200).json(session)
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : 'Internal Server Error'
    res.status(500).json({ statusCode: 500, message: errorMessage })
  }
}
