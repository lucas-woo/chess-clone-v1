import { Router } from "express";
import "../auth/passport-ser-des.ts"
import passport from "passport";
import { signup, loginLocalUser ,googleLogin, logout, userData, verifyUsername, updateUsername } from "../handlers/auth-routes.ts";
import { alreadyAuthenticated } from "../middleware/auth-validators.ts";

const router = Router()

//need validation
router.post("/signup", alreadyAuthenticated , signup, loginLocalUser)

router.post("/login", alreadyAuthenticated, loginLocalUser)

router.get("/google", passport.authenticate('google', { scope: ['profile', "email"] }))

router.get("/google/callback", googleLogin)

router.get("/user/data", userData)

router.get("/logout", logout)

router.get("/verify-username", verifyUsername)

router.put("/update-username", updateUsername)

export default router