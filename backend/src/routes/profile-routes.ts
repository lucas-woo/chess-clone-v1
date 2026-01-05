import { Router } from "express";
import { protectedroute } from "../middleware/auth-validators.ts";
import { getProfilePictures, selectProfilePicture } from "../handlers/profile-routes.ts";
const router = Router();

router.get("/photos", protectedroute ,getProfilePictures)

router.post("/change-photo", protectedroute, selectProfilePicture)

export default router;