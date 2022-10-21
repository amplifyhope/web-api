// import * as dotenv from 'dotenv'
// dotenv.config()

import { CURRENCY, MAX_AMOUNT, MIN_AMOUNT } from '../../config'
import { DonationRequestBody } from '../../types'
import { formatAmountForStripe } from '../../utils/stripe-helpers'
import { Request, Response } from 'express'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2020-08-27',
  typescript: true
})

export const oneTimeDonationCheckout = async (req: Request, res: Response) => {
  const { amount, email, fund }: DonationRequestBody = req.body
  
  try {
    if (!(amount >= MIN_AMOUNT && amount <= MAX_AMOUNT)) {
      throw new Error('Invalid amount.')
    }

    const customer = await stripe.customers.list({ email })
    
    const params: Stripe.Checkout.SessionCreateParams = {
      customer: customer.data[0] ? customer.data[0].id : undefined,
      customer_email: !customer.data[0] ? email : undefined,
      line_items: [
        {
          name: `Donate to Amplify Hope: ${fund}`,
          amount: formatAmountForStripe(amount, CURRENCY),
          currency: CURRENCY,
          quantity: 1
        }
      ],
      billing_address_collection: 'required',
      metadata: {
        fund
      },
      success_url: `${req.headers.origin}/result/{CHECKOUT_SESSION_ID}`,
      cancel_url: req.headers.origin as string
    }

    const checkoutSession: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create(params)
    res.status(200).json(checkoutSession)
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : 'Internal server error'
    res.status(500).json({ statusCode: 500, message: errorMessage })
  }
}
