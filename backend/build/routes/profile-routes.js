import { Router } from "express";
import { protectedroute } from "../middleware/auth-validators.js";
import { getProfilePictures, selectProfilePicture } from "../handlers/profile-routes.js";
const router = Router();
router.get("/photos", protectedroute, getProfilePictures);
router.post("/change-photo", protectedroute, selectProfilePicture);
export default router;
