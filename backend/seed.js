require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('./product'); 

const products = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'product.json'), 'utf-8')
);

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    console.log('📂 Database name:', mongoose.connection.name);

    const deleted = await Product.deleteMany({});
    console.log('🗑️ Deleted:', deleted.deletedCount);

    const inserted = await Product.insertMany(products);
    console.log(`✅ ${inserted.length} produits insérés avec succès`);


    const count = await Product.countDocuments();
    console.log('📊 Total documents now:', count);

    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur:', err);
    process.exit(1);
  }
}

seedDB();