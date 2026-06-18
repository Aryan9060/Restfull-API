import joi from "joi";
import BaseDto from "../../../common/dto/base-dto.js";

class RegisterDto extends BaseDto {
    static schema = joi.object({
        name: joi.string().trim().min(2).max(50).required(),
        email: joi.string().email().trim().lowercase().required(),
        password: joi.string().trim().min(8).max(100).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        ).required(),
        role: joi.string().valid("admin", "user").default("user")
    })
}


export default RegisterDto;