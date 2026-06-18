import { Router } from "express";
import validate from "../../common/middleware/validate.middleware";
import RegisterDto from "./dto/register.dto.js";
import * as authController from "./auth.controller";
import { authenticate } from "./auth.middleware.js";

const router = Router();

router.post('/register', validate(RegisterDto), authController.register);

router.post('/login', authController.login);
router.get("/me",authenticate, authController.getMe)

router.post('/refresh', authController.refresh);

router.post('/logout', authController.logout);

export default router;