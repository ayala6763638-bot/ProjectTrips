import Joi from 'joi';
import { isValidId } from '../../scool-trip-ui/my-school-app/src/Utlis/CalculatingAndValidet.js';

const Validation = Joi.object({
    firstName: Joi.string().min(2).max(30).required().messages({
        'string.min': 'first name must contain at least 2 charcters ',
        'string.empty': 'first name is required'
    }),
    lastName: Joi.string().min(2).max(30).required().messages({
        'string.min': 'last name must contain at least 2 charcters ',
        'string.empty': 'last name is required'
    }),
    id: Joi.string().required().custom((value, helpers) => {
        const clean = String(value).replace(/\D/g, '');
        if (!isValidId(clean))
            return helpers.error('any.invalid');
        return value;
    }).messages({
        'any.invalid': 'please enter a valid  ID (checksum failed)', 'string.empty': 'id is required'
    }),
    className: Joi.string().optional(),
    lastLocation: Joi.object({
        coordinates: Joi.object({
            longitude: Joi.object({
                degrees: Joi.string().pattern(/^\d+$/).required(),
                minutes: Joi.string().pattern(/^\d+$/).required(),
                seconds: Joi.string().pattern(/^\d+$/).required(),
            }),
            latitude: Joi.object({
                degrees: Joi.string().pattern(/^\d+$/).required(),
                minutes: Joi.string().pattern(/^\d+$/).required(),
                seconds: Joi.string().pattern(/^\d+$/).required(),
            }),
        }),
        time: Joi.date().iso().optional()
    })
}).unknown(true);
export default Validation;
