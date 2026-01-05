import { Router } from "express";
import { setNewPuzzle, deletePuzzleById, uploadNewImage, deleteProfileImage } from "../handlers/admin-routes.ts";
import { adminRoute } from "../middleware/auth-validators.ts";

const router = Router()

router.post("/create", adminRoute, setNewPuzzle)

router.delete("/delete", adminRoute, deletePuzzleById)

router.post("/upload-image", adminRoute, uploadNewImage)

router.delete("/delete-image", adminRoute, deleteProfileImage)

export default router