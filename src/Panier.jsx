import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext.jsx";

export default function Panier() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } =
    useCart();

  const formatPrice = (n) =>
    `${new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(n)} DT`;

  const handleCheckout = () => {
    navigate("/commande", { state: { cart, totalPrice } });
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <button onClick={() => navigate("/")} style={styles.backBtn}>
          ← Retour à la boutique
        </button>
        <div style={styles.logo}>bimboo</div>
        <div style={{ width: 200 }} />
      </header>

      <main style={styles.container}>
        <h1 style={styles.title}>Mon Panier</h1>

        {cart.length === 0 ? (
          <div style={styles.emptyBox}>
            <p style={styles.emptyText}>Votre panier est vide.</p>
            <button style={styles.shopBtn} onClick={() => navigate("/")}>
              Continuer mes achats
            </button>
          </div>
        ) : (
          <>
            <div style={styles.list}>
              {cart.map((item) => (
                <div key={item.id} style={styles.item}>
                  <img src={item.image} alt={item.title} style={styles.itemImg} />

                  <div style={styles.itemInfo}>
                    <p style={styles.itemBrand}>{item.brand}</p>
                    <h3 style={styles.itemTitle}>{item.title}</h3>
                    <p style={styles.itemCategory}>{item.category}</p>
                  </div>

                  <div style={styles.qtyWrap}>
                    <button
                      style={styles.qtyBtn}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span style={styles.qtyValue}>{item.quantity}</span>
                    <button
                      style={styles.qtyBtn}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <p style={styles.itemPrice}>
                    {formatPrice(item.price * item.quantity)}
                  </p>

                  <button
                    style={styles.removeBtn}
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Supprimer"
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>

            <div style={styles.summary}>
              <button style={styles.clearBtn} onClick={clearCart}>
                Vider le panier
              </button>

              <div style={styles.totalBox}>
                <span style={styles.totalLabel}>Total</span>
                <span style={styles.totalValue}>{formatPrice(totalPrice)}</span>
              </div>

              <button style={styles.checkoutBtn} onClick={handleCheckout}>
                Passer la commande
              </button>
            </div>
          </>
        )}
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

  logo: { fontSize: 30, fontWeight: 900 },

  backBtn: {
    border: "1px solid #ddd",
    background: "white",
    borderRadius: 999,
    padding: "12px 22px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 15,
  },

  container: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "60px 30px",
  },

  title: { fontSize: 44, fontWeight: 900, marginBottom: 40 },

  emptyBox: {
    textAlign: "center",
    padding: "80px 30px",
    background: "white",
    borderRadius: 18,
    border: "1px solid rgba(0,0,0,0.06)",
  },
  emptyText: { fontSize: 20, color: "#666", marginBottom: 26 },
  shopBtn: {
    background: "#111",
    color: "white",
    border: "none",
    borderRadius: 999,
    padding: "16px 28px",
    fontWeight: 800,
    fontSize: 15,
    cursor: "pointer",
  },

  list: { display: "flex", flexDirection: "column", gap: 18 },

  item: {
    display: "flex",
    alignItems: "center",
    gap: 22,
    background: "white",
    borderRadius: 18,
    padding: 20,
    border: "1px solid rgba(0,0,0,0.06)",
  },

  itemImg: {
    width: 140,
    height: 140,
    objectFit: "cover",
    borderRadius: 14,
    background: "#f2f2f2",
    flexShrink: 0,
  },

  itemInfo: { flex: 1, minWidth: 0 },
  itemBrand: { fontSize: 14, fontWeight: 800, color: "#888", margin: 0 },
  itemTitle: { fontSize: 20, fontWeight: 900, margin: "6px 0" },
  itemCategory: { fontSize: 14, color: "#999", margin: 0 },

  qtyWrap: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    border: "1px solid #ddd",
    borderRadius: 999,
    padding: "6px 12px",
  },
  qtyBtn: {
    border: "none",
    background: "transparent",
    fontSize: 20,
    fontWeight: 900,
    cursor: "pointer",
    width: 30,
    height: 30,
  },
  qtyValue: { fontWeight: 800, minWidth: 20, textAlign: "center", fontSize: 16 },

  itemPrice: { fontWeight: 900, fontSize: 19, width: 130, textAlign: "right", margin: 0 },

  removeBtn: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: 22,
    opacity: 0.6,
  },

  summary: {
    marginTop: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 20,
    background: "white",
    borderRadius: 18,
    padding: 28,
    border: "1px solid rgba(0,0,0,0.06)",
  },

  clearBtn: {
    border: "1px solid #ddd",
    background: "white",
    borderRadius: 999,
    padding: "12px 20px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 15,
    color: "#666",
  },

  totalBox: { display: "flex", flexDirection: "column", alignItems: "flex-end" },
  totalLabel: { fontSize: 14, color: "#888", fontWeight: 700 },
  totalValue: { fontSize: 30, fontWeight: 900 },

  checkoutBtn: {
    background: "#111",
    color: "white",
    border: "none",
    borderRadius: 999,
    padding: "18px 32px",
    fontWeight: 900,
    fontSize: 17,
    cursor: "pointer",
  },
};
