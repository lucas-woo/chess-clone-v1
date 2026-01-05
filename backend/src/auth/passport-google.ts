import passport from "passport";
import google from "passport-google-oauth20";
import { UsersModel } from "../database/models/Users.ts"
import type { Auth2UserType } from "../types/types.ts"
const GOOGLE_CLIENT_ID = process.env. GOOGLE_CLIENT_ID as string
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string

passport.use(new google.Strategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback"
}, async function(accessToken, refreshToken, profile, done){
  try {
    const googleUser = await UsersModel.findOne({
      email: profile._json.email,
      provider: "google"
    })
    if(!googleUser){
      let temp = profile.photos as {value: string}[]
      let profilePhoto = temp[0].value
      const created = await UsersModel.create({
        username: "",
        authID: profile.id,
        email: profile._json.email,
        provider: "google",
        profilePicture: profilePhoto,
        highScore: 0,
        isAdmin: false
      })
      if (created) {
        done(null, ({id: created.id} as Express.User))
      } else {
        throw new Error()
      }
    } else {
      if ((googleUser as Auth2UserType).authID !== profile.id) return done(null, false)
      done(null, ({id: googleUser.id} as Express.User))
    }
  } catch (e) {
    console.error("Error google strategy")
    done(e, false)
  }
}))