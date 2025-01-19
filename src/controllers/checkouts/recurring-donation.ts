import { CURRENCY, MAX_AMOUNT, MIN_AMOUNT } from '../../config'
import Stripe from 'stripe'
import { DonationRequestBody, FundOptions, IntervalOptions } from '../../types'
import { formatAmountForStripe } from '../../utils/stripe-helpers'
import { Request, Response } from 'express'
import config from '../../config/config'

export const recurringDonationCheckout = async (
  req: Request,
  res: Response
) => {
  const stripe = new Stripe(config.stripe.secretKey, { typescript: true })

  if (req.method === 'POST') {
    let product: string | undefined
    let intervalCount = 1

    const { amount, email, interval, fund, notes }: DonationRequestBody =
      req.body

    if (fund === FundOptions.general) product = config.stripe.recurringProductId
    if (interval === IntervalOptions.quarter) intervalCount = 3

    const formattedAmount = formatAmountForStripe(amount, CURRENCY)
    const stripeInterval: Stripe.PriceListParams.Recurring.Interval =
      interval === IntervalOptions.year ? 'year' : 'month'
    let price: Stripe.Price | undefined

    try {
      if (!(amount >= MIN_AMOUNT && amount <= MAX_AMOUNT)) {
        throw new Error('Invalid amount')
      }

      const priceParams: Stripe.PriceListParams = {
        product,
        lookup_keys: [`${formattedAmount.toString()}_${interval}_${fund}`],
        recurring: { interval: stripeInterval }
      }

      const foundPrice = await stripe.prices.list(priceParams)
      price = foundPrice.data[0]

      if (!price) {
        const priceCreateParams: Stripe.PriceCreateParams = {
          currency: CURRENCY,
          product,
          unit_amount: formattedAmount,
          lookup_key: `${formattedAmount.toString()}_${interval}_${fund}`,
          recurring: {
            interval: stripeInterval!,
            interval_count: intervalCount
          }
        }

        price = await stripe.prices.create(priceCreateParams)
      }

      const customer = await stripe.customers.list({ email })
      const sessionParams: Stripe.Checkout.SessionCreateParams = {
        ui_mode: 'embedded',
        customer: customer.data[0] ? customer.data[0].id : undefined,
        customer_email: !customer.data[0] ? email : undefined,
        mode: 'subscription',
        line_items: [{ price: price.id, quantity: 1 }],
        billing_address_collection: 'required',
        metadata: { fund, notes: notes ?? '' },
        return_url: `${
          req.headers.origin ?? 'http://localhost:3000'
        }/result/{CHECKOUT_SESSION_ID}`
      }

      const checkoutSession = await stripe.checkout.sessions.create(
        sessionParams
      )

      res.status(200).json(checkoutSession)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Internal server error'
      res.status(500).json({ statusCode: 500, message: errorMessage })
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}
