import { Request, Response } from 'express'
import Stripe from 'stripe'
import { getConfig } from '../../config/config'

/* eslint no-console: ["error", { allow: ["log"] }] */
export const stripeWebhooks = async (req: Request, res: Response) => {
  const stripe = new Stripe(getConfig().stripeSecretKey, {
    apiVersion: '2020-08-27',
    typescript: true
  })

  const webhookSecret: string = getConfig().stripeWebHookSecret

  if (req.method === 'POST') {
    const sig = req.headers['stripe-signature']!
    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown Error'
      if (err! instanceof Error) {
        return console.log(`⛔ Error: ${err}`)
      }
      console.log(`⛔ Error message: ${errorMessage}`)
      res.status(400).send(`Webhook Error: ${errorMessage}`)
      return
    }

    console.log(`✅ Success: ${event.id}`)

    let paymentIntent

    switch (event.type) {
      case 'invoice.created':
        const invoice = event.data.object as Stripe.Invoice
        console.log(`🚀 Invoice created because: ${invoice.billing_reason}`)
        if (invoice.billing_reason !== 'subscription_create') {
          await stripe.invoices.finalizeInvoice(invoice.id)
        }
        break
      case 'payment_intent.succeeded':
        paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log(`💸 Payment Intent Status: ${paymentIntent.status}`)
        break
      case 'payment_intent.payment_failed':
        paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log(
          `⛔ Payment failed: ${paymentIntent.last_payment_error?.message}`
        )
        break
      case 'charge.succeeded':
        const charge = event.data.object as Stripe.Charge
        console.log(`💵 Charge succeeded: ${charge.id}`)
        break
      default:
        console.log(`🤷‍♂️ Unhandled event type: ${event.type}`)
        break
    }

    res.status(200).json({ received: true })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}
