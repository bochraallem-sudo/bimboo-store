import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "./CartContext.jsx";

export default function Commande() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart: cartFromContext, totalPrice: totalFromContext, clearCart } = useCart();

  const cart = location.state?.cart ?? cartFromContext;
  const totalPrice = location.state?.totalPrice ?? totalFromContext;

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const formatPrice = (n) =>
    `${new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(n)} DT`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!fullName.trim() || !phone.trim() || !address.trim() || !city.trim()) return;
    if (cart.length === 0) {
      setError("Votre panier est vide.");
      return;
    }

    setSending(true);
    try {
      const token = localStorage.getItem("bimboo_token");
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers,
        body: JSON.stringify({
          customer: { fullName, phone, address, city, notes },
          items: cart.map((i) => ({ productId: i.id, quantity: i.quantity })),
        }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {}

      if (!res.ok) {
        setError(data.error || `Erreur serveur (code ${res.status})`);
        setSending(false);
        return;
      }

      setConfirmed(true);
      clearCart();
    } catch {
      setError("Serveur injoignable : vérifiez que node server.js tourne.");
    }
    setSending(false);
  };

  if (confirmed) {
    return (
      <div style={styles.page}>
        <header style={styles.header}>
          <div style={styles.logo}>bimboo</div>
        </header>

        <main style={styles.confirmWrap}>
          <div style={styles.confirmIcon}>✓</div>
          <h1 style={styles.confirmTitle}>Merci pour votre commande !</h1>
          <p style={styles.confirmText}>
            Votre commande a bien été enregistrée. Notre équipe va vous <strong>contacter très
            prochainement par téléphone</strong> afin de confirmer les détails de votre commande
            et organiser la livraison.
          </p>
          <p style={styles.confirmSub}>
            Merci de rester joignable au numéro que vous avez indiqué.
          </p>

          <button style={styles.backHomeBtn} onClick={() => navigate("/")}>
            Retour à la boutique
          </button>
        </main>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <button onClick={() => navigate("/panier")} style={styles.backBtn}>
          ← Retour au panier
        </button>
        <div style={styles.logo}>bimboo</div>
        <div style={{ width: 220 }} />
      </header>

      <main style={styles.container}>
        <h1 style={styles.title}>Finaliser ma commande</h1>
        <p style={styles.subtitle}>
          Remplissez vos informations, nous vous contacterons pour confirmer votre commande.
        </p>

        <div style={styles.grid}>
          <form style={styles.formCard} onSubmit={handleSubmit}>
            <h2 style={styles.cardTitle}>Vos informations</h2>

            <label style={styles.label}>Nom complet *</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Votre nom et prénom"
              style={styles.input}
              required
            />

            <label style={styles.label}>Téléphone *</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="99 000 000"
              style={styles.input}
              required
            />

            <label style={styles.label}>Adresse *</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Rue, numéro, quartier..."
              style={styles.input}
              required
            />

            <label style={styles.label}>Ville *</label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Votre ville"
              style={styles.input}
              required
            />

            <label style={styles.label}>Notes (optionnel)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Précisions sur la livraison, horaires..."
              style={styles.textarea}
              rows={4}
            />

            {error && <p style={styles.errorText}>{error}</p>}

            <button type="submit" style={styles.submitBtn} disabled={sending}>
              {sending ? "Envoi en cours..." : "Confirmer la commande"}
            </button>
          </form>

          <div style={styles.summaryCard}>
            <h2 style={styles.cardTitle}>Résumé de la commande</h2>

            {cart.length === 0 ? (
              <p style={styles.emptyNote}>Votre panier est vide.</p>
            ) : (
              <>
                <div style={styles.itemsList}>
                  {cart.map((item) => (
                    <div key={item.id} style={styles.summaryItem}>
                      <img src={item.image} alt={item.title} style={styles.summaryImg} />
                      <div style={{ flex: 1 }}>
                        <p style={styles.summaryItemTitle}>{item.title}</p>
                        <p style={styles.summaryItemQty}>Qté : {item.quantity}</p>
                      </div>
                      <p style={styles.summaryItemPrice}>
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div style={styles.totalLine}>
                  <span style={styles.totalLabel}>Total</span>
                  <span style={styles.totalValue}>{formatPrice(totalPrice)}</span>
                </div>
              </>
            )}
          </div>
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
    height: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 60px",
    background: "white",
    borderBottom: "1px solid #eee",
  },
  logo: { fontSize: 34, fontWeight: 900 },
  backBtn: {
    border: "1px solid #ddd",
    background: "white",
    borderRadius: 999,
    padding: "14px 26px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 16,
  },

  container: {
    maxWidth: 1400,
    margin: "0 auto",
    padding: "70px 40px 100px",
  },

  title: { fontSize: 46, fontWeight: 900, margin: 0 },
  subtitle: { fontSize: 18, color: "rgba(0,0,0,0.55)", marginTop: 14, maxWidth: 700, lineHeight: 1.6 },

  grid: {
    display: "grid",
    gridTemplateColumns: "1.3fr 1fr",
    gap: 36,
    marginTop: 50,
  },

  formCard: {
    background: "white",
    borderRadius: 22,
    border: "1px solid rgba(0,0,0,0.06)",
    padding: 40,
    display: "flex",
    flexDirection: "column",
  },
  cardTitle: { fontSize: 24, fontWeight: 900, margin: "0 0 10px" },

  label: { fontSize: 15, fontWeight: 700, marginTop: 20, marginBottom: 8 },
  input: {
    border: "1px solid #ddd",
    borderRadius: 12,
    padding: "16px 18px",
    fontSize: 16,
    outline: "none",
    fontFamily: "inherit",
  },
  textarea: {
    border: "1px solid #ddd",
    borderRadius: 12,
    padding: "16px 18px",
    fontSize: 16,
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
  },
  errorText: { color: "#c0392b", fontWeight: 700, fontSize: 15, marginTop: 20, marginBottom: 0 },
  submitBtn: {
    marginTop: 30,
    background: "#111",
    color: "white",
    border: "none",
    borderRadius: 999,
    padding: "20px 28px",
    fontWeight: 900,
    fontSize: 18,
    cursor: "pointer",
  },

  summaryCard: {
    background: "white",
    borderRadius: 22,
    border: "1px solid rgba(0,0,0,0.06)",
    padding: 40,
    height: "fit-content",
  },
  emptyNote: { fontSize: 16, color: "#888" },

  itemsList: { display: "flex", flexDirection: "column", gap: 20, marginTop: 20 },
  summaryItem: { display: "flex", alignItems: "center", gap: 16 },
  summaryImg: {
    width: 80,
    height: 80,
    objectFit: "cover",
    borderRadius: 12,
    background: "#f2f2f2",
    flexShrink: 0,
  },
  summaryItemTitle: { fontSize: 15, fontWeight: 800, margin: 0 },
  summaryItemQty: { fontSize: 13, color: "#888", margin: "4px 0 0" },
  summaryItemPrice: { fontSize: 15, fontWeight: 900, margin: 0 },

  totalLine: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    paddingTop: 24,
    borderTop: "1px solid #eee",
  },
  totalLabel: { fontSize: 18, fontWeight: 800 },
  totalValue: { fontSize: 28, fontWeight: 900 },

  confirmWrap: {
    maxWidth: 800,
    margin: "0 auto",
    padding: "120px 40px",
    textAlign: "center",
  },
  confirmIcon: {
    width: 90,
    height: 90,
    borderRadius: "50%",
    background: "#111",
    color: "white",
    fontSize: 42,
    fontWeight: 900,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 30px",
  },
  confirmTitle: { fontSize: 42, fontWeight: 900, margin: 0 },
  confirmText: { fontSize: 20, lineHeight: 1.7, marginTop: 26, color: "#333" },
  confirmSub: { fontSize: 16, color: "#888", marginTop: 16 },
  backHomeBtn: {
    marginTop: 44,
    background: "#111",
    color: "white",
    border: "none",
    borderRadius: 999,
    padding: "18px 34px",
    fontWeight: 800,
    fontSize: 17,
    cursor: "pointer",
  },
};
