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
import { UsersModel } from "../database/models/Users.js";
import "./passport-google.js";
import "./passport-local.js";
passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!id)
                throw new Error();
            const user = yield UsersModel.findById(id);
            if (!user)
                throw new Error("local");
            done(null, {
                id,
                username: user.username || "",
                email: user.email,
                profilePicture: user.profilePicture || "",
                highScore: user.highScore,
                isAdmin: user.isAdmin
            });
        }
        catch (e) {
            console.error("error deserializing user");
            done(e, null);
        }
    });
});
