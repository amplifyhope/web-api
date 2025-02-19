import { Request, Response } from 'express'
import Stripe from 'stripe'
import config from '../../config/config'
import jwt, { JwtPayload } from 'jsonwebtoken'

interface MagicLinkJwtPayload extends JwtPayload {
  stripeCustomerId?: string
  email?: string
}

type VerifyRequestQuery = {
  token: string
}

export const verifyMagicLink = async (
  req: Request<object, object, object, VerifyRequestQuery>,
  res: Response
) => {
  const stripe = new Stripe(config.stripe.secretKey, { typescript: true })

  const { token } = req.query
  if (!token) return res.sendStatus(401)

  const decodedToken = jwt.verify(
    token,
    config.jwtSecret
  ) as MagicLinkJwtPayload
  try {
    const donor = await stripe.customers.retrieve(decodedToken.stripeCustomerId)

    if (donor && !donor.deleted) {
      const session = await stripe.billingPortal.sessions.create({
        customer: donor.id,
        return_url: config.clientBaseUrl
      })

      res.redirect(session.url)
    }
  } catch (error) {
    console.error('There was an error fetching the user: ', error.message)
    res.sendStatus(401)
  }
}
