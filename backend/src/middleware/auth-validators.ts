import { Request, Response, NextFunction} from "express-serve-static-core"

export const alreadyAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.user) {
    return res.sendStatus(200)
  }
  next()
}

export const protectedroute = (req: Request, res: Response, next: NextFunction) => {
  if(!req.user){
    return res.status(401).send({
      err: true
    })
  }
  next()
}

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  res.sendStatus(500);
}

export const adminRoute = (req: Request, res: Response, next: NextFunction) => {
  if(!req.user?.isAdmin){
     return res.status(401).send({
      err: true
    })
  }
  next()
}