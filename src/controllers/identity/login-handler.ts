import sendGrid from '@sendgrid/mail'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import Stripe from 'stripe'
import config from '../../config/config'
import { sendMagicLink } from './send-magic-link'

sendGrid.setApiKey(config.sendGrid.apiKey)

type JwtSignPayload = {
  stripeCustomerId: string
  email: string
}

export const loginHandler = async (req: Request, res: Response) => {
  const stripe = new Stripe(config.stripe.secretKey, {
    apiVersion: '2023-10-16',
    typescript: true
  })

  const { email } = req.body
  let customer: Stripe.Response<Stripe.ApiList<Stripe.Customer>>
  let jwtSignPayload: JwtSignPayload

  try {
    customer = await stripe.customers.list({ email })
  } catch (error) {
    console.error('There was an error fetching the user from stripe: ', error.message)
    res.json({ message: 'There was a problem, please try again later.' }) 
  }

  if (!customer.data[0]) return res.sendStatus(404)

  jwtSignPayload = { stripeCustomerId: customer.data[0].id, email }
  const token = jwt.sign(jwtSignPayload, config.jwtSecret, { expiresIn: '10m' })
  
  try {
    await sendMagicLink(email, token)
    return res.status(200).redirect(`${config.clientBaseUrl}/auth/verify`)
  } catch (error) {
    console.error('There was an error sending the magic link: ', error.message)
    res.sendStatus(500)
  }
}
