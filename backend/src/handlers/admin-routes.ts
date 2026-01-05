import type { Request, Response, NextFunction} from "express-serve-static-core"
import { uploadImage, deleteImage } from "../utils/image-upload.ts";
import { PuzzleModel } from "../database/models/Puzzles.ts";
import { ProfilePictureModel } from "../database/models/ProfilePictures.ts";

export const setNewPuzzle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.isAdmin) throw new Error()
    const { gameState, playerSide, moves, level } = req.body;
    if (!gameState || !playerSide || !moves || !level) throw new Error()
    const newPuzzle = await PuzzleModel.create({
      gameState,
      playerSide,
      moves,
      level
    })
    if(!newPuzzle) throw new Error()
    return res.status(201).send({id: newPuzzle.id})
  } catch (e) {
    console.error("error creating new puzzle")
    next(e)
  }
}

export const deletePuzzleById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { puzzleID } = req.body
    const deleted = await PuzzleModel.findByIdAndDelete(puzzleID)
    if(!deleted) throw new Error()
    res.send({deleted: true})
  } catch (e) {
    console.log("error deleting puzzle")
    next(e)
  }
}

export const uploadNewImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {image, name} = req.body
    if(!image || !name) throw new Error();
    const result = await uploadImage(image)

    if(!result) throw new Error();

    const newImage = await ProfilePictureModel.create({
      imageName: name,
      url: result.url,
      publicID: result.publicID
    })

    if(!newImage) throw new Error();

    return res.send({
      err: false,
      url: newImage.url
    })

  } catch(e){
    console.log("error uploading new profile photo")
    next(e)
  }
}

export const deleteProfileImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { publicID } = req.body

    if(!publicID) throw new Error()

    const deleted = await deleteImage(publicID)

    if(!deleted) throw new Error()
    res.send({
      err: false,
      deleted: true
    })
  } catch (e) {
    console.log("error deleting profile photo")
    next(e)
  }
}