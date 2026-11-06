const express = require("express");
const jwt = require("jsonwebtoken");
const Order = require("./Order");
const User = require("./User");
const Product = require("./product");
const { authMiddleware, requireAdmin } = require("./authRoutes");

const router = express.Router();

const getSecret = () => process.env.JWT_SECRET || "bimboo_secret_dev_key";

function optionalAuth(req, res, next) {
  const h = req.headers.authorization;
  if (h && h.startsWith("Bearer ")) {
    try {
      req.userId = jwt.verify(h.split(" ")[1], getSecret()).userId;
    } catch {}
  }
  next();
}

router.post("/", optionalAuth, async (req, res) => {
  try {
    const { customer, items } = req.body;

    if (!customer || !customer.fullName || !customer.phone || !customer.address || !customer.city) {
      return res.status(400).json({ error: "Informations de livraison incomplètes" });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Le panier est vide" });
    }

    const cleanItems = [];
    for (const it of items) {
      const p = await Product.findOne({ id: it.productId });
      if (!p) continue;
      const qty = Math.max(1, parseInt(it.quantity) || 1);
      if ((p.stock ?? 0) < qty) {
        return res.status(400).json({
          error: `Stock insuffisant pour « ${p.title} » (disponible : ${p.stock ?? 0})`,
        });
      }
      cleanItems.push({
        productId: p.id,
        title: p.title,
        image: p.image,
        price: p.price,
        quantity: qty,
      });
    }
    if (cleanItems.length === 0) {
      return res.status(400).json({ error: "Produits introuvables" });
    }

    const total = cleanItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const order = await Order.create({
      user: req.userId || null,
      customer,
      items: cleanItems,
      total,
    });

    for (const i of cleanItems) {
      await Product.updateOne({ id: i.productId }, { $inc: { stock: -i.quantity } });
    }

    res.status(201).json({ order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate("user", "name email");
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:id/validate", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Commande introuvable" });

    if (order.status !== "validee") {
      order.status = "validee";
      await order.save();

      if (order.user) {
        await User.updateOne({ _id: order.user }, { $inc: { points: Math.floor(order.total) } });
      }
    }

    const populated = await order.populate("user", "name email");
    res.json({ order: populated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;