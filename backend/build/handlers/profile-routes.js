var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ProfilePictureModel } from "../database/models/ProfilePictures.js";
import { UsersModel } from "../database/models/Users.js";
import { findAndUpdateProfilePicture } from "../utils/leaderboard-util.js";
export const getProfilePictures = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profiles = yield ProfilePictureModel.find({}, { url: 1, imageName: 1, _id: 0 }).lean();
        if (!profiles)
            throw new Error();
        return res.send(profiles);
    }
    catch (e) {
        console.log("error getting profile pictures");
        next(e);
    }
});
export const selectProfilePicture = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { imageName } = req.body;
        if (!imageName || !req.user)
            throw new Error();
        const picture = yield ProfilePictureModel.findOne({
            imageName: imageName
        });
        if (!picture)
            throw new Error();
        if (picture.url === req.user.profilePicture) {
            return res.send({
                err: false,
                profilePicture: req.user.profilePicture
            });
        }
        const updated = yield UsersModel.findByIdAndUpdate(req.user.id, {
            profilePicture: picture.url
        });
        if (!updated)
            throw new Error();
        yield findAndUpdateProfilePicture(req.user.username, picture.url);
        return res.send({
            err: false,
            profilePicture: picture.url
        });
    }
    catch (e) {
        console.log("error changing profile pictures");
        next(e);
    }
});
