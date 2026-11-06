import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Aide() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSent(true);
    setName("");
    setEmail("");
    setMessage("");
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <button onClick={() => navigate("/")} style={styles.backBtn}>
          ← Retour à la boutique
        </button>
        <div style={styles.logo}>bimboo</div>
        <div style={{ width: 200 }} />
      </header>

      <main style={styles.container}>
        <h1 style={styles.title}>Aide & Contact</h1>
        <p style={styles.subtitle}>
          Une question, une remarque ou besoin d'aide ? Nous sommes là pour vous.
        </p>

        <div style={styles.noticeBox}>
          🌐 <strong>bimboo</strong> est actuellement un site 100% en ligne — nous n'avons pas
          encore de boutique physique. Une boutique bientôt disponible, restez connectés !
        </div>

        <div style={styles.grid}>
          {/* Coordonnées */}
          <div style={styles.infoCard}>
            <h2 style={styles.cardTitle}>Nos coordonnées</h2>

            <div style={styles.infoRow}>
              <span style={styles.infoIcon}>📧</span>
              <div>
                <p style={styles.infoLabel}>Email</p>
                <a href="mailto:bimbo.store.aide@gmail.com" style={styles.infoValue}>
                  bimbo.store.aid@gmail.com
                </a>
              </div>
            </div>

            <div style={styles.infoRow}>
              <span style={styles.infoIcon}>📞</span>
              <div>
                <p style={styles.infoLabel}>Téléphone</p>
                <a href="tel:+21699087048" style={styles.infoValue}>
                  99 087 048
                </a>
              </div>
            </div>

            <div style={styles.infoRow}>
              <span style={styles.infoIcon}>🕒</span>
              <div>
                <p style={styles.infoLabel}>Réponse</p>
                <p style={styles.infoValueStatic}>Sous 24h, du lundi au samedi</p>
              </div>
            </div>
          </div>

          
          <form style={styles.formCard} onSubmit={handleSend}>
            <h2 style={styles.cardTitle}>Envoyez-nous un message</h2>

            <label style={styles.label}>Nom</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Votre nom"
              style={styles.input}
            />

            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              style={styles.input}
            />

            <label style={styles.label}>Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Votre message..."
              style={styles.textarea}
              rows={5}
            />

            <button type="submit" style={styles.sendBtn}>
              {sent ? "✓ Message envoyé !" : "Envoyer"}
            </button>
          </form>
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
    maxWidth: 1000,
    margin: "0 auto",
    padding: "60px 30px 80px",
  },

  title: { fontSize: 38, fontWeight: 900, margin: 0 },
  subtitle: { fontSize: 15, color: "rgba(0,0,0,0.55)", marginTop: 10, maxWidth: 560, lineHeight: 1.6 },

  noticeBox: {
    marginTop: 28,
    background: "#fff4ec",
    border: "1px solid #f0d5c2",
    borderRadius: 14,
    padding: "16px 20px",
    fontSize: 14,
    lineHeight: 1.6,
    color: "#7a4a2f",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1.3fr",
    gap: 26,
    marginTop: 36,
  },

  infoCard: {
    background: "white",
    borderRadius: 18,
    border: "1px solid rgba(0,0,0,0.06)",
    padding: 28,
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  cardTitle: { fontSize: 18, fontWeight: 900, margin: "0 0 6px" },

  infoRow: { display: "flex", alignItems: "flex-start", gap: 14 },
  infoIcon: { fontSize: 22 },
  infoLabel: { margin: 0, fontSize: 12, color: "rgba(0,0,0,0.45)", fontWeight: 700, textTransform: "uppercase" },
  infoValue: { fontSize: 15, fontWeight: 700, color: "#111", textDecoration: "none" },
  infoValueStatic: { fontSize: 15, fontWeight: 600, color: "#333", margin: "2px 0 0" },

  formCard: {
    background: "white",
    borderRadius: 18,
    border: "1px solid rgba(0,0,0,0.06)",
    padding: 28,
    display: "flex",
    flexDirection: "column",
  },
  label: { fontSize: 13, fontWeight: 700, marginTop: 16, marginBottom: 6 },
  input: {
    border: "1px solid #ddd",
    borderRadius: 10,
    padding: "12px 14px",
    fontSize: 14,
    outline: "none",
    fontFamily: "inherit",
  },
  textarea: {
    border: "1px solid #ddd",
    borderRadius: 10,
    padding: "12px 14px",
    fontSize: 14,
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
  },
  sendBtn: {
    marginTop: 22,
    background: "#111",
    color: "white",
    border: "none",
    borderRadius: 999,
    padding: "14px 24px",
    fontWeight: 800,
    fontSize: 15,
    cursor: "pointer",
  },
};
