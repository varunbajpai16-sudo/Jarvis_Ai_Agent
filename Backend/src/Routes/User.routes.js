import {Router} from "express"
import {handleAuth} from "../controllers/HandelAuth.controller.js"
import {checkJwt } from "../middlewares/auth.middlewares.js"
const router = Router()

router.get("/Auth", checkJwt, handleAuth);

export default router;