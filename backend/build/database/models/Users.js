import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username: {
        type: mongoose.Schema.Types.String,
        default: ""
        //  unique: true
    },
    hash: {
        type: mongoose.Schema.Types.String,
    },
    authID: {
        type: mongoose.Schema.Types.String,
    },
    email: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    provider: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    profilePicture: {
        type: mongoose.Schema.Types.String,
        default: ""
    },
    highScore: {
        type: mongoose.Schema.Types.Number,
        default: 0
    },
    isAdmin: {
        type: mongoose.Schema.Types.Boolean,
        default: false
    }
});
userSchema.index({ email: 1, provider: 1 });
export const UsersModel = mongoose.model("Users", userSchema);
