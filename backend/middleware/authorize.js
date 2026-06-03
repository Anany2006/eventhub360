// Middleware to restrict access based on user roles
const authorize = (allowedRoles) => {
  return (req, res, next) => {
    // Check if user data exists (attached from your previous auth middleware)
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Unauthorized: Missing identity details" });
    }

    // Check if the user's role is included in the permitted list
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: You do not have permission to view this resource" }); //
    }

    next(); // User has permission, continue to the endpoint!
  };
};

module.exports = authorize;