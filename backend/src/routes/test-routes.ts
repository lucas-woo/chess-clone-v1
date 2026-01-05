import { Router } from "express";
import { testReqUser } from "../handlers/test-routes.ts";

//we gotta change any routes that is only updating req.user and not in the db itself

const router = Router()

router.get("/", testReqUser) 

export default router