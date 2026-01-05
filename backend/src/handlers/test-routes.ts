import type { Request, Response, NextFunction } from "express-serve-static-core";




export const testReqUser = async (req: Request, res: Response, next: NextFunction) => {
  console.log("here")
  console.log(req.user)
  req.user = {
    id: "test",
    email: "tse",
    isAdmin: false,
    username: "test",
    highScore: 3,
    profilePicture: ""
  }
  res.send("hey")
}