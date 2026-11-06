const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    customer: {
      fullName: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      notes: { type: String, default: "" },
    },
    items: [
      {
        productId: Number,
        title: String,
        image: String,
        price: Number,
        quantity: Number,
      },
    ],
    total: { type: Number, required: true },
    status: { type: String, enum: ["en_attente", "validee"], default: "en_attente" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);