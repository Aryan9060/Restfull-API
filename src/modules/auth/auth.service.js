import ApiError from "../../common/utils/api-error.js";
import User from "./auth.schema.js";

const register = async ({ name, email, password, role }) => {
    const exsist = await User.findOne({email});
    
    if(exsist) throw ApiError.conflict("User already exists");


    return userObj;
}

export { register };