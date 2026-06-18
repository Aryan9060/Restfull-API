import { sendResetPasswordEmail } from "../../common/config/email.js";
import ApiError from "../../common/utils/api-error.js";
import { generateAccessToken, generateToken, varifiRefreshToken } from "../../common/utils/jwt-utils.js";
import User from "./auth.schema.js";


const hashToken = async token => crypto.createHash("sha256").update(token).digest("hex");

const register = async ({ name, email, password, role }) => {
    const exsist = await User.findOne({ email });
    if (exsist) throw ApiError.conflict("User already exists");

    const { rowToken, hashedToken } = generateToken();
    const user = await User.create({
        name,
        email,
        password,
        role,
        varificationToken: hashedToken
    })

    //TODO send an email to user with token : rowToken

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.varificationToken;

    return userObj;
}

const login = async ({ email, password }) => {
    //* take email and find user in DB
    const user = await User.findOne({ email }).select('+password');
    if (!user) throw ApiError.unauthorized("Invalid email or password");

    //* then chaeck the password is correct 
    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw ApiError.unauthorized("Invalid email or password");


    //* check if varified or not 
    if (!user.isVerified) throw ApiError.forbidden("User is not verified");

    //* generate Tokens
    const accessToken = generateAccessToken({ id: user._id, email: user.email, role: user.role });
    const refreshToken = generatRefreshToken({ id: user._id });

    //* hashed refreshToken
    user.refreshToken = hashToken(refreshToken);
    await user.save({ validateBeforeSave: false });

    //* remove some fields from the user data
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;

    //* return user and tokens
    return { user: userObj, accessToken, refreshToken };
}

const logout = async (userId) => {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
}

const getMe = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw ApiError.notFound("User not found");
    return user;
}

const refresh = async ({ token }) => {

    //! check token recieve or nor 
    if (!token) throw ApiError.unauthorized("Token is required");

    //* varifi refresh token
    const varifiedToken = varifiRefreshToken(token);
    if (!varifiedToken) throw ApiError.unauthorized("Invalid token");

    //* find user 
    const user = await User.findById(varifiedToken.id).$elect('+refreshToken');
    if (!user) throw ApiError.unauthorized("User not found");

    //! check refreshtoken is valid or not
    const hashedToken = await hashToken(token);
    if (user.refreshToken !== hashedToken) throw ApiError.unauthorized("Invalid refresh token");

    //* generate new tokens
    const accessToken = generateAccessToken({ id: user._id, email: user.email, role: user.role });
    const refreshToken = generatRefreshToken({ id: user._id });

    await User.updateOne({ refreshToken: hashToken(refreshToken) });

    //* remove some fields from the user data
    const userObj = toObject(user);
    delete userObj.password;
    delete userObj.refreshToken;

    return { user: userObj, accessToken, refreshToken };
}

const varifyEmail = async (token) => {
    const trimmedToken = String(token).trim();
    if (!trimmedToken) throw ApiError.badRequest("Invalid or expired varification token");

    const hashedInput = hashToken(trimmedToken);
    let user = await User.findOne({ verificationToken: hashedInput }).select(
        "+verificationToken",
    );
    if (!user) {
        user = await User.findOne({ verificationToken: trimmedToken }).select(
            "+verificationToken",
        );
    }
    if (!user) throw ApiError.badRequest("Invalid or expired verification token");

    await User.findByIdAndUpdate(user._id, {
        $set: { isVerified: true },
        $unset: { verificationToken: 1 },
    });

    return user;

}

const forgotPassword = async (email) => {
    const user = await User.findOne({ email })
    if (!user) throw ApiError.notFound("User not found");

    const { rowToken, hashedToken } = generateToken();
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 15; // 15 min

    await user.save();

    //TODO send an email to user with token : rowToken
    await sendResetPasswordEmail(email, rowToken);
}

const resetPassword = async ({ token, newPassword }) => {
    const hashedToken = await hashToken(token);
    const user = await User.findOne({ resetPasswordToken: hashedToken, resetPasswordExpires: { $gt: Date.now() } }).select('+resetPasswordToken', '+resetPasswordExpires');

    if (!user) throw ApiError.unauthorized("Invalid or expired reset token");

    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();
}

export { register, login, logout, getMe, refresh, varifyEmail, forgotPassword, resetPassword };