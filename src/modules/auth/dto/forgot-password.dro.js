import Joi from "joi";
import BaseDto from "../../../common/dto/base-dto.js";



class forgotPasswordDto extends BaseDto {
    static schema = Joi.object({
        password: Joi.string().trim().min(8).max(100).pattern(/(?=.*[A-Z])(?=.*\d)/).message(
            "Password must contain at least one uppercase letter and one digit",
        ).required(),
        confirmPassword: Joi.string().trim().min(8).max(100).required()
    })
}

export default forgotPasswordDto;