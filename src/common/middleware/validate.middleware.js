import ApiError from "../utils/api-error.js";
import BaseDto from "../dto/base-dto.js";
 

const validate = (Dtoclass) => {
    return (req, res, next)=> {
        const { errors, value } = Dtoclass.validate(req.body);

        if(errors){
            throw ApiError.badRequest(errors.join(";"));
        }

        req.body = value;
        next();
    }
}

export default validate;
