import validate from "../../common/middleware/validate.middleware.js";
import ForgotPasswordDto from "../auth/dto/forgot-password.dro.js";
import ResetPasswordDto from "../auth/dto/reset-password.dto.js";
import RegisterDto from "./dto/register.dto.js";
import * as authController from "./auth.controller.js";
import { authenticate } from "./auth.middleware.js";
import LoginDto from "./dto/login.dto.js";
import { Router } from "express";

const router = Router();

router.route('/register').post(validate(RegisterDto), authController.register);
router.route('/login').post( validate(LoginDto), authController.login);
router.route('/me').get( authenticate, authController.getMe)
router.route('/refresh-token').post( authController.refresh);
router.route('/logout').post( authenticate, authController.logout);
router.route("/verify-email/:token").get( authController.varifyEmail);
router.route("/forgot-password").post( validate(ForgotPasswordDto), authController.forgotPassword);
router.route("/reset-password/:token").put( validate(ResetPasswordDto), authController.resetPassword);

export default router;