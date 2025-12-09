const role = (...allowedRoles) => {
  return (req, res, next) => {
    // Auth middleware must run BEFORE this
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Unauthorized - No user role" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied. Not allowed!" });
    }

    next();
  };
};

export default role;
