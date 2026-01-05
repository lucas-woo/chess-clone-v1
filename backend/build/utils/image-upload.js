var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    //secure_distribution: 'domain.com', 
});
export const uploadImage = (image) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uploaded = yield cloudinary.uploader.upload(image, {
            folder: "chess-images",
            transformation: [
                { width: 150, height: 150, crop: "fill", gravity: "auto" },
                { quality: "auto:good" },
            ],
        });
        if (!uploaded.secure_url || !uploaded.public_id)
            throw new Error();
        return {
            url: uploaded.secure_url,
            publicID: uploaded.public_id
        };
    }
    catch (e) {
        return null;
    }
});
export const deleteImage = (publicID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield cloudinary.uploader.destroy(publicID);
        if (!deleted)
            throw new Error;
        return true;
    }
    catch (e) {
        return false;
    }
});
