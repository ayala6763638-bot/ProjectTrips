import Joi from 'joi';
import baseValidiationSchema from './Validation.js';

const studentValidation=baseValidiationSchema.append({
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
});

export default studentValidation;