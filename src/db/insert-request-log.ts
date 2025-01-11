import { RequestLogInput } from '../types'
import { getPool, buildUpsertQuery } from '../config/db'

export const insertRequestLog = async (values: RequestLogInput) => {
  const pool = await getPool()

  const insertRequestLogQuery = buildUpsertQuery({
    tableName: 'request_log',
    pkFieldNames: ['id'],
    obj: values
  })

  await pool.query(insertRequestLogQuery)
}
