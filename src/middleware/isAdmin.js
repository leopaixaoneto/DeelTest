const isAdmin = async (req, res, next) => {
  if (!req.profile) return res.status(401).end();
  if (req.profile.type !== "admin") return res.status(401).end();

  next();
};

module.exports = { isAdmin };
