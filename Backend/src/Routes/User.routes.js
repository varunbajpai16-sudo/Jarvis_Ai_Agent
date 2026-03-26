import {Router} from "express"
import {RegisterUser} from "../controllers/HandelAuth.controller.js"
import {checkJwt } from "../middlewares/auth.middlewares.js"
const router = Router()

router.post("/register", checkJwt, RegisterUser);

export default router;