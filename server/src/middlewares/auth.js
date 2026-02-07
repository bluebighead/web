const authMiddleware = (req, res, next) => {
  next();
};

module.exports = { protect: authMiddleware };
