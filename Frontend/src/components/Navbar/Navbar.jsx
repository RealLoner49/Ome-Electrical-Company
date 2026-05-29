import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "../../context/CartContext";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import "./Navbar.css";

function Navbar() {
  const [activeCat, setActiveCat] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { count, pulse, openCart } = useCart();
  const { toggleChat } = useChat();
  const { user, logout, setAuthModalOpen } = useAuth();
  const toast = useToast();

  const wrapperRef = useRef(null);

  const goToProfile = () => {
    setMobileOpen(false);
    window.location.hash = "/profile";
  };

  const goHome = () => {
    setMobileOpen(false);
    window.location.hash = "/";
  };

  const handleAuthClick = () => {
    if (user) {
      goToProfile();
    } else {
      setAuthModalOpen(true);
    }
  };

  const handleAdminClick = () => {
    const password = prompt("Enter admin password:");
    if (password === ADMIN_PASSWORD) {
      window.location.hash = "/admin-payments";
    } else {
      toast?.showToast?.("Incorrect password. Access denied.", "error");
    }
  };

  const categories = useMemo(
    () => [
      { name: "Cables & Wires", subcategories: ["Copper Cables", "Aluminum Cables", "Armoured Cable (SWA)", "Flexible Cable "] },
      { name: "Chandelier", subcategories: ["Crystal Chandeliers", "Modern Chandeliers", "Traditional Design", "LED Chandeliers"] },
      { name: "Lighting Fixtures", subcategories: ["Pop/Surface Lights", "Wall Lights", "Panel Lights", "Flood Lights"] },
      { name: "Switches & Sockets", subcategories: ["Light Switches", "Power Sockets", "Combination Units", "Smart Switches"] },
      { name: "Power Distribution", subcategories: ["Distribution Boards", "Surge Protectors", "Changeover Switch", "Circuit Breakers", "Bus Bar", "Fuse"] },
      { name: "Extensions & Adapters/Plugs", subcategories: ["Extension Box", "Industrial Plug", "Cable Logs", "Junction Box"] },
      { name: "Industrial Equipment", subcategories: ["Drill Machine", "Cable Cutter", "Goolves", "Black Tape", "Test Pen", "Screwdriver Set"] },
      { name: "Installation Material", subcategories: ["Drill Machine", "Cable Cutter", "Goolves", "Black Tape", "Test Pen", "Screwdriver Set"] },
      { name: "Others", subcategories: ["Electrical Tools", "Safety Equipment", "Wire & Cables", "Accessories"] },
    ],
    []
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target)) {
        setActiveCat(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setActiveCat(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openMega = (idx) => setActiveCat(idx);
  const closeMega = () => setActiveCat(null);
  const toggleMobile = () => setMobileOpen((v) => !v);

  return (
    <header ref={wrapperRef} className={`nb ${scrolled ? "nb--scrolled" : ""}`}>
      <div className="nb__top">
        <div className="nb__wrap">
          <button className="nb__burger" onClick={toggleMobile} aria-label="Open menu">
            <span />
            <span />
            <span />
          </button>

          <button className="nb__logo" onClick={goHome}>
            <span className="nb__logoMark">OME</span>
            <span className="nb__logoText">Electrical</span>
          </button>

          <div className="nb__search">
            <span className="nb__searchIcon" aria-hidden="true">⌕</span>
            <input className="nb__searchInput" placeholder="Search products, brands, categories..." />
            <button className="nb__searchBtn">Search</button>
          </div>

          <div className="nb__actions">
            <button className="nb__btn nb__btn--ghost" onClick={toggleChat}>
              💬 <span className="nb__btnText">Chat</span>
            </button>

            <button className="nb__btn nb__btn--ghost" onClick={handleAuthClick}>
              👤 <span className="nb__btnText">{user ? (user.displayName || "Profile") : "Login"}</span>
            </button>

            {user && (
             <button
                className="nb__btn nb__btn--ghost"
                onClick={() => (window.location.hash = "/profile")}
              >
                👤 <span className="nb__btnText">Profile</span>
              </button>
              )}

            <button
              className="nb__btn nb__btn--ghost"
              onClick={handleAdminClick}
            >
              Admin
            </button>

            <button
              className={`nb__btn nb__btn--primary ${pulse ? "nb__btn--pulse" : ""}`}
              onClick={openCart}
            >
              🛒 <span className="nb__btnText">Cart</span>
              {count > 0 && <span className="nb__count">{count}</span>}
            </button>
          </div>
        </div>
      </div>

      <nav className="nb__nav" onMouseLeave={closeMega}>
        <div className="nb__wrap nb__navWrap">
          <ul className="nb__cats">
            {categories.map((cat, idx) => (
              <li key={cat.name} className="nb__cat">
                <button
                  className={`nb__catBtn ${activeCat === idx ? "is-active" : ""}`}
                  onMouseEnter={() => openMega(idx)}
                  onFocus={() => openMega(idx)}
                  onClick={() => setActiveCat((v) => (v === idx ? null : idx))}
                >
                  {cat.name}
                  <span className={`nb__chev ${activeCat === idx ? "open" : ""}`}>▾</span>
                </button>

                {activeCat === idx && (
                  <div className="nb__mega">
                    <div className="nb__megaHead">
                      <p className="nb__megaTitle">{cat.name}</p>
                      <p className="nb__megaSub">Explore popular options in {cat.name.toLowerCase()}.</p>
                    </div>

                    <div className="nb__megaGrid">
                      {cat.subcategories.map((sub) => (
                        <button key={sub} className="nb__megaItem">
                          <span className="nb__megaDot" />
                          {sub}
                        </button>
                      ))}
                    </div>

                    <div className="nb__megaFoot">
                      <a className="nb__megaLink" href="#products">View all {cat.name}</a>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div className="nb__trustWrap">
            <div className="nb__trust">
              <span className="nb__trustPill">✅ Certified Products</span>
              <span className="nb__trustPill">⚡ Fast Delivery</span>
              <span className="nb__trustPill">🛡️ Safety Tested</span>
              <span className="nb__trustPill">🏆 Quality Materials</span>
              <span className="nb__trustPill">🔧 Expert Support</span>
            </div>
          </div>
        </div>
      </nav>

      <div className={`nb__drawer ${mobileOpen ? "open" : ""}`}>
        <div className="nb__drawerTop">
          <button className="nb__logo" onClick={goHome}>
            <span className="nb__logoMark">OME</span>
            <span className="nb__logoText">Electrical</span>
          </button>
        </div>

        <div className="nb__drawerSearch">
          <input className="nb__searchInput" placeholder="Search products..." />
          <button className="nb__searchBtn">Search</button>
        </div>

        <div className="nb__drawerActions">
          <button className="nb__btn nb__btn--ghost" onClick={toggleChat}>💬 Chat</button>

          <button className="nb__btn nb__btn--ghost" onClick={handleAuthClick}>
            👤 {user ? (user.displayName || "Profile") : "Login"}
          </button>

          {user && (
            <button className="nb__btn nb__btn--ghost" onClick={logout}>
              🚪 Logout
            </button>
          )}

          <button className="nb__btn nb__btn--primary" onClick={openCart}>
            🛒 Cart {count > 0 ? `(${count})` : ""}
          </button>
        </div>

        <div className="nb__drawerCats">
          {categories.map((cat) => (
            <details key={cat.name} className="nb__acc">
              <summary className="nb__accSum">{cat.name}</summary>
              <div className="nb__accBody">
                {cat.subcategories.map((sub) => (
                  <button key={sub} className="nb__accItem">{sub}</button>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>

      <div className={`nb__backdrop ${mobileOpen ? "show" : ""}`} onClick={() => setMobileOpen(false)} />
    </header>
  );
}

export default Navbar;