import mongoose from "mongoose";
import type { ProfilePicture } from "../../types/types.ts";

const profilePictureSchema = new mongoose.Schema<ProfilePicture>({
  imageName: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true
  },
  url: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  publicID: {
    type: mongoose.Schema.Types.String,
    required: true,
  }
})

export const ProfilePictureModel = mongoose.model("ProfilePictures", profilePictureSchema)