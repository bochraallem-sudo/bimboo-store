import React, { useState, useEffect } from "react";

const ACCENT = "#c98f8f";
const ACCENT_DARK = "#a85a5a";
const API = "http://localhost:5000/api";

const CATEGORIES = ["Robe", "Sacs", "Bijoux", "Haut", "Accessoires"];

const formatPrice = (n) =>
  `${new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(n)} DT`;

export default function AdminPanel() {
  const token = localStorage.getItem("bimboo_token");
  const authHeaders = { Authorization: `Bearer ${token}` };

  const [tab, setTab] = useState("commandes"); 
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("Robe");
  const [drafts, setDrafts] = useState({});
  const [savedId, setSavedId] = useState(null);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      const res = await fetch(`${API}/orders`, { headers: authHeaders });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOrders(data.orders);
    } catch (e) {
      setError(e.message || "Impossible de charger les commandes");
    }
  };

  const loadProducts = async () => {
    try {
      const res = await fetch(`${API}/products`);
      const data = await res.json();
      setProducts(data);
    } catch {
      setError("Impossible de charger les produits");
    }
  };

  useEffect(() => {
    loadOrders();
    loadProducts();
  }, []);

  const validateOrder = async (id) => {
    try {
      const res = await fetch(`${API}/orders/${id}/validate`, {
        method: "PATCH",
        headers: authHeaders,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOrders((prev) => prev.map((o) => (o._id === id ? data.order : o)));
    } catch (e) {
      alert(e.message || "Erreur lors de la validation");
    }
  };

  const saveStock = async (p) => {
    const value = parseInt(drafts[p.id] ?? p.stock);
    if (isNaN(value) || value < 0) {
      alert("Stock invalide");
      return;
    }
    try {
      const res = await fetch(`${API}/products/${p.id}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify({ stock: value }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, stock: data.product.stock } : x)));
      setDrafts((d) => {
        const copy = { ...d };
        delete copy[p.id];
        return copy;
      });
      setSavedId(p.id);
      setTimeout(() => setSavedId(null), 1500);
    } catch (e) {
      alert(e.message || "Erreur lors de la mise à jour du stock");
    }
  };

  const pending = orders.filter((o) => o.status === "en_attente").length;
  const visible = products.filter((p) => p.category === category);
  const totalVisible = visible.reduce((s, p) => s + (p.stock ?? 0), 0);

  const stockByCategory = CATEGORIES.map((c) => ({
    name: c,
    total: products.filter((p) => p.category === c).reduce((s, p) => s + (p.stock ?? 0), 0),
  }));

  return (
    <div style={styles.wrap}>
      <div style={styles.tabs}>
        <button
          style={{ ...styles.tab, ...(tab === "commandes" ? styles.tabActive : null) }}
          onClick={() => setTab("commandes")}
        >
          Commandes {pending > 0 && <span style={styles.pendingDot}>{pending}</span>}
        </button>
        <button
          style={{ ...styles.tab, ...(tab === "stock" ? styles.tabActive : null) }}
          onClick={() => setTab("stock")}
        >
          Stock
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {tab === "commandes" && (
        <div style={styles.card}>
          <h2 style={styles.title}>Historique des commandes</h2>
          <p style={styles.sub}>
            {orders.length} commande(s) au total, {pending} en attente de validation.
          </p>

          {orders.length === 0 ? (
            <p style={styles.empty}>Aucune commande pour le moment.</p>
          ) : (
            <div style={styles.list}>
              {orders.map((o) => (
                <div key={o._id} style={styles.order}>
                  <div style={styles.orderTop}>
                    <span style={styles.date}>{new Date(o.createdAt).toLocaleString("fr-FR")}</span>
                    <span
                      style={{
                        ...styles.status,
                        ...(o.status === "validee" ? styles.statusOk : styles.statusWait),
                      }}
                    >
                      {o.status === "validee" ? "Validée" : "En attente"}
                    </span>
                  </div>

                  <p style={styles.client}>
                    <strong>{o.customer.fullName}</strong> · {o.customer.phone}
                  </p>
                  <p style={styles.address}>
                    {o.customer.address}, {o.customer.city}
                  </p>
                  {o.customer.notes && <p style={styles.notes}>Note : {o.customer.notes}</p>}
                  {o.user && <p style={styles.account}>Compte : {o.user.name} ({o.user.email})</p>}

                  <div style={styles.items}>
                    {o.items.map((it, i) => (
                      <div key={i} style={styles.item}>
                        <img src={it.image} alt={it.title} style={styles.thumb} />
                        <span style={styles.itemTitle}>{it.title}</span>
                        <span style={styles.itemQty}>x{it.quantity}</span>
                        <span style={styles.itemPrice}>{formatPrice(it.price * it.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div style={styles.orderBottom}>
                    <span style={styles.total}>Total : {formatPrice(o.total)}</span>
                    {o.status !== "validee" && (
                      <button style={styles.validateBtn} onClick={() => validateOrder(o._id)}>
                        Valider la commande
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "stock" && (
        <div style={styles.card}>
          <h2 style={styles.title}>Stock de la boutique</h2>

          <div style={styles.chips}>
            {stockByCategory.map((c) => (
              <button
                key={c.name}
                onClick={() => setCategory(c.name)}
                style={{ ...styles.chip, ...(category === c.name ? styles.chipActive : null) }}
              >
                {c.name} : {c.total}
              </button>
            ))}
          </div>

          <p style={styles.sub}>
            {category} : <strong>{totalVisible}</strong> pièce(s) en stock, réparties sur {visible.length} modèle(s).
          </p>

          <div style={styles.list}>
            {visible.map((p) => {
              const current = drafts[p.id] ?? p.stock ?? 0;
              return (
                <div key={p.id} style={styles.stockRow}>
                  <img src={p.image} alt={p.title} style={styles.thumb} />
                  <span style={styles.itemTitle}>{p.title}</span>
                  <span style={{ ...styles.stockState, color: (p.stock ?? 0) === 0 ? "#c0392b" : "#2b6b3d" }}>
                    {(p.stock ?? 0) === 0 ? "Rupture" : "En stock"}
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={current}
                    onChange={(e) => setDrafts((d) => ({ ...d, [p.id]: e.target.value }))}
                    style={styles.stockInput}
                  />
                  <button style={styles.saveBtn} onClick={() => saveStock(p)}>
                    {savedId === p.id ? "✓" : "Enregistrer"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrap: { marginTop: 26 },
  tabs: { display: "flex", gap: 10, marginBottom: 18 },
  tab: { border: "1px solid #e3c9c9", background: "white", borderRadius: 999, padding: "12px 24px", fontWeight: 800, fontSize: 15, cursor: "pointer" },
  tabActive: { background: ACCENT_DARK, color: "white", borderColor: ACCENT_DARK },
  pendingDot: { display: "inline-block", marginLeft: 8, background: "#c0392b", color: "white", borderRadius: 999, fontSize: 12, padding: "2px 8px" },

  card: { background: "white", borderRadius: 20, border: "1px solid #f0dede", padding: 32 },
  title: { fontSize: 22, fontWeight: 900, margin: 0 },
  sub: { fontSize: 15, color: "#7a5a5a", margin: "8px 0 22px" },
  empty: { fontSize: 15, color: "#888" },
  error: { color: "#c0392b", fontWeight: 700, fontSize: 14 },
  list: { display: "flex", flexDirection: "column", gap: 16 },

  order: { border: "1px solid #f0dede", borderRadius: 16, padding: 22, background: "#fffafa" },
  orderTop: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  date: { fontSize: 13, color: "#888", fontWeight: 700 },
  status: { fontSize: 12, fontWeight: 800, padding: "6px 14px", borderRadius: 999 },
  statusOk: { background: "#e8f5ec", color: "#2b6b3d" },
  statusWait: { background: "#fff1e0", color: "#a8661a" },
  client: { fontSize: 16, margin: "14px 0 4px" },
  address: { fontSize: 14, color: "#555", margin: 0 },
  notes: { fontSize: 13, color: "#777", margin: "6px 0 0", fontStyle: "italic" },
  account: { fontSize: 13, color: ACCENT_DARK, margin: "6px 0 0", fontWeight: 700 },

  items: { marginTop: 16, display: "flex", flexDirection: "column", gap: 10 },
  item: { display: "flex", alignItems: "center", gap: 12 },
  thumb: { width: 48, height: 48, objectFit: "cover", borderRadius: 8, background: "#f2f2f2", flexShrink: 0 },
  itemTitle: { flex: 1, fontSize: 14, fontWeight: 700 },
  itemQty: { fontSize: 14, color: "#888", fontWeight: 700 },
  itemPrice: { fontSize: 14, fontWeight: 800, minWidth: 100, textAlign: "right" },

  orderBottom: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18, paddingTop: 16, borderTop: "1px solid #f0dede" },
  total: { fontSize: 18, fontWeight: 900 },
  validateBtn: { background: "#111", color: "white", border: "none", borderRadius: 999, padding: "12px 22px", fontWeight: 800, fontSize: 14, cursor: "pointer" },

  chips: { display: "flex", gap: 10, flexWrap: "wrap", margin: "18px 0 6px" },
  chip: { border: "1px solid #e3c9c9", background: "white", borderRadius: 999, padding: "10px 18px", fontWeight: 700, fontSize: 14, cursor: "pointer" },
  chipActive: { background: ACCENT, color: "white", borderColor: ACCENT },

  stockRow: { display: "flex", alignItems: "center", gap: 14, padding: "10px 0", borderBottom: "1px solid #f5eaea" },
  stockState: { fontSize: 13, fontWeight: 800, minWidth: 70 },
  stockInput: { width: 80, border: "1px solid #ddd", borderRadius: 10, padding: "10px 12px", fontSize: 15, outline: "none" },
  saveBtn: { background: "#111", color: "white", border: "none", borderRadius: 999, padding: "10px 18px", fontWeight: 800, fontSize: 13, cursor: "pointer", minWidth: 100 },
};
