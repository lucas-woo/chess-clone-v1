import mongoose from "mongoose";
const profilePictureSchema = new mongoose.Schema({
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
});
export const ProfilePictureModel = mongoose.model("ProfilePictures", profilePictureSchema);
