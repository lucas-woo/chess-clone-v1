var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from "bcrypt";
const SALT = Number(process.env.SALT);
export const passwordHash = (password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hashed = yield bcrypt.hash(password, SALT);
        if (!hashed)
            throw new Error();
        return hashed;
    }
    catch (e) {
        return null;
    }
});
export const passwordCompare = (password, hash) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const valid = yield bcrypt.compare(password, hash);
        if (!valid)
            throw new Error();
        return valid;
    }
    catch (e) {
        return null;
    }
});
