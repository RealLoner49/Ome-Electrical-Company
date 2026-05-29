import { formatPrice } from '../data/products';
import { useCart } from '../context/CartContext';
import { Icons } from './Icons';

export default function ProductCard({ product, compact = false }) {
  const { addToCart } = useCart();

  return (
    <article className={`product-card ${compact ? 'compact' : ''}`}>
      <a href={`#/product/${product.id}`} className="product-card__image-wrap">
        <img className="product-card__image" src={product.image} alt={product.name} />
        <span className="product-badge">{product.badge}</span>
      </a>
      <div className="product-card__body">
        <p className="product-card__meta">{product.stock}</p>
        <a href={`#/product/${product.id}`} className="product-card__name">{product.name}</a>
        <p className="product-card__description">{product.description}</p>
        <div className="product-card__rating"><Icons.star size={16} /> {product.rating} rating</div>
        <div className="product-card__footer">
          <div>
            <strong>{formatPrice(product.price)}</strong>
            <span>{product.eta}</span>
          </div>
          <button className="primary-btn" onClick={() => addToCart(product)}>
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}
