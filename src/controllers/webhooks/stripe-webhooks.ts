import Stripe from 'stripe'
import { Request, Response } from 'express'
import config from '../../config/config'
import { upsertProduct } from '../../db'
import { UpsertProductInput } from '../../types'
import { deleteProduct } from '../../db'
import { convertUnixToIso } from '../../utils'

/* eslint no-console: ["error", { allow: ["log"] }] */
export const stripeWebhooks = async (req: Request, res: Response) => {
  const stripe = new Stripe(config.stripe.secretKey, {
    apiVersion: '2023-10-16',
    typescript: true
  })

  const webhookSecret: string = config.stripe.webHookSecret

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
    let product

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
      case 'product.created':
      case 'product.updated':
        product = event.data.object as Stripe.Product
        const upsertValues: UpsertProductInput = {
          stripeProductId: product.id,
          name: product.name,
          description: product.description,
          createdAt: convertUnixToIso(product.created),
          updatedAt: convertUnixToIso(product.updated),
          isActive: product.active
        }

        await upsertProduct(upsertValues)
        console.log(
          `🔄 Product: ${product.name}, id: ${product.id} synced to database`
        )
        break
      case 'product.deleted':
        product = event.data.object as Stripe.Product

        await deleteProduct(product.id)
        console.log(
          `🗑 Product: ${product.name}, id: ${product.id} deleted from database`
        )
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
