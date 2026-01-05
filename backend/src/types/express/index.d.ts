import * as express from "express-serve-static-core";
declare global {
  namespace Express {
    interface User {
      id: string
      email: string,
      username: string
      profilePicture: string
      highScore: number
      isAdmin: boolean
    }
  }
}