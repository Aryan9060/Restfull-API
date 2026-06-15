import joi from "joi";
import BaseDto from "../../../common/dto/base-dto.js";

class RegisterDto extends BaseDto {
    static schema = joi.object({
        name: Joi.string().trim().min(2).max(50).required(),
        email: Joi.string().email().trim().lowercase().required(),
        password: Joi.string().trim().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        ).required(),
        role: Joi.string().valid("admin", "user").default("user")
    })
}


export default RegisterDto;