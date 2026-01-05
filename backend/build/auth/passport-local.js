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
import passportlocal from "passport-local";
import { UsersModel } from "../database/models/Users.js";
import { passwordCompare } from "../utils/bcrypt-util.js";
passport.use(new passportlocal.Strategy({
    usernameField: "email",
    passwordField: "password"
}, function (email, password, done) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!email || !password)
                throw new Error();
            const user = yield UsersModel.findOne({
                email: email,
                provider: "local"
            });
            if (!user || !user.hash)
                return done(null, false);
            const valid = yield passwordCompare(password, user.hash);
            if (!valid)
                return done(null, false);
            done(null, { id: user.id });
        }
        catch (e) {
            console.error("Error finding Local User");
            done(e, false);
        }
    });
}));
