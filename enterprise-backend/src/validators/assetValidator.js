const Joi = require('joi');

const validateAsset = (req, res, next) => {
  const schema = Joi.object({
    asset_code: Joi.string().min(3).max(50).required(),
    asset_name: Joi.string().min(3).max(200).required(),
    asset_type: Joi.string().min(2).max(100).required(),
    purchase_date: Joi.date().required(),
    purchase_cost: Joi.number().positive().required(), 
    status: Joi.string().valid('Available', 'Allocated', 'Returned', 'Damaged', 'Lost').default('Available')
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      details: error.details[0].message
    });
  }
  next();
};

module.exports = { validateAsset };