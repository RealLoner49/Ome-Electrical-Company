import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { formatPrice, getProductById, getCategoryBySlug } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { Icons } from '../../components/Icons';

export default function Product({ productId }) {
  const product = getProductById(productId);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    window.location.hash = '#/shop';
    return null;
  }

  const category = getCategoryBySlug(product.category);

  return (
    <>
      <Navbar />
      <main className="shell page-main">
        <section className="product-view">
          <div className="card product-gallery">
            <img src={product.image} alt={product.name} />
          </div>
          <div className="card product-panel">
            <span className="eyebrow">{category?.name}</span>
            <h1>{product.name}</h1>
            <p className="product-detail__desc">{product.description}</p>
            <div className="product-detail__meta">
              <span><Icons.star size={16} /> {product.rating} rating</span>
              <span>{product.stock}</span>
              <span>SKU {product.sku}</span>
            </div>
            <div className="product-price-row">
              <strong>{formatPrice(product.price)}</strong>
              <span>{product.eta}</span>
            </div>
            <div className="qty-row">
              <button onClick={() => setQuantity((qty) => Math.max(1, qty - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((qty) => qty + 1)}>+</button>
            </div>
            <div className="hero-actions">
              <button className="primary-btn" onClick={() => addToCart(product, quantity)}>Add to cart</button>
              <a className="secondary-btn" href="#/cart">Go to cart</a>
            </div>

            <div className="specs-grid">
              {Object.entries(product.specs).map(([label, value]) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
