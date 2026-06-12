const Joi = require('joi');

const createEmployeeSchema = Joi.object({
    email: Joi.string().email().required(),
    phone: Joi.string().min(10).max(15).required(),
    salary: Joi.number().positive().required(),
    hireDate: Joi.date().iso().required()
});

module.exports = { createEmployeeSchema };