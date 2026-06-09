const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from the request header
  const token = req.header('Authorization');

  // Check if no token is provided
  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied.' });
  }

  try {
    // Tokens are usually sent as "Bearer <token>". Let's clean it up if needed.
    let cleanToken = token;
    if (token.startsWith('Bearer ')) {
      cleanToken = token.slice(7, token.length).trimLeft();
    }

    // Verify token matches our secret key [cite: 72]
    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
    
    // Attach the user information payload to the request object
    req.user = decoded;
    next(); // Pass control to the next route function
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid or has expired.' });
  }
};