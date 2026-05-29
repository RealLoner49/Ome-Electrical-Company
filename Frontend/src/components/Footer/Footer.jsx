import "./Footer.css";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="ft">
      <div className="ft__wrap">
        {/* Top CTA / Newsletter */}
        <div className="ft__cta">
          <div className="ft__ctaText">
            <h3>Get deals & new stock updates</h3>
            <p>Weekly drops, best prices, no spam. Just electrical goodness ⚡</p>
          </div>

          <form className="ft__form" onSubmit={(e) => e.preventDefault()}>
            <input
              className="ft__input"
              type="email"
              placeholder="Enter your email"
              required
            />
            <button className="ft__btn" type="submit">
              Subscribe
            </button>
          </form>
        </div>

        {/* Main footer grid */}
        <div className="ft__grid">
          <div className="ft__brand">
            <div className="ft__logo">
              <span className="ft__logoMark">OME</span>
              <span className="ft__logoText">Electrical</span>
            </div>

            <p className="ft__desc">
              Premium electrical materials for homes, businesses, and contractors.
              Quality you can trust, delivery you can count on.
            </p>

            <div className="ft__contact">
              <p><span>📍</span> Lagos, Nigeria</p>
              <p><span>📞</span> +234 000 000 0000</p>
              <p><span>✉️</span> support@omeelectrical.com</p>
            </div>
          </div>

          <div className="ft__col">
            <h4>Shop</h4>
            <ul>
              <li><a href="#products">New Arrivals</a></li>
              <li><a href="#products">Trending</a></li>
              <li><a href="#products">Cables & Wires</a></li>
              <li><a href="#products">Switches & Sockets</a></li>
            </ul>
          </div>

          <div className="ft__col">
            <h4>Support</h4>
            <ul>
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#shipping">Shipping Info</a></li>
              <li><a href="#returns">Returns</a></li>
            </ul>
          </div>

          <div className="ft__col">
            <h4>Policies</h4>
            <ul>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms & Conditions</a></li>
              <li><a href="#cookies">Cookie Policy</a></li>
              <li><a href="#security">Security</a></li>
            </ul>
          </div>

          <div className="ft__col">
            <h4>Follow</h4>
            <div className="ft__social">
              <a className="ft__socialBtn" href="#" aria-label="Facebook">f</a>
              <a className="ft__socialBtn" href="#" aria-label="Twitter">x</a>
              <a className="ft__socialBtn" href="#" aria-label="Instagram">⌁</a>
              <a className="ft__socialBtn" href="#" aria-label="LinkedIn">in</a>
            </div>

            <div className="ft__trust">
              <span className="ft__pill">✅ Quality materials</span>
              <span className="ft__pill">⚡ Fast delivery</span>
              <span className="ft__pill">🔒 Secure checkout</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="ft__bottom">
          <p>© {year} OME Electrical. All rights reserved.</p>
          <p className="ft__small">
            Built for contractors, homes, and businesses ⚡
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;