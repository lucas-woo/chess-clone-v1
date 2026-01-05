import type { Request, Response, NextFunction } from "express-serve-static-core";
import { UsersModel } from "../database/models/Users.ts";
import { passwordHash } from "../utils/bcrypt-util.ts";
import passport from "passport";
import { UsernamesModel } from "../database/models/Usernames.ts";
import { findAndUpdateUsername } from "../utils/leaderboard-util.ts";

export const googleLogin = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("google", function(err: Error, user: {id: string} | false){
    const REDIRECT_LOGIN_URL = process.env.REDIRECT_LOGIN_URL || "http://localhost:5173/login"
    const REDIRECT_URL = process.env.REDIRECT_URL || "http://localhost:5173/"
    if(err || !user){
      return res.redirect(REDIRECT_LOGIN_URL)
    }
    req.logIn(({id: user.id} as Express.User), function(err: Error) {
      if(err) return res.redirect(REDIRECT_LOGIN_URL)
      res.redirect(REDIRECT_URL)
    })
  })(req, res, next)
}

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body
    const existingUsername = await UsernamesModel.findOne({
      username,
    })
    const existingUser = await UsersModel.findOne({
      email: email,
      provider: "local"
    })
    if(existingUsername || existingUser) {
      return res.status(400).send({err: true, nextPage: false})
    }
    const hashedPassword = await passwordHash(password)
    const newLocalUser = new UsersModel({
        username: username,
        hash: hashedPassword,
        email: email,
        provider: "local",
        profilePicture: "",
        highScore: 0,
        isAdmin: false
      })
    const savedUser = await newLocalUser.save();
    const newUsername = await UsernamesModel.create({
      username,
    })
    if(!savedUser || !newUsername) throw new Error()
    next()
  } catch (e) {
    next(e)
  }
}

export const loginLocalUser = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", function(err: Error, user: {id: string} | false){
    if(err || !user){
      req.user = undefined;
      return next(err)
    } 
    req.logIn(({id: user.id} as Express.User), function(err: Error) {
      if (err) next(err)
      
      const { remember } = req.body;
      if(remember){
        req.session.cookie.maxAge = Number(process.env.SESSION_SAVE_TIME) || 2592000000
      }
      res.send({
        err: null,
        nextPage: true
      })
    })
  })(req, res, next)
}

export const userData = (req: Request, res: Response, next: NextFunction) => {
  if(req.user){
      return res.send({
         username: req.user.username,
         highScore: req.user.highScore,
         profilePicture: req.user.profilePicture,
         err: false,
         isAdmin: req.user.isAdmin
      })
  } else {
      return res.send({
         err: true,
         username: null,
         profilePicture: null,
         email: null,
         isAdmin: false
      })
   }
}
  
export const logout = (req: Request, res: Response, next: NextFunction) => {
   if(req.user){
      req.logout(function(err) {
         if (err) { res.send(false)}
         res.send(true)
      });
   } else {
      res.send(null)
   } 
}

export const verifyUsername = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const { username } = req.query;

    const exists = await UsernamesModel.findOne({
      username,
    })
    if (exists) {
      return res.send({
        available: false
      })
    }
    return res.send({
      available: true
    })
  } catch (e) {
    console.log("error with username verification")
    next(e)
  }
}

export const updateUsername = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user || !req.body.username) return res.sendStatus(401)
    const { username } = req.body;
    const exists = await UsernamesModel.findOne({
      username,
    })
    if (exists) {
      return res.send({
        err: true
      })
    }
    const updated = await UsersModel.updateOne({
      _id: req.user.id
    }, {
      username
    })
    if (updated) {

      if(req.user.username){
        await UsernamesModel.updateOne({username: req.user.username}, {username: username})
      } else {
        await UsernamesModel.create({
          username
        })
      }
      console.log("updating leads")
      await findAndUpdateUsername(req.user.username, username)
      console.log("updated leads")
      return res.send({
         newUsername: username,      
         err: false
      })
    } else {
      return res.send({
        newUsername: false,
         err: true
      })
    }
  } catch (e) {
    console.log("error with username verification")
    next(e)
  }
}