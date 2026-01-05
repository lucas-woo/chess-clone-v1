import type {Request, Response, NextFunction} from "express-serve-static-core";
import { ProfilePictureModel } from "../database/models/ProfilePictures.ts";
import { UsersModel } from "../database/models/Users.ts";
import { findAndUpdateProfilePicture } from "../utils/leaderboard-util.ts";

export const getProfilePictures = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profiles = await ProfilePictureModel.find({}, { url: 1, imageName: 1, _id: 0 }).lean();
    if(!profiles) throw new Error()
    return res.send(profiles)
  } catch (e) {
    console.log("error getting profile pictures");
    next(e)
  }
}

export const selectProfilePicture = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { imageName } = req.body
    if(!imageName || !req.user) throw new Error()
    
    const picture = await ProfilePictureModel.findOne({
      imageName: imageName
    })
    if(!picture) throw new Error()
    if(picture.url === req.user.profilePicture){
      return res.send({
        err: false,
        profilePicture: req.user.profilePicture
      })
    }
    
    const updated = await UsersModel.findByIdAndUpdate(req.user.id, {
      profilePicture: picture.url
    })
    if (!updated) throw new Error();

    await findAndUpdateProfilePicture(req.user.username, picture.url)

    return res.send({
      err: false,
      profilePicture: picture.url
    })
    

  } catch (e) {
    console.log("error changing profile pictures");
    next(e)
  }
}