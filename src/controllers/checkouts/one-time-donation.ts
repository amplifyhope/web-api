import { CURRENCY, MAX_AMOUNT, MIN_AMOUNT } from '../../config'
import { DonationRequestBody } from '../../types'
import { formatAmountForStripe } from '../../utils/stripe-helpers'
import { Request, Response } from 'express'
import Stripe from 'stripe'
import { getConfig } from '../../config/config'

export const oneTimeDonationCheckout = async (req: Request, res: Response) => {
  const stripe = new Stripe(getConfig().stripeSecretKey, {
    apiVersion: '2023-10-16',
    typescript: true
  })

  const { amount, email, fund, notes }: DonationRequestBody = req.body

  try {
    if (!(amount >= MIN_AMOUNT && amount <= MAX_AMOUNT)) {
      throw new Error('Invalid amount.')
    }

    const customer = await stripe.customers.list({ email })

    const params: Stripe.Checkout.SessionCreateParams = {
      ui_mode: 'embedded',
      customer: customer.data[0] ? customer.data[0].id : undefined,
      customer_email: !customer.data[0] ? email : undefined,
      line_items: [
        {
          price_data: {
            currency: CURRENCY,
            unit_amount: formatAmountForStripe(amount, CURRENCY),
            product_data: {
              name: `Donate to Amplify Hope: ${fund}`,
              description: notes
            }
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      billing_address_collection: 'required',
      metadata: {
        fund
      },
      return_url: `${
        req.headers.origin ?? 'http://localhost:3002'
      }/result/{CHECKOUT_SESSION_ID}`
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
