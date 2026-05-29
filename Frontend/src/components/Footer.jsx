import { categories } from '../data/products';
import { Icons } from './Icons';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <a className="brand footer-brand" href="#/">
            <span className="brand-mark">OME</span>
            <span className="brand-text">Electrical</span>
          </a>
          <p className="footer-copy">
            Professional electrical retail for homes, projects, installers, and fast-moving commercial supply.
          </p>
        </div>

        <div>
          <h4>Shop</h4>
          <div className="footer-links">
            {categories.slice(0, 5).map((category) => (
              <a key={category.slug} href={`#/category/${category.slug}`}>{category.name}</a>
            ))}
          </div>
        </div>

        <div>
          <h4>Support</h4>
          <div className="footer-links">
            <a href="#/shop">All Products</a>
            <a href="#/cart">Cart</a>
            <a href="#/checkout">Checkout</a>
          </div>
        </div>

        <div>
          <h4>Why buyers stay</h4>
          <div className="footer-badges">
            <span><Icons.shield size={16} /> Secured checkout flow</span>
            <span><Icons.truck size={16} /> Fast Lagos dispatch</span>
            <span><Icons.bolt size={16} /> Installer-grade stock</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
