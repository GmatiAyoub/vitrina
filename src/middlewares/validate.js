const { validationResult } = require('express-validator');

/**
 * À placer après un tableau de règles express-validator dans une route.
 * Retourne une 400 avec la liste des erreurs si la validation échoue.
 */
function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Données invalides.',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}

module.exports = { handleValidation };
