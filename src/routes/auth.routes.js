import { Router } from "express";
import authController from "../controllers/auth.controller.js";


const router = Router()

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/logout', authController.logout);


export default router;