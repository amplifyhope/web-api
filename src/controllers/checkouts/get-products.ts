import { Request, Response } from 'express'
import Stripe from 'stripe'
import config from '../../config/config'

type GetProductsQueryParams = {
  type: 'one-time' | 'recurring'
}

export const getProducts = async (
  req: Request<GetProductsQueryParams>,
  res: Response
) => {
  const stripe = new Stripe(config.stripe.secretKey, { typescript: true })

  const { type } = req.params

    try {
    const productsFromStripe = await stripe.products.search({
      query: `active: 'true' AND metadata['type']: '${type}'`
    })

    const productsForUI = productsFromStripe.data.map(product => {
      return {
        stripeId: product.id,
        productName: product.name,
        productType: product.metadata.type
      }
    })

    return res.status(200).json({ products: productsForUI })
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : 'Internal server error'
    res.status(500).json({ statusCode: 500, message: errorMessage })
  }
}
