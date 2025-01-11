import { UpsertProductInput } from '../types'
import { getPool, buildUpsertQuery } from '../config/db'

export const upsertProduct = async (values: UpsertProductInput) => {
  const pool = await getPool()

  const upsertProductQuery = buildUpsertQuery({
    tableName: 'stripe_products',
    pkFieldNames: ['stripe_product_id'],
    obj: values
  })

  await pool.query(upsertProductQuery)
}
