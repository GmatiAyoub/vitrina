const jwt = require('jsonwebtoken');
const { Utilisateur } = require('../models');

/**
 * Vérifie la présence et la validité du token JWT.
 * Attache req.user = { id, email, role } si valide.
 */
async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: 'Authentification requise. Token manquant.' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const utilisateur = await Utilisateur.findByPk(payload.id);
    if (!utilisateur) {
      return res.status(401).json({ message: 'Utilisateur introuvable.' });
    }
    if (!utilisateur.active) {
      return res.status(403).json({ message: 'Ce compte a été suspendu.' });
    }

    req.user = { id: utilisateur.id, email: utilisateur.email, role: utilisateur.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide ou expiré.' });
  }
}

/**
 * Restreint l'accès à une liste de rôles autorisés.
 * Usage: authorize('admin'), authorize('commercant', 'admin')
 */
function authorize(...rolesAutorises) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentification requise.' });
    }
    if (!rolesAutorises.includes(req.user.role)) {
      return res.status(403).json({ message: "Accès refusé : rôle insuffisant." });
    }
    next();
  };
}

module.exports = { authenticate, authorize };
