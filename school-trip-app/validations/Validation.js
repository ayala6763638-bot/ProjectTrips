import Joi from 'joi';

const Validation=Joi.object({
    firstName: Joi.string().min(2).max(30).required().messages({
      'string.min': 'first name must contain at least 2 charcters ',
       'string.empty': 'first name is required'
    }),
    lastName: Joi.string().min(2).max(30).required().messages({
        'string.min': 'last name must contain at least 2 charcters ',
        'string.empty': 'last name is required'
    }),
    id: Joi.string().pattern(/^\d{9}$/).required().messages({
        'string.pattern.base': 'please enter 9-digites for the ID',
    }),
    className: Joi.string().optional(),
}).unknown(true);
export default Validation;
