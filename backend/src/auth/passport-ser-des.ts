import passport, { use } from "passport";
import { UsersModel } from "../database/models/Users.ts";
import type { LocalUserType, Auth2UserType } from "../types/types.ts";
import "./passport-google.ts"
import "./passport-local.ts"



passport.serializeUser(function (user, done) {
    done(null, user.id)
})

passport.deserializeUser(async function(id: string, done){
  try{

    if (!id) throw new Error()

    const user = await UsersModel.findById(id)

      if (!user) throw new Error("local")

      done(null, 
        {
        id,
        username: user.username || "",
        email: user.email,
        profilePicture: user.profilePicture || "",
        highScore: user.highScore,
        isAdmin: user.isAdmin
      })
    
  } catch (e) {
    console.error("error deserializing user")
    done(e, null)
  }
})