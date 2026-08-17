/**
 * Supprime les espaces, tabulations et retours à la ligne en début/fin
 * de chaque champ texte de req.body (JSON ou form-data).
 * Appliqué globalement pour éviter les oublis (copier-coller depuis un
 * tableau, une app mobile, etc. qui laissent des \t ou espaces parasites).
 */
function trimBody(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    for (const key of Object.keys(req.body)) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    }
  }
  next();
}

module.exports = trimBody;