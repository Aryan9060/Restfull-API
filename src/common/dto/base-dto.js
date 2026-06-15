import Joi from "joi";

class BaseDto {
    static schema = Joi.object({});

    static validate(data) {
        const { errors, values } = this.schema.validate(data, {
            abortEarly: false,
            // allowUnknown: true,
            stripUnknown: true
        })

        if (errors) {
            const errors = errors.details.map(d => d.message)
            return { errors, value: null };
        }
        return { error: null, values };
    }
}

export default BaseDto;