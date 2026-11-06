

require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./product"); 

async function updatePrices() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    
    const accessoires = await Product.find({ category: "Accessoires" });
    for (const p of accessoires) {
      const newPrice = Math.round(p.price * 0.85 * 100) / 100;
      await Product.updateOne({ _id: p._id }, { price: newPrice });
    }
    console.log(`✅ ${accessoires.length} accessoires mis à jour (-15%)`);

    const expensive = await Product.find({ price: { $gt: 200 } });
    for (const p of expensive) {
      const newPrice = Math.round(p.price * 0.9 * 100) / 100;
      await Product.updateOne({ _id: p._id }, { price: newPrice });
    }
    console.log(`✅ ${expensive.length} produits chers mis à jour (-10%)`);

    console.log("🎉 Terminé !");
    process.exit(0);
  } catch (err) {
    console.error("❌ Erreur:", err);
    process.exit(1);
  }
}

updatePrices();
