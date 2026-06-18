import Joi from "joi";
import BaseDto from "../../../common/dto/base-dto.js";

class resetPasswordDto extends BaseDto {

    static schema = Joi.object({
        password: Joi.string().trim().min(8).max(100).pattern(/(?=.*[A-Z])(?=.*\d)/).message(
            "Password must contain at least one uppercase letter and one digit",
        ).required(),

    })
}

export default resetPasswordDto;