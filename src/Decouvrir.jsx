import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext.jsx";

export default function Decouvrir() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [index, setIndex] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Erreur:", err));
  }, []);

  const formatPrice = (n) =>
    `${new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(n)} DT`;

  const next = () => {
    setAdded(false);
    setIndex((i) => (i + 1) % products.length);
  };
  const prev = () => {
    setAdded(false);
    setIndex((i) => (i - 1 + products.length) % products.length);
  };

  const handleAdd = () => {
    if (!current) return;
    addToCart(current);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const current = products[index];

  if (products.length === 0) {
    return (
      <div style={styles.page}>
        <p style={styles.loading}>Chargement de la vitrine...</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <button onClick={() => navigate("/")} style={styles.backBtn}>
          ← Retour à la boutique
        </button>
        <div style={styles.logo}>bimboo — Vitrine</div>
        <div style={{ width: 220 }} />
      </header>

      <main style={styles.stage}>
        <button style={styles.arrowBtn} onClick={prev} aria-label="Précédent">
          ‹
        </button>

        <div
          style={styles.card}
          onClick={() => navigate(`/detail/${current.id}`, { state: { product: current } })}
        >
          <div style={styles.badge}>{current.badge}</div>
          <img src={current.image} alt={current.title} style={styles.image} />

          <div style={styles.info}>
            <p style={styles.brand}>{current.brand}</p>
            <h2 style={styles.title}>{current.title}</h2>
            <p style={styles.price}>{formatPrice(current.price)}</p>

            <button
              style={styles.addBtn}
              onClick={(e) => {
                e.stopPropagation();
                handleAdd();
              }}
            >
              {added ? "✓ Ajouté au panier" : "Ajouter au panier"}
            </button>

            <p style={styles.hint}>Cliquez sur l'article pour voir tous les détails</p>
          </div>
        </div>

        <button style={styles.arrowBtn} onClick={next} aria-label="Suivant">
          ›
        </button>
      </main>

      <div style={styles.counter}>
        {index + 1} / {products.length}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#1a1512",
    color: "white",
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
    display: "flex",
    flexDirection: "column",
  },
  loading: { color: "white", textAlign: "center", padding: 60, fontSize: 18 },

  header: {
    height: 90,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 50px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  logo: { fontSize: 22, fontWeight: 900, fontFamily: "'Playfair Display', serif" },
  backBtn: {
    border: "1px solid rgba(255,255,255,0.3)",
    background: "transparent",
    color: "white",
    borderRadius: 999,
    padding: "12px 22px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 15,
  },

  stage: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
    padding: "40px 20px",
  },

  arrowBtn: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "white",
    width: 60,
    height: 60,
    borderRadius: "50%",
    fontSize: 30,
    cursor: "pointer",
    flexShrink: 0,
  },

  card: {
    background: "white",
    color: "#111",
    borderRadius: 24,
    overflow: "hidden",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    maxWidth: 900,
    width: "100%",
    cursor: "pointer",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 18,
    left: 18,
    background: "#111",
    color: "white",
    fontSize: 12,
    fontWeight: 900,
    padding: "8px 14px",
    borderRadius: 999,
  },
  image: { width: "100%", height: 480, objectFit: "cover" },

  info: { padding: 40, display: "flex", flexDirection: "column", justifyContent: "center" },
  brand: { fontSize: 14, fontWeight: 800, color: "#888", margin: 0 },
  title: { fontSize: 30, fontWeight: 900, margin: "10px 0 16px", fontFamily: "'Playfair Display', serif" },
  price: { fontSize: 24, fontWeight: 900, margin: "0 0 24px" },
  addBtn: {
    background: "#111",
    color: "white",
    border: "none",
    borderRadius: 999,
    padding: "16px 24px",
    fontWeight: 800,
    fontSize: 15,
    cursor: "pointer",
  },
  hint: { fontSize: 12, color: "#999", marginTop: 16 },

  counter: { textAlign: "center", paddingBottom: 30, opacity: 0.6, fontSize: 14 },
};
