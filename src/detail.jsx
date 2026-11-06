import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext.jsx";

export default function Detail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const product = location.state?.product;

  const formatPrice = (n) =>
    `${new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(n)} DT`;

  if (!product) {
    return (
      <div style={styles.page}>
        <h1>Produit introuvable</h1>

        <button onClick={() => navigate("/")}>
          Retour à la boutique
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div style={styles.page}>

      <header style={styles.header}>
        <button
          onClick={() => navigate("/")}
          style={styles.backBtn}
        >
          ← Retour
        </button>

        <div style={styles.logo}>bimboo</div>

        <button
          onClick={() => navigate("/panier")}
          style={styles.cartBtn}
        >
          👜 Panier
        </button>
      </header>

      <main style={styles.container}>

        <div style={styles.imageContainer}>
          <img
            src={product.image}
            alt={product.title}
            style={styles.image}
          />

          <div style={styles.badge}>
            {product.badge}
          </div>
        </div>

        <div style={styles.info}>

          <p style={styles.brand}>
            {product.brand}
          </p>

          <h1 style={styles.title}>
            {product.title}
          </h1>

          <p style={styles.price}>
            {formatPrice(product.price)}
          </p>

          <div style={styles.line}></div>

          <p style={styles.category}>
            Catégorie : <strong>{product.category}</strong>
          </p>

          <button style={styles.addBtn} onClick={handleAddToCart}>
            {added ? "✓ Ajouté !" : "Ajouter au panier"}
          </button>

        </div>

      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#faf8f6",
    color: "#111",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
  },

  header: {
    height: 90,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 50px",
    background: "white",
    borderBottom: "1px solid #eee",
  },

  logo: {
    fontSize: 30,
    fontWeight: 900,
  },

  backBtn: {
    border: "1px solid #ddd",
    background: "white",
    borderRadius: 999,
    padding: "12px 22px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 15,
  },

  cartBtn: {
    border: "1px solid #ddd",
    background: "white",
    borderRadius: 999,
    padding: "12px 22px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 15,
  },

  container: {
    maxWidth: 1350,
    margin: "60px auto",
    padding: "0 30px",
    display: "grid",
    gridTemplateColumns: "1.1fr 1fr",
    gap: 70,
    alignItems: "center",
  },

  imageContainer: {
    position: "relative",
    height: 700,
    background: "#f2f2f2",
    borderRadius: 22,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  badge: {
    position: "absolute",
    top: 18,
    left: 18,
    background: "#111",
    color: "white",
    padding: "9px 16px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 900,
  },

  info: {
    padding: 25,
  },

  brand: {
    fontSize: 18,
    fontWeight: 800,
    color: "#777",
  },

  title: {
    fontSize: 48,
    margin: "14px 0 26px",
    lineHeight: 1.2,
  },

  price: {
    fontSize: 32,
    fontWeight: 900,
  },

  line: {
    height: 1,
    background: "#ddd",
    margin: "30px 0",
  },

  category: {
    fontSize: 18,
    color: "#555",
  },

  addBtn: {
    marginTop: 30,
    width: "100%",
    padding: "20px",
    border: "none",
    borderRadius: 999,
    background: "#111",
    color: "white",
    fontWeight: 900,
    fontSize: 17,
    cursor: "pointer",
  },
};
