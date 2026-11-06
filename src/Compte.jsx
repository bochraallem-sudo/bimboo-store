import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminPanel from "./AdminPanel.jsx";

const ACCENT = "#c98f8f";
const ACCENT_DARK = "#a85a5a";
const API_URL = "http://localhost:5000/api/auth";

export default function Compte() {
  const navigate = useNavigate();

  const [view, setView] = useState("landing"); // landing | signup | login | dashboard
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [error, setError] = useState("");

  const [account, setAccount] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [pwdSaved, setPwdSaved] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("bimboo_token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetch(`${API_URL}/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (!res.ok) throw new Error("session expirée");
        return res.json();
      })
      .then((data) => {
        setAccount(data.user);
        setView("dashboard");
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("bimboo_token");
        setLoading(false);
      });
  }, []);

  const benefits = [
    { icon: "🎁", title: "Gagnez des points", desc: "Chaque dinar dépensé vous rapporte des points de fidélité, automatiquement." },
    { icon: "🏷️", title: "Échangez vos points", desc: "Utilisez vos points cumulés pour obtenir des réductions sur vos prochains achats." },
    { icon: "✨", title: "Offres exclusives", desc: "Accédez en avant-première à nos promotions et nouveautés réservées aux membres." },
  ];

  const resetAdmin = () => {
    setIsAdmin(false);
    setAdminCode("");
  };

  const goTo = (v) => {
    setView(v);
    setError("");
    resetAdmin();
  };

  const submitAuth = async (path, body) => {
    setError("");
    let res;
    try {
      res = await fetch(`${API_URL}/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch {
      setError("Serveur injoignable : vérifiez que node server.js tourne sur le port 5000.");
      return;
    }

    let data;
    try {
      data = await res.json();
    } catch {
      setError(`Réponse invalide du serveur (code ${res.status}). La route /api/auth/${path} n'existe pas sur le serveur qui tourne : redémarrez-le.`);
      return;
    }

    if (!res.ok) {
      setError(data.error || `Erreur (code ${res.status})`);
      return;
    }
    localStorage.setItem("bimboo_token", data.token);
    setAccount(data.user);
    setView("dashboard");
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) return;
    submitAuth("signup", { name, email, phone, password, isAdmin, adminCode });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    submitAuth("login", { email, password, isAdmin, adminCode });
  };

  const handleLogout = () => {
    localStorage.removeItem("bimboo_token");
    setAccount(null);
    setEmail("");
    setPassword("");
    resetAdmin();
    setView("landing");
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (!newPassword.trim()) return;
    const token = localStorage.getItem("bimboo_token");
    try {
      const res = await fetch(`${API_URL}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ newPassword }),
      });
      if (!res.ok) throw new Error();
      setPwdSaved(true);
      setNewPassword("");
      setTimeout(() => setPwdSaved(false), 2500);
    } catch {
      alert("Erreur lors de la mise à jour du mot de passe.");
    }
  };

  const adminBlock = (
    <div style={styles.adminBox}>
      <label style={styles.adminCheck}>
        <input type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />
        <span>Admin</span>
      </label>
      {isAdmin && (
        <>
          <label style={styles.label}>Code administrateur</label>
          <input
            type="password"
            value={adminCode}
            onChange={(e) => setAdminCode(e.target.value)}
            placeholder="Entrez le code admin"
            style={styles.input}
          />
        </>
      )}
    </div>
  );

  if (loading) {
    return (
      <div style={styles.page}>
        <p style={{ textAlign: "center", padding: 80, fontSize: 18 }}>Chargement...</p>
      </div>
    );
  }

  if (view === "dashboard" && account) {
    const admin = account.role === "admin";
    return (
      <div style={styles.page}>
        <header style={styles.header}>
          <button onClick={() => navigate("/")} style={styles.backBtn}>← Retour à la boutique</button>
          <div style={styles.logo}>bimboo</div>
          <button style={styles.logoutBtn} onClick={handleLogout}>Se déconnecter</button>
        </header>

        <main style={styles.dashContainer}>
          <div style={styles.profileCard}>
            <div style={styles.avatarWrap} onClick={() => alert("L'upload de photo sera bientôt disponible !")}>
              {account.photo ? (
                <img src={account.photo} alt="profil" style={styles.avatarImg} />
              ) : (
                <span style={styles.avatarInitial}>{account.name.charAt(0).toUpperCase()}</span>
              )}
              <span style={styles.avatarEdit}>✎</span>
            </div>

            <h1 style={styles.dashName}>{account.name}</h1>
            <p style={styles.dashEmail}>{account.email}</p>
            {admin && <span style={styles.adminBadge}>Propriétaire de la boutique</span>}

            {!admin && (
              <div>
                <div style={styles.pointsBox}>
                  <span style={styles.pointsValue}>{account.points}</span>
                  <span style={styles.pointsLabel}>points de fidélité</span>
                </div>
              </div>
            )}
          </div>

          <div style={styles.dashGrid}>
            <div style={styles.infoCard}>
              <h2 style={styles.cardTitle}>Mes informations</h2>
              <div style={styles.infoRow}><span style={styles.infoLabel}>Nom complet</span><span style={styles.infoValue}>{account.name}</span></div>
              <div style={styles.infoRow}><span style={styles.infoLabel}>Email</span><span style={styles.infoValue}>{account.email}</span></div>
              <div style={styles.infoRow}><span style={styles.infoLabel}>Téléphone</span><span style={styles.infoValue}>{account.phone}</span></div>
            </div>

            <form style={styles.infoCard} onSubmit={handleSavePassword}>
              <h2 style={styles.cardTitle}>Modifier le mot de passe</h2>
              <label style={styles.label}>Nouveau mot de passe</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Nouveau mot de passe" style={styles.input} />
              <button type="submit" style={styles.saveBtn}>{pwdSaved ? "✓ Mot de passe modifié" : "Enregistrer"}</button>
            </form>
          </div>

          {admin && <AdminPanel />}
        </main>
      </div>
    );
  }

  if (view === "login") {
    return (
      <div style={styles.page}>
        <header style={styles.header}>
          <button onClick={() => goTo("landing")} style={styles.backBtn}>← Retour</button>
          <div style={styles.logo}>bimboo</div>
          <div style={{ width: 220 }} />
        </header>

        <main style={styles.authWrap}>
          <h1 style={styles.authTitle}>Connexion</h1>
          <p style={styles.authSubtitle}>Connectez-vous pour retrouver vos points et vos avantages.</p>

          <form style={styles.formCard} onSubmit={handleLogin}>
            {error && <p style={styles.errorText}>{error}</p>}
            <label style={styles.label}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.com" style={styles.input} required />
            <label style={styles.label}>Mot de passe</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Votre mot de passe" style={styles.input} required />
            {adminBlock}
            <button type="submit" style={styles.submitBtn}>Se connecter</button>
            <p style={styles.switchNote} onClick={() => goTo("signup")}>Pas encore de compte ? Créez-en un</p>
          </form>
        </main>
      </div>
    );
  }

  if (view === "signup") {
    return (
      <div style={styles.page}>
        <header style={styles.header}>
          <button onClick={() => goTo("landing")} style={styles.backBtn}>← Retour</button>
          <div style={styles.logo}>bimboo</div>
          <div style={{ width: 220 }} />
        </header>

        <main style={styles.authWrap}>
          <h1 style={styles.authTitle}>Créer mon compte</h1>
          <p style={styles.authSubtitle}>Rejoignez le club et commencez à cumuler des points dès aujourd'hui.</p>

          <form style={styles.formCard} onSubmit={handleSignup}>
            {error && <p style={styles.errorText}>{error}</p>}
            <label style={styles.label}>Nom complet *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre nom et prénom" style={styles.input} required />
            <label style={styles.label}>Email *</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.com" style={styles.input} required />
            <label style={styles.label}>Téléphone *</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="99 000 000" style={styles.input} required />
            <label style={styles.label}>Mot de passe *</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Choisissez un mot de passe" style={styles.input} required />
            {adminBlock}
            <button type="submit" style={styles.submitBtn}>Créer mon compte gratuitement</button>
            <p style={styles.switchNote} onClick={() => goTo("login")}>Vous avez déjà un compte ? Connectez-vous</p>
          </form>
        </main>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <button onClick={() => navigate("/")} style={styles.backBtn}>← Retour à la boutique</button>
        <div style={styles.logo}>bimboo</div>
        <div style={{ width: 220 }} />
      </header>

      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <span style={styles.heroKicker}>Programme de fidélité</span>
          <h1 style={styles.heroTitle}>Rejoignez le club bimboo</h1>
          <p style={styles.heroSubtitle}>
            Créez votre compte gratuitement et profitez de points de fidélité, de réductions
            exclusives et d'offres réservées à nos membres.
          </p>
        </div>
      </section>

      <main style={styles.container}>
        <div style={styles.benefitsGrid}>
          {benefits.map((b) => (
            <div key={b.title} style={styles.benefitCard}>
              <span style={styles.benefitIcon}>{b.icon}</span>
              <h3 style={styles.benefitTitle}>{b.title}</h3>
              <p style={styles.benefitDesc}>{b.desc}</p>
            </div>
          ))}
        </div>

        <div style={styles.ctaRow}>
          <button style={styles.submitBtn} onClick={() => goTo("signup")}>Créer mon compte gratuitement</button>
          <p style={styles.switchNote} onClick={() => goTo("login")}>Vous avez déjà un compte ? Connectez-vous</p>
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#fbeff0", color: "#111", fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial' },
  header: { height: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 55px", background: "white", borderBottom: "1px solid #f0dede" },
  logo: { fontSize: 32, fontWeight: 900, fontFamily: "'Playfair Display', serif" },
  backBtn: { border: "1px solid #e3c9c9", background: "white", borderRadius: 999, padding: "14px 24px", cursor: "pointer", fontWeight: 700, fontSize: 16 },
  logoutBtn: { border: "1px solid #e3c9c9", background: "white", borderRadius: 999, padding: "14px 24px", cursor: "pointer", fontWeight: 700, fontSize: 16, color: ACCENT_DARK },

  hero: { width: "100%", minHeight: 300, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", background: "linear-gradient(135deg, #f3d6d6 0%, #ecc4c4 100%)" },
  heroContent: { maxWidth: 760, padding: "0 24px" },
  heroKicker: { display: "inline-block", fontSize: 14, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", padding: "8px 18px", border: `1.5px solid ${ACCENT_DARK}`, color: ACCENT_DARK, borderRadius: 999, marginBottom: 20 },
  heroTitle: { fontSize: 52, fontWeight: 900, margin: 0, fontFamily: "'Playfair Display', serif", color: "#3a1f1f" },
  heroSubtitle: { fontSize: 19, marginTop: 20, lineHeight: 1.7, color: "#5a3a3a" },

  container: { maxWidth: 1150, margin: "0 auto", padding: "70px 30px 110px" },
  benefitsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 },
  benefitCard: { background: "white", borderRadius: 20, border: "1px solid #f0dede", padding: 36, textAlign: "center" },
  benefitIcon: { fontSize: 44 },
  benefitTitle: { fontSize: 20, fontWeight: 900, margin: "18px 0 10px" },
  benefitDesc: { fontSize: 16, color: "rgba(0,0,0,0.55)", lineHeight: 1.65, margin: 0 },
  ctaRow: { textAlign: "center", marginTop: 60, maxWidth: 480, marginLeft: "auto", marginRight: "auto" },

  authWrap: { maxWidth: 560, margin: "0 auto", padding: "80px 24px 120px", textAlign: "center" },
  authTitle: { fontSize: 40, fontWeight: 900, margin: 0, fontFamily: "'Playfair Display', serif" },
  authSubtitle: { fontSize: 17, color: "#6a4a4a", marginTop: 16, lineHeight: 1.6 },

  formCard: { marginTop: 40, background: "white", borderRadius: 22, border: "1px solid #f0dede", padding: 40, display: "flex", flexDirection: "column", textAlign: "left" },
  errorText: { color: "#c0392b", fontWeight: 700, fontSize: 14, marginBottom: 6 },
  label: { fontSize: 15, fontWeight: 700, marginTop: 18, marginBottom: 8 },
  input: { border: "1px solid #ddd", borderRadius: 12, padding: "16px 18px", fontSize: 16, outline: "none", fontFamily: "inherit" },
  submitBtn: { marginTop: 28, background: ACCENT_DARK, color: "white", border: "none", borderRadius: 999, padding: "18px 28px", fontWeight: 800, fontSize: 17, cursor: "pointer", width: "100%" },
  switchNote: { textAlign: "center", fontSize: 15, color: ACCENT_DARK, marginTop: 22, cursor: "pointer", fontWeight: 700 },

  adminBox: { marginTop: 24, padding: "16px 18px", border: "1px dashed #d9b5b5", borderRadius: 14, background: "#fdf6f6", display: "flex", flexDirection: "column" },
  adminCheck: { display: "flex", alignItems: "center", gap: 10, fontWeight: 800, fontSize: 16, cursor: "pointer" },
  adminBadge: { display: "inline-block", marginTop: 12, background: "#111", color: "white", fontSize: 12, fontWeight: 800, padding: "6px 14px", borderRadius: 999, letterSpacing: 0.5 },
  adminNote: { fontSize: 15, color: "#7a5a5a", margin: 0, lineHeight: 1.6 },

  dashContainer: { maxWidth: 1100, margin: "0 auto", padding: "60px 30px 100px" },
  profileCard: { textAlign: "center", marginBottom: 50 },
  avatarWrap: { position: "relative", width: 130, height: 130, borderRadius: "50%", background: ACCENT, margin: "0 auto 22px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden" },
  avatarImg: { width: "100%", height: "100%", objectFit: "cover" },
  avatarInitial: { fontSize: 50, fontWeight: 900, color: "white" },
  avatarEdit: { position: "absolute", bottom: 4, right: 4, background: "white", borderRadius: "50%", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, boxShadow: "0 2px 6px rgba(0,0,0,0.15)" },
  dashName: { fontSize: 34, fontWeight: 900, margin: 0, fontFamily: "'Playfair Display', serif" },
  dashEmail: { fontSize: 16, color: "#7a5a5a", marginTop: 6 },

  pointsBox: { display: "inline-flex", flexDirection: "column", alignItems: "center", marginTop: 26, background: "white", border: `1.5px solid ${ACCENT}`, borderRadius: 20, padding: "22px 40px" },
  pointsValue: { fontSize: 40, fontWeight: 900, color: ACCENT_DARK },
  pointsLabel: { fontSize: 14, color: "#7a5a5a", fontWeight: 700, marginTop: 4 },

  dashGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26 },
  infoCard: { background: "white", borderRadius: 20, border: "1px solid #f0dede", padding: 32, display: "flex", flexDirection: "column" },
  cardTitle: { fontSize: 20, fontWeight: 900, margin: "0 0 20px" },
  infoRow: { display: "flex", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid #f5eaea" },
  infoLabel: { fontSize: 15, color: "#888", fontWeight: 700 },
  infoValue: { fontSize: 15, fontWeight: 800 },
  saveBtn: { marginTop: 22, background: "#111", color: "white", border: "none", borderRadius: 999, padding: "14px 22px", fontWeight: 800, fontSize: 15, cursor: "pointer" },
};
