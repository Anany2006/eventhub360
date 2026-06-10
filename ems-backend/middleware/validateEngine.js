// middleware/validateEngine.js
const Joi = require('joi');

const validateWorkflowPayload = (req, res, next) => {
    const schema = Joi.object({
        leaveId: Joi.number().integer().positive().required(),
        approvedBy: Joi.number().integer().positive().required(),
        actionStatus: Joi.string().valid('Approved', 'Rejected').required(),
        remarks: Joi.string().max(500).allow('', null)
    });

    const { error } = schema.validate(req.body);
    
    if (error) {
        return res.status(400).json({ 
            error: 'Input Validation Rejected', 
            details: error.details[0].message 
        });
    }

    next();
};

module.exports = { validateWorkflowPayload };