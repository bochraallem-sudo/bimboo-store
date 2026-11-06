require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./product");


const INITIAL_STOCK = {
  Robe: 10,
  Sacs: 15,
  Bijoux: 20,
  Haut: 15,
  Accessoires: 25,
};

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { family: 4 });
    console.log("✅ Connected to MongoDB");

    for (const [category, stock] of Object.entries(INITIAL_STOCK)) {
      const r = await Product.updateMany(
        { category, stock: { $exists: false } },
        { $set: { stock } }
      );
      console.log(`✅ ${category} : ${r.modifiedCount} produit(s) → stock ${stock}`);
    }

    console.log("🎉 Terminé !");
    process.exit(0);
  } catch (err) {
    console.error("❌ Erreur:", err);
    process.exit(1);
  }
}

run();