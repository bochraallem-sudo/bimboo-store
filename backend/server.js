const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Product = require("./product");
const authRoutes = require("./authRoutes");
const { authMiddleware, requireAdmin } = require("./authRoutes");
const orderRoutes = require("./orderRoutes");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

mongoose
	.connect(process.env.MONGO_URI, { family: 4 })
	.then(() => {
		console.log("MongoDB connected successfully");
		app.listen(PORT, () => {
			console.log(`Server running on http://localhost:${PORT}`);
		});
	})
	.catch((error) => {
		console.error("MongoDB connection error:", error);
	});

app.get("/", (req, res) => {
	res.json({ message: "Backend yekhdem !" });
});

app.get("/api/products", async (req, res) => {
	try {
		const products = await Product.find();
		res.json(products);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

app.patch("/api/products/:id/stock", authMiddleware, requireAdmin, async (req, res) => {
	try {
		const stock = parseInt(req.body.stock);
		if (isNaN(stock) || stock < 0) return res.status(400).json({ error: "Stock invalide" });
		const product = await Product.findOneAndUpdate({ id: Number(req.params.id) }, { $set: { stock } }, { new: true });
		if (!product) return res.status(404).json({ error: "Produit introuvable" });
		res.json({ product });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});
