import * as authService from "./auth.service.js";
import ApiResponse from "../../common/utils/api-response.js";

const register = async (req, res) => {
    const user = await authService.register(req.body);
    ApiResponse.created(res, "User created successfully", user);
};

const login = async (req, res) => {
    const { user, accessToken, refreshToken } = await authService.register(req.body);

    res.cockie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60  //1hr min
    })
    res.cockie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 //7day
    })
    ApiResponse.ok(res, "User created successfully", { user, accessToken, refreshToken });
};

const logout = async (req, res) => {
    await authService.logout(req.user.id);
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    ApiResponse.ok(res, "User logged out successfully");
};

const getMe = async (req, res) => {
    const user = await authService.getMe(req.user.id);
    ApiResponse.ok(res, "User fetched successfully", { user, accessToken, refreshToken });
};

const refresh = async (req, res) => {
    const { user, accessToken, refreshToken } = await authService.refresh(req.body);

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60
    });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
    });
    ApiResponse.ok(res, "Token refreshed successfully", { user, accessToken, refreshToken });

};

const varifyEmail = async (req, res) => {
    const user = await authService.varifyEmail(req.params.token);
    ApiResponse.ok(res, "Email verified successfully", user);
};

const forgotPassword = async (req, res) => {
    await authService.forgotPassword(req.body.email);
    ApiResponse.ok(res, "Password reset email sent");
};

const resetPassword = async (req, res) => {
    await authService.resetPassword(req.params.token, req.body.password);
    ApiResponse.ok(res, "Password reset successful");
};

export { register, login, logout, getMe, refresh, varifyEmail, forgotPassword, resetPassword };

