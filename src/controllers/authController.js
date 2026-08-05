const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sequelize, Utilisateur, Client, Commercant, Administrateur } = require('../models');

function generateToken(utilisateur) {
  return jwt.sign(
    { id: utilisateur.id, role: utilisateur.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

/**
 * Simule l'envoi d'un email de confirmation (BF-01).
 * À remplacer par un vrai appel SendGrid en Sprint ultérieur.
 */
function sendConfirmationEmail(email) {
  console.log(`[EMAIL SIMULÉ] Confirmation envoyée à ${email}`);
}

/**
 * POST /api/auth/register
 * US_Sprint0_1 : inscription (client ou commerçant uniquement — l'admin est créé via seed)
 */
async function register(req, res) {
  const { email, password, role } = req.body;

  if (!['client', 'commercant'].includes(role)) {
    return res.status(400).json({
      message: "Le rôle doit être 'client' ou 'commercant'.",
    });
  }

  const t = await sequelize.transaction();
  try {
    const existant = await Utilisateur.findOne({ where: { email }, transaction: t });
    if (existant) {
      await t.rollback();
      return res.status(409).json({ message: 'Un compte existe déjà avec cet email.' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    // Un commerçant est actif par défaut dès l'inscription (cf. spécification)
    const utilisateur = await Utilisateur.create(
      { email, password_hash, role, active: true },
      { transaction: t }
    );

    if (role === 'client') {
      await Client.create({ utilisateur_id: utilisateur.id }, { transaction: t });
    } else if (role === 'commercant') {
      await Commercant.create({ utilisateur_id: utilisateur.id }, { transaction: t });
    }

    await t.commit();

    sendConfirmationEmail(utilisateur.email);

    const token = generateToken(utilisateur);
    return res.status(201).json({
      message: 'Compte créé avec succès.',
      token,
      user: { id: utilisateur.id, email: utilisateur.email, role: utilisateur.role },
    });
  } catch (err) {
    await t.rollback();
    console.error(err);
    return res.status(500).json({ message: "Erreur lors de la création du compte." });
  }
}

/**
 * POST /api/auth/login
 */
async function login(req, res) {
  const { email, password } = req.body;

  try {
    const utilisateur = await Utilisateur.findOne({ where: { email } });
    if (!utilisateur) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    const motDePasseValide = await bcrypt.compare(password, utilisateur.password_hash);
    if (!motDePasseValide) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    if (!utilisateur.active) {
      return res.status(403).json({ message: 'Ce compte a été suspendu. Contactez un administrateur.' });
    }

    const token = generateToken(utilisateur);
    return res.status(200).json({
      message: 'Connexion réussie.',
      token,
      user: { id: utilisateur.id, email: utilisateur.email, role: utilisateur.role },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur lors de la connexion.' });
  }
}

/**
 * GET /api/auth/me
 * Route protégée — retourne le profil de l'utilisateur connecté + son rôle (getRole()).
 */
async function me(req, res) {
  try {
    const utilisateur = await Utilisateur.findByPk(req.user.id, {
      attributes: ['id', 'email', 'role', 'active', 'created_at'],
    });
    return res.status(200).json({ user: utilisateur });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur lors de la récupération du profil.' });
  }
}

module.exports = { register, login, me };
