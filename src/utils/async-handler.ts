import { Request, Response, NextFunction } from 'express'

type MiddleWareFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>

export const asyncHandler =
  (fn: MiddleWareFunction) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next)
  }
