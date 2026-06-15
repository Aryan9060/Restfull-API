import { Router } from "express";
import validate from "../../common/middleware/validate.middleware";
import RegisterDto from "./dto/register.dto.js";
import * as authController from "./auth.controller";

const router = Router();

router.post('/register', validate(RegisterDto), authController.register);

export default router;