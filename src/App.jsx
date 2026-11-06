import React, { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext.jsx";

export default function App() {
  const navigate = useNavigate();
  const { addToCart, totalItems } = useCart();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeBadge, setActiveBadge] = useState("All");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des produits:", err);
        setLoading(false);
      });
  }, []);

  const categories = useMemo(() => ["All", "Sacs", "Robe", "Bijoux", "Haut", "Accessoires"], []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCategory = activeCategory === "All" ? true : p.category === activeCategory;
      const matchesBadge = activeBadge === "All" ? true : p.badge === activeBadge;
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchesCategory && matchesBadge && matchesQuery;
    });
  }, [products, query, activeCategory, activeBadge]);

  const navItems = [
    { label: "Nouveautés", value: "NOUVEAU" },
    { label: "Édition limitée", value: "ÉDITION LIMITÉE" },
    { label: "Best seller", value: "BEST SELLER" },
    { label: "Populaire", value: "POPULAIRE" },
    { label: "En stock", value: "EN STOCK" },
  ];

  const productsSectionRef = useRef(null);

  const scrollToProducts = () => {
    productsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBadgeClick = (value) => {
    setActiveBadge(value);
    setActiveCategory("All");
    scrollToProducts();
  };
  const handleCategoryClick = (value) => {
    setActiveCategory(value);
    setActiveBadge("All");
  };

  const handleDecouvrir = () => {
    navigate("/decouvrir");
  };

  const handleVoirNouveautes = () => {
    handleBadgeClick("NOUVEAU");
  };

  const formatPrice = (n) =>
    `${new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(n)} DT`;

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
    setAddedId(product.id);
    setTimeout(() => {
      setAddedId((current) => (current === product.id ? null : current));
    }, 2000);
  };

  const categoryShowcase = [
    { name: "Sacs", img: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=500&q=80" },
    { name: "Robe", img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=500&q=80" },
    { name: "Bijoux", img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=500&q=80" },
    { name: "Haut", img: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=500&q=80" },
  ];

  const trustBadges = [
    { icon: "🚚", title: "Livraison gratuite", desc: "Dès 150 DT d'achat" },
    { icon: "↩️", title: "Retours faciles", desc: "Sous 14 jours" },
    { icon: "🔒", title: "Paiement sécurisé", desc: "100% protégé" },
    { icon: "💬", title: "Support dédié", desc: "Réponse sous 24h" },
  ];

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;600;700;800;900&display=swap');
      `}</style>

      <div style={styles.trustSection}>
        <div style={styles.trustInner}>
          {trustBadges.map((b) => (
            <div key={b.title} style={styles.trustItem}>
              <span style={styles.trustIcon}>{b.icon}</span>
              <div>
                <p style={styles.trustTitle}>{b.title}</p>
                <p style={styles.trustDesc}>{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.leftGroup}>
            <span style={styles.menuIcon}>☰</span>
            <a href="#" style={styles.brand}>
              bimboo
            </a>
          </div>

          <nav style={styles.nav}>
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleBadgeClick(item.value)}
                style={{
                  ...styles.navLink,
                  ...(activeBadge === item.value ? styles.navLinkActive : null),
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div style={styles.rightGroup}>
            <div style={styles.searchWrap}>
              <span style={styles.searchIcon}>⌕</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher..."
                style={styles.searchInput}
              />
            </div>
            <button style={styles.iconBtn} aria-label="User" onClick={() => navigate("/compte")}>
              👤
            </button>
            <button
              style={{ ...styles.iconBtn, position: "relative" }}
              aria-label="Cart"
              onClick={() => navigate("/panier")}
            >
              👜
              {totalItems > 0 && (
                <span style={styles.cartBadge}>{totalItems}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      <section style={styles.hero}>
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
          <span style={styles.heroKicker}>Nouvelle collection</span>
          <h1 style={styles.heroTitle}>Collection Femme</h1>
          <p style={styles.heroSubtitle}>
            Des pièces élégantes et intemporelles — sacs, robes & bijoux, pensées pour sublimer chaque jour.
          </p>

          <div style={styles.heroActions}>
            <button
              style={styles.primaryBtn}
              onClick={handleDecouvrir}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              Découvrir
            </button>
            <button
              style={styles.ghostBtn}
              onClick={handleVoirNouveautes}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              Voir les nouveautés
            </button>
          </div>
        </div>
      </section>

      <section style={styles.loyaltyBanner}>
        <div style={styles.loyaltyInner}>
          <div>
            <p style={styles.loyaltyKicker}>Programme de fidélité</p>
            <h3 style={styles.loyaltyTitle}>
              Créez un compte et gagnez des points sur chaque achat
            </h3>
            <p style={styles.loyaltyDesc}>
              Cumulez des points à chaque commande, échangez-les contre des réductions et profitez
              de promotions exclusives réservées à nos membres.
            </p>
          </div>
          <button style={styles.loyaltyBtn} onClick={() => navigate("/compte")}>
            Créer mon compte
          </button>
        </div>
      </section>

      <section style={styles.catSection}>
        <p style={styles.catKicker}>Sélectionnés avec soin pour sublimer chaque style</p>
        <div style={styles.catInner}>
          {categoryShowcase.map((cat) => (
            <div
              key={cat.name}
              style={styles.catCard}
              onClick={() => {
                handleCategoryClick(cat.name);
                scrollToProducts();
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <img src={cat.img} alt={cat.name} style={styles.catImg} />
              <div style={styles.catOverlay} />
              <span style={styles.catLabel}>{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

  
      <main style={styles.main} ref={productsSectionRef}>
        <div style={styles.sectionHeader}>
          <div>
            <span style={styles.sectionKicker}>À la une</span>
            <h2 style={styles.sectionTitle}>Notre sélection</h2>
            <p style={styles.sectionDesc}>
              Une sélection soigneusement choisie. Des textures premium, des coupes raffinées et une
              touche artisanale.
            </p>
          </div>

          <div style={styles.filterArea}>
            <span style={styles.filterLabel}>Filtrer:</span>
            <div style={styles.filterBtns}>
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => handleCategoryClick(c)}
                  style={{
                    ...styles.filterBtn,
                    ...(activeCategory === c ? styles.filterBtnActive : null),
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={styles.grid}>
          {loading && <p style={styles.loadingText}>Chargement des produits...</p>}
          {!loading && filtered.length === 0 && (
            <p style={styles.loadingText}>Aucun produit trouvé.</p>
          )}
          {filtered.map((p) => (
            <article
              key={p.id}
              style={styles.card}
              onClick={() =>
                navigate(`/detail/${p.id}`, {
                  state: { product: p },
                })
              }
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 18px 32px rgba(0,0,0,0.1)";
                e.currentTarget.style.borderColor = "rgba(196,120,88,0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.03)";
                e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)";
              }}
            >
              <div style={styles.cardMedia}>
                <img src={p.image} alt={p.title} style={styles.cardImg} />

                <div style={styles.badge}>{p.badge}</div>

                <div style={styles.cardActions}>
                  <button style={styles.cardIconBtn} aria-label="Wishlist" onClick={(e) => e.stopPropagation()}>
                    ♡
                  </button>
                  <button style={styles.cardIconBtn} aria-label="Quick view" onClick={(e) => e.stopPropagation()}>
                    👁
                  </button>
                </div>
              </div>

              <div style={styles.cardBody}>
                <div style={styles.cardTopLine}>
                  <span style={styles.cardBrand}>{p.brand}</span>
                  <span style={styles.cardCategory}>{p.category}</span>
                </div>
                <h3 style={styles.cardTitle}>{p.title}</h3>

                <div style={styles.cardBottom}>
                  <span style={styles.price}>{formatPrice(p.price)}</span>
                  <button
                    style={styles.addBtn}
                    onClick={(e) => handleAddToCart(e, p)}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#333")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#111")}
                  >
                    {addedId === p.id ? "✓ Ajouté" : "Ajouter"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div style={{ height: 40 }} />
      </main>

      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <div>
            <div style={styles.footerBrand}>bimboo</div>
            <p style={styles.footerText}>
              Mode féminine élégante, pensée pour toutes les occasions.
            </p>
          </div>
          <div style={styles.footerCol}>
            <p style={styles.footerHeading}>Boutique</p>
            <p style={styles.footerLinkStatic}>Nouveautés</p>
            <p style={styles.footerLinkStatic}>Sacs</p>
            <p style={styles.footerLinkStatic}>Robes</p>
            <p style={styles.footerLinkStatic}>Bijoux</p>
          </div>
          <div style={styles.footerCol}>
            <p style={styles.footerHeading}>Aide</p>
            <p style={styles.footerLinkStatic}>Livraison</p>
            <p style={styles.footerLinkStatic}>Retours</p>
            <p style={styles.footerLink} onClick={() => navigate("/aide")}>
              Contact
            </p>
          </div>
        </div>
        <div style={styles.footerBottom}>© 2026 bimboo. Tous droits réservés.</div>
      </footer>
    </div>
  );
}

const ACCENT = "#c4785f";
const ACCENT_DARK = "#a8523a";

const styles = {
  page: {
    minHeight: "100vh",
    background: "#faf6f2",
    color: "#1a1a1a",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
  },

  header: {
    position: "sticky",
    top: 0,
    zIndex: 20,
    background: "rgba(250,246,242,0.92)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
  },
  headerInner: {
    width: "100%",
    margin: 0,
    padding: "20px 40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 28,
  },
  leftGroup: { display: "flex", alignItems: "center", gap: 16 },
  menuIcon: { fontSize: 24, opacity: 0.85 },
  brand: {
    fontSize: 46,
    fontWeight: 900,
    letterSpacing: 0.5,
    textDecoration: "none",
    color: "#111",
    fontFamily: "'Playfair Display', serif",
  },
  nav: { display: "flex", gap: 34 },
  navLink: {
    color: "#333",
    textDecoration: "none",
    fontSize: 20,
    fontWeight: 700,
    opacity: 0.7,
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "4px 0",
    letterSpacing: 0.2,
    transition: "opacity 150ms ease, color 150ms ease",
  },
  navLinkActive: {
    opacity: 1,
    color: ACCENT_DARK,
    borderBottom: `2px solid ${ACCENT}`,
  },
  rightGroup: { display: "flex", alignItems: "center", gap: 12, marginRight: "7%" },
  searchWrap: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 16px",
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,0.08)",
    background: "white",
    width: 280,
  },
  searchIcon: { fontSize: 16, opacity: 0.5 },
  searchInput: {
    border: "none",
    outline: "none",
    width: "100%",
    fontSize: 14,
    background: "transparent",
  },
  iconBtn: {
    border: "1px solid rgba(0,0,0,0.08)",
    background: "white",
    borderRadius: 14,
    width: 46,
    height: 46,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: 17,
  },
  cartBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    background: ACCENT_DARK,
    color: "white",
    fontSize: 10,
    fontWeight: 900,
    borderRadius: 999,
    minWidth: 18,
    height: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 4px",
    border: "2px solid #faf6f2",
  },

  hero: {
    position: "relative",
    width: "100%",
    margin: 0,
    overflow: "hidden",
    minHeight: 320,
    display: "flex",
    alignItems: "center",
    background:
      "url('https://images.unsplash.com/photo-1520975682031-a6a0b6c3f1e0?auto=format&fit=crop&w=1900&q=80') center/cover no-repeat",
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(105deg, rgba(60,26,18,0.75) 0%, rgba(60,26,18,0.4) 48%, rgba(60,26,18,0.08) 100%)",
  },
  heroContent: {
    position: "relative",
    padding: "0 70px",
    color: "white",
    maxWidth: 760,
    zIndex: 1,
  },
  heroKicker: {
    display: "inline-block",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 2,
    textTransform: "uppercase",
    opacity: 0.95,
    marginBottom: 14,
    padding: "6px 14px",
    border: `1px solid ${ACCENT}`,
    background: "rgba(196,120,95,0.25)",
    borderRadius: 999,
  },
  heroTitle: {
    fontSize: 48,
    margin: 0,
    letterSpacing: 0.2,
    fontWeight: 900,
    lineHeight: 1.05,
    textShadow: "0 2px 24px rgba(0,0,0,0.35)",
    fontFamily: "'Playfair Display', serif",
  },
  heroSubtitle: {
    marginTop: 18,
    opacity: 0.95,
    lineHeight: 1.65,
    maxWidth: 540,
    fontSize: 16,
  },
  heroActions: { display: "flex", gap: 14, marginTop: 32, flexWrap: "wrap" },
  primaryBtn: {
    background: ACCENT,
    color: "white",
    border: `1px solid ${ACCENT}`,
    borderRadius: 999,
    padding: "15px 28px",
    fontWeight: 800,
    fontSize: 14,
    cursor: "pointer",
    transition: "transform 150ms ease",
  },
  ghostBtn: {
    background: "transparent",
    color: "white",
    border: "1.5px solid rgba(255,255,255,0.75)",
    borderRadius: 999,
    padding: "15px 28px",
    fontWeight: 800,
    fontSize: 14,
    cursor: "pointer",
    transition: "background 150ms ease",
  },

  main: { width: "85%", margin: "0 auto", padding: "50px 24px 40px", boxSizing: "border-box" },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 20,
    marginBottom: 34,
    flexWrap: "wrap",
  },
  sectionKicker: {
    color: ACCENT_DARK,
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  sectionTitle: { margin: "6px 0 0", fontSize: 30, fontWeight: 900, letterSpacing: 0.2, fontFamily: "'Playfair Display', serif" },
  sectionDesc: { marginTop: 10, maxWidth: 560, lineHeight: 1.6, color: "rgba(0,0,0,0.55)", fontSize: 14 },

  filterArea: { display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" },
  filterLabel: { fontWeight: 800, fontSize: 17, opacity: 0.7 },
  filterBtns: { display: "flex", gap: 10, flexWrap: "wrap" },
  filterBtn: {
    borderRadius: 999,
    padding: "13px 24px",
    background: "white",
    border: "1px solid rgba(0,0,0,0.08)",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 15,
    color: "rgba(0,0,0,0.7)",
    transition: "all 150ms ease",
  },
  filterBtnActive: {
    background: ACCENT,
    color: "white",
    borderColor: ACCENT,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 22,
  },

  loadingText: { gridColumn: "1 / -1", textAlign: "center", color: "#888", padding: "40px 0" },

  card: {
    background: "white",
    borderRadius: 16,
    overflow: "hidden",
    border: "1px solid rgba(0,0,0,0.06)",
    boxShadow: "0 10px 25px rgba(0,0,0,0.03)",
    transition: "transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease",
    cursor: "pointer",
  },

  cardMedia: {
    position: "relative",
    height: 294,
    background: "#f2ece6",
  },
  cardImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  badge: {
    position: "absolute",
    top: 14,
    left: 14,
    background: ACCENT_DARK,
    color: "white",
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: 0.5,
    padding: "7px 13px",
    borderRadius: 999,
  },
  cardActions: {
    position: "absolute",
    right: 14,
    bottom: 14,
    display: "flex",
    gap: 8,
    opacity: 0.95,
  },
  cardIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.08)",
    background: "rgba(255,255,255,0.95)",
    cursor: "pointer",
    fontSize: 15,
  },
  cardBody: { padding: "20px 20px 22px" },
  cardTopLine: { display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 10 },
  cardBrand: { fontSize: 12, fontWeight: 900, color: ACCENT_DARK, textTransform: "uppercase", letterSpacing: 0.5 },
  cardCategory: { fontSize: 12, fontWeight: 700, color: "rgba(0,0,0,0.35)" },
  cardTitle: { margin: 0, fontSize: 18, lineHeight: 1.35, fontWeight: 800 },
  cardBottom: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18 },
  price: { fontWeight: 900, fontSize: 18, color: "#1a1a1a" },
  addBtn: {
    background: "#111",
    color: "white",
    border: "1px solid #111",
    borderRadius: 999,
    padding: "12px 20px",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: 13,
    transition: "background 150ms ease",
  },

  loyaltyBanner: { background: "#1a1512", padding: "48px 24px" },
  loyaltyInner: {
    maxWidth: 1300,
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 30,
    flexWrap: "wrap",
  },
  loyaltyKicker: {
    color: ACCENT,
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    margin: 0,
  },
  loyaltyTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: 900,
    margin: "8px 0 10px",
    fontFamily: "'Playfair Display', serif",
    maxWidth: 560,
  },
  loyaltyDesc: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 14,
    lineHeight: 1.6,
    maxWidth: 520,
    margin: 0,
  },
  loyaltyBtn: {
    background: ACCENT,
    color: "white",
    border: "none",
    borderRadius: 999,
    padding: "16px 30px",
    fontWeight: 800,
    fontSize: 14,
    cursor: "pointer",
    flexShrink: 0,
  },

  catSection: { background: "#faf6f2", padding: "50px 0 10px", width: "100%" },
  catKicker: {
    textAlign: "center",
    color: "#a8523a",
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: 0.3,
    marginBottom: 24,
  },
  catInner: {
    width: "92%",
    margin: "0 auto",
    padding: "0 24px",
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 18,
    boxSizing: "border-box",
  },
  catCard: {
    position: "relative",
    height: 180,
    borderRadius: 12,
    overflow: "hidden",
    cursor: "pointer",
    transition: "transform 200ms ease",
  },
  catImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  catOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)",
  },
  catLabel: {
    position: "absolute",
    bottom: 16,
    left: 18,
    color: "white",
    fontWeight: 900,
    fontSize: 18,
    fontFamily: "'Playfair Display', serif",
    textShadow: "0 2px 10px rgba(0,0,0,0.4)",
  },

  trustSection: {
    background: "white",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
  },
  trustInner: {
    maxWidth: 1300,
    margin: "0 auto",
    padding: "10px 24px",
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 20,
  },
  trustItem: { display: "flex", alignItems: "center", gap: 10 },
  trustIcon: { fontSize: 18 },
  trustTitle: { margin: 0, fontWeight: 800, fontSize: 12 },
  trustDesc: { margin: 0, fontSize: 11, color: "rgba(0,0,0,0.5)" },

  footer: { background: "#1a1512", color: "rgba(255,255,255,0.85)", marginTop: 60 },
  footerInner: {
    maxWidth: 1300,
    margin: "0 auto",
    padding: "50px 24px 30px",
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr",
    gap: 40,
  },
  footerBrand: {
    fontSize: 24,
    fontWeight: 900,
    color: "white",
    fontFamily: "'Playfair Display', serif",
    marginBottom: 10,
  },
  footerText: { fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.55)", maxWidth: 280 },
  footerCol: { display: "flex", flexDirection: "column", gap: 10 },
  footerHeading: { fontWeight: 800, fontSize: 13, color: "white", marginBottom: 4 },
  footerLinkStatic: { fontSize: 13, color: "rgba(255,255,255,0.6)", margin: 0, cursor: "default" },
  footerLink: {
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
    margin: 0,
    cursor: "pointer",
    textDecoration: "underline",
    width: "fit-content",
  },
  footerBottom: {
    borderTop: "1px solid rgba(255,255,255,0.1)",
    padding: "18px 24px",
    textAlign: "center",
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
  },
};
