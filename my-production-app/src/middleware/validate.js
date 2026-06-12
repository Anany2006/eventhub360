const ApiError = require('../utils/ApiError');

const validate = (schema) => (req, res, next) => {
    const { value, error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        // Collect all error descriptions into a string
        const errorMessage = error.details.map((details) => details.message).join(', ');
        return next(new ApiError(422, errorMessage)); // 422 Unprocessable Entity 
    }
    
    req.body = value; // Assign parsed/sanitized variables back to request body
    next();
};

module.exports = validate;