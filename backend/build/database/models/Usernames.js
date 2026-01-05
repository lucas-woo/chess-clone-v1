import mongoose from "mongoose";
const usernameSchema = new mongoose.Schema({
    username: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
    },
});
export const UsernamesModel = mongoose.model("Usernames", usernameSchema);
