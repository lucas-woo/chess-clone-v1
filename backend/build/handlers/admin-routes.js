var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { uploadImage, deleteImage } from "../utils/image-upload.js";
import { PuzzleModel } from "../database/models/Puzzles.js";
import { ProfilePictureModel } from "../database/models/ProfilePictures.js";
export const setNewPuzzle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.isAdmin))
            throw new Error();
        const { gameState, playerSide, moves, level } = req.body;
        if (!gameState || !playerSide || !moves || !level)
            throw new Error();
        const newPuzzle = yield PuzzleModel.create({
            gameState,
            playerSide,
            moves,
            level
        });
        if (!newPuzzle)
            throw new Error();
        return res.status(201).send({ id: newPuzzle.id });
    }
    catch (e) {
        console.error("error creating new puzzle");
        next(e);
    }
});
export const deletePuzzleById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { puzzleID } = req.body;
        const deleted = yield PuzzleModel.findByIdAndDelete(puzzleID);
        if (!deleted)
            throw new Error();
        res.send({ deleted: true });
    }
    catch (e) {
        console.log("error deleting puzzle");
        next(e);
    }
});
export const uploadNewImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { image, name } = req.body;
        if (!image || !name)
            throw new Error();
        const result = yield uploadImage(image);
        if (!result)
            throw new Error();
        const newImage = yield ProfilePictureModel.create({
            imageName: name,
            url: result.url,
            publicID: result.publicID
        });
        if (!newImage)
            throw new Error();
        return res.send({
            err: false,
            url: newImage.url
        });
    }
    catch (e) {
        console.log("error uploading new profile photo");
        next(e);
    }
});
export const deleteProfileImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { publicID } = req.body;
        if (!publicID)
            throw new Error();
        const deleted = yield deleteImage(publicID);
        if (!deleted)
            throw new Error();
        res.send({
            err: false,
            deleted: true
        });
    }
    catch (e) {
        console.log("error deleting profile photo");
        next(e);
    }
});
