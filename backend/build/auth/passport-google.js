var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import passport from "passport";
import google from "passport-google-oauth20";
import { UsersModel } from "../database/models/Users.js";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
passport.use(new google.Strategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
}, function (accessToken, refreshToken, profile, done) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const googleUser = yield UsersModel.findOne({
                email: profile._json.email,
                provider: "google"
            });
            if (!googleUser) {
                let temp = profile.photos;
                let profilePhoto = temp[0].value;
                const created = yield UsersModel.create({
                    username: "",
                    authID: profile.id,
                    email: profile._json.email,
                    provider: "google",
                    profilePicture: profilePhoto,
                    highScore: 0,
                    isAdmin: false
                });
                if (created) {
                    done(null, { id: created.id });
                }
                else {
                    throw new Error();
                }
            }
            else {
                if (googleUser.authID !== profile.id)
                    return done(null, false);
                done(null, { id: googleUser.id });
            }
        }
        catch (e) {
            console.error("Error google strategy");
            done(e, false);
        }
    });
}));
