import { getPool, buildDeleteQuery } from '../config/db'

export const deleteProduct = async (stripeProductId: string) => {
  const pool = await getPool()

  const deleteProductQuery = buildDeleteQuery({
    tableName: 'stripe_products',
    key: { stripe_product_id: stripeProductId }
  })

  await pool.query(deleteProductQuery)
}
