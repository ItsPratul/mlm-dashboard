const flashMiddleware = (req, res, next) => {
  res.locals.successMessage = req.flash("success")[0] || null;
  res.locals.errorMessage = req.flash("error")[0] || null;
  res.locals.warningMessage = req.flash("warning")[0] || null;
  res.locals.infoMessage = req.flash("info")[0] || null;
  next();
};

module.exports = flashMiddleware;
