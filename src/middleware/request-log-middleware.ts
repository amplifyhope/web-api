import { Request, Response, NextFunction } from 'express'
import { RequestLogInput } from 'types'
import { insertRequestLog } from '../db/insert-request-log'

export const requestLogMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestLogRecord: RequestLogInput = {
    endpoint: req.path,
    ipAddress: req.ip,
    baseUrl: req.baseUrl,
    method: req.method,
    statusCode: res.statusCode,
    status: res.statusMessage
  }

  await insertRequestLog(requestLogRecord)
  next()
}
