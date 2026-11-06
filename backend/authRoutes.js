const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("./User");

const router = express.Router();

const getSecret = () => process.env.JWT_SECRET || "bimboo_secret_dev_key";

const publicUser = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  phone: u.phone,
  role: u.role,
  points: u.points,
  photo: u.photo,
});

const signToken = (user) =>
  jwt.sign({ userId: user._id, role: user.role }, getSecret(), { expiresIn: "30d" });

function authMiddleware(req, res, next) {
  const h = req.headers.authorization;
  if (!h || !h.startsWith("Bearer ")) return res.status(401).json({ error: "Non authentifié" });
  try {
    const decoded = jwt.verify(h.split(" ")[1], getSecret());
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch {
    return res.status(401).json({ error: "Token invalide ou expiré" });
  }
}

function requireAdmin(req, res, next) {
  if (req.role !== "admin") return res.status(403).json({ error: "Accès réservé à l'administrateur" });
  next();
}

router.post("/signup", async (req, res) => {
  try {
    const { name, email, phone, password, isAdmin, adminCode } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    let role = "client";
    if (isAdmin) {
      if (!process.env.ADMIN_CODE || adminCode !== process.env.ADMIN_CODE) {
        return res.status(403).json({ error: "Code administrateur incorrect" });
      }
      role = "admin";
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ error: "Un compte existe déjà avec cet email" });

    const user = await User.create({ name, email, phone, password, role, points: role === "admin" ? 0 : 50 });
    res.status(201).json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password, isAdmin, adminCode } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email et mot de passe requis" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    if (isAdmin) {
      if (user.role !== "admin" || !process.env.ADMIN_CODE || adminCode !== process.env.ADMIN_CODE) {
        return res.status(403).json({ error: "Code administrateur incorrect" });
      }
    }

    res.json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "Utilisateur introuvable" });
    res.json({ user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/password", authMiddleware, async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 4) return res.status(400).json({ error: "Mot de passe trop court" });
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "Utilisateur introuvable" });
    user.password = newPassword;
    await user.save();
    res.json({ message: "Mot de passe mis à jour" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
module.exports.authMiddleware = authMiddleware;
module.exports.requireAdmin = requireAdmin;