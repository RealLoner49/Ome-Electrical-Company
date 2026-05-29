import { useMemo, useState, useEffect } from 'react';
import { categories } from '../data/products';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Icons } from './Icons';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const { count } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { user, logout, setAuthModalOpen, setAuthMessage } = useAuth();

  const categoryLinks = useMemo(() => categories.slice(0, 6), []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 980 && mobileOpen) {
        setMobileOpen(false);
      }
    };

    window.addEventListener('resize', onResize, { passive: true });

    return () => window.removeEventListener('resize', onResize);
  }, [mobileOpen]);

  function openLogin() {
    setAuthMessage(
      'Login to manage your orders and continue securely to payment.'
    );

    setAuthModalOpen(true);
  }

  return (
    <header className="site-header">
      <div className="shell header-top">
        <a className="brand" href="#/" aria-label="OME Electrical home">
          <span className="brand-logo">
            <span>⚡</span>
          </span>

          <span className="brand-word">
            <strong>OME</strong>
            <small>Electrical</small>
          </span>
        </a>

        <div className="header-search">
          <Icons.search size={18} />

          <input
            type="search"
            placeholder="Search products, brands, categories..."
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                window.location.hash = `#/shop?search=${encodeURIComponent(
                  event.currentTarget.value
                )}`;
              }
            }}
          />
        </div>

        <button
          className="icon-btn with-label"
          onClick={() => (window.location.hash = '/profile')}
          aria-label="Open profile"
        >
          👤 <span>Profile</span>
        </button>

        <div className="header-actions">
          <button
            className="icon-btn"
            onClick={toggleTheme}
            aria-label="Toggle color theme"
          >
            {theme === 'dark' ? (
              <Icons.sun size={18} />
            ) : (
              <Icons.moon size={18} />
            )}
          </button>

          <a className="icon-btn with-label" href="#/shop">
            <Icons.search size={18} />
            <span>Shop</span>
          </a>

          {user ? (
            <button
              className="icon-btn with-label account-pill"
              onClick={logout}
              title={user.email}
            >
              <span className="account-avatar">
                {(user.displayName || user.email || 'U')
                  .charAt(0)
                  .toUpperCase()}
              </span>

              <span>Logout</span>
            </button>
          ) : (
            <button
              className="icon-btn with-label account-pill"
              onClick={openLogin}
            >
              <span className="account-avatar">U</span>
              <span>Login</span>
            </button>
          )}

          <a
            className="icon-btn with-label"
            href="#/admin-payments"
          >
            🔐 <span>Admin</span>
          </a>

          <a
            className="icon-btn with-label cart-pill"
            href="#/cart"
          >
            <Icons.cart size={18} />
            <span>Cart</span>
            <strong>{count}</strong>
          </a>

          <button
            className={`hamburger-btn mobile-only ${
              mobileOpen ? 'open' : ''
            }`}
            onClick={() => setMobileOpen((state) => !state)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <div
          className="header-microbar"
          aria-label="Store highlights"
        >
          <span>Certified products</span>
          <span>Same-day dispatch</span>
          <span>Tested & Verified for Safety</span>
          <span>Safe for Home & Industrial Use</span>
          <span>Professional Electrical Solutions</span>
          <span>Built for Real-World Use</span>
          <span>Secure checkout</span>
        </div>
      </div>

      <div
        className={`nav-backdrop ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      <div className={`header-nav ${mobileOpen ? 'open' : ''}`}>
        <div className="shell nav-row">
          <div className="mobile-menu-head">
            <span className="brand-mark">OME</span>

            <div>
              <strong>Quick Menu</strong>
              <small>Shop by category</small>
            </div>
          </div>

          <a
            href="#/shop"
            onClick={() => setMobileOpen(false)}
          >
            All Products
          </a>

          {categoryLinks.map((category) => (
            <a
              key={category.slug}
              href={`#/category/${category.slug}`}
              onClick={() => setMobileOpen(false)}
            >
              {category.name}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}