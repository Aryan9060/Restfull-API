import Joi from "joi";
import BaseDto from "../../../common/dto/base-dto.js";

class LoginDto extends BaseDto{

    static schema = Joi.object({
        email: Joi.string().email().trim().lowercase().required(),
        password: Joi.string().trim().min(8).max(100).required()
    
    })
    
}


export default LoginDto;