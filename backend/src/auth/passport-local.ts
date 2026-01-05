import passport from "passport"
import passportlocal from "passport-local"
import { UsersModel } from "../database/models/Users.ts"
import { passwordCompare } from "../utils/bcrypt-util.ts"
import type { LocalUserType } from "../types/types.ts"
passport.use(new passportlocal.Strategy(
  {
    usernameField: "email",
    passwordField: "password"
  }
  , async function (email, password, done) {
  try {
    if (!email || !password) throw new Error()
    const user = await UsersModel.findOne({
      email: email,
      provider: "local"
    })
    if (!user || !(user as LocalUserType).hash) return done(null, false)
    const valid = await passwordCompare(password, (user as LocalUserType).hash)
    if (!valid) return done(null, false)
      
    done(null, ({id: user.id} as Express.User))
  
  } catch (e) {
    console.error("Error finding Local User")
    done(e, false)
  }

}))