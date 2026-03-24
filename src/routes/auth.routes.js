import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import { verifyRefreshToken, verifyToken } from "../middlewares/authJwt.js";
import { validateSignin, validateSignup} from "../middlewares/validators/auth.validator.js";


const router = Router()

router.post('/signup', validateSignup, authController.signup);
router.post('/signin', validateSignin, authController.signin);
router.post('/logout', authController.logout);
router.post('/refresh', verifyRefreshToken, authController.refresh);
router.get('/me', verifyToken, authController.me);


export default router;