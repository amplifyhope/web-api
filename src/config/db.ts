/* eslint-disable @typescript-eslint/no-explicit-any */
import * as R from 'ramda'
import camelcaseKeys from 'camelcase-keys'
import snakecase from 'snakecase-keys'
import { Pool, QueryConfig, QueryResultRow } from 'pg'
import config from './config'
import { DeleteQueryConfig, UpsertQueryConfig } from '../types'

type CustomPool = {
  query<R extends QueryResultRow = any, I extends any[] = any[]>(
    queryConfig: QueryConfig<I>
  ): Promise<R[]>

  end(): Promise<void>
}

const buildCustomPool = (pgPool: Pool): CustomPool => {
  return {
    async query<R extends QueryResultRow = any, I extends any[] = any[]>(
      queryConfig: QueryConfig<I>
    ): Promise<R[]> {
      return (await pgPool.query(queryConfig)).rows.map(x => camelcaseKeys(x))
    },

    async end(): Promise<void> {
      await pgPool.end()
    }
  }
}

let pool: CustomPool

export const getPool = () => {
  if (!pool) {
    const pgPool = new Pool(config.db)
    pool = buildCustomPool(pgPool)
  }

  return pool
}

export const getPgPlaceholders = (length: number, first = 1): string => {
  return R.range(first, first + length)
    .map(n => '$' + n)
    .join(', ')
}

export const buildUpsertQuery = ({
  tableName,
  pkFieldNames,
  jsonFieldNames = [],
  setterOverrides = {},
  obj
}: UpsertQueryConfig): QueryConfig => {
  const fieldNames = Object.keys(obj)
  const fieldNamesInSnakeCase = Object.keys(snakecase(obj))
  const nonPkFieldsInSnakecase = fieldNamesInSnakeCase.filter(
    x => !pkFieldNames.includes(x)
  )

  const getSetter = (snakecaseFieldName: string): string => {
    if (setterOverrides[snakecaseFieldName]) {
      return `"${snakecaseFieldName}" = ${setterOverrides[snakecaseFieldName]}`
    }
    return `"${snakecaseFieldName}" = EXCLUDED."${snakecaseFieldName}"`
  }

  const getValue = (fieldName: string): any => {
    return jsonFieldNames.includes(fieldName)
      ? JSON.stringify(obj[fieldName])
      : obj[fieldName]
  }

  return {
    text: `
      INSERT INTO "${tableName}"
      ("${fieldNamesInSnakeCase.join('", "')}")
      VALUES (${getPgPlaceholders(Object.keys(obj).length)})
      ON CONFLICT ("${pkFieldNames.join('", "')}") DO UPDATE
      SET
      ${nonPkFieldsInSnakecase.map(getSetter).join(',\n')}
    `,
    values: fieldNames.map(getValue)
  }
}

export const buildDeleteQuery = ({
  tableName,
  key
}: DeleteQueryConfig): QueryConfig => {
  const keys = Object.keys(snakecase(key))
  return {
    text: `
      DELETE FROM ${tableName}
      WHERE ${keys
        .map((key, index) => `"${key}" = $${index + 1}`)
        .join(' AND ')}
    `,
    values: Object.values(key)
  }
}
