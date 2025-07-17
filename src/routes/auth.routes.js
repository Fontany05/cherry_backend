import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import { verifyRefreshToken } from "../middlewares/authJwt.js";



const router = Router()

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/logout', authController.logout);
router.post('/refresh', verifyRefreshToken, authController.refresh);


export default router;