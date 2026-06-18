import User from "../src\modules\auth\auth.schema.js";
import ApiError from "../common/utils/api-error.js";
import { varifiAccessToken } from "../../common/utils/jwt-utils";

const authenticate = async (req, res, next) => {

    let token;
    if (req.headers.authorization?.startsWith("Bearer")) token = req.headers.authorization.split(" ")[1];

    if (req.cookies.token) token = req.cookies.token;

    if (!token) throw ApiError.unauthorized("Token is required");

    const varifiedToken = varifiAccessToken(token);

    const user = await User.findById(varifiedToken.id)
    if (!user) throw ApiError.unauthorized("User not found");

    req.user = {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
    }
    next();
}

const authorize = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        throw ApiError.unauthorized("You are not authorized to access this route");
    }
    next();
}

export { authenticate, authorize };