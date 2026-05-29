import "./ProductCard.css";
import { useCart } from "../../context/CartContext";

function ProductCard({ id, name, price, image, isNew }) {
  const { addToCart } = useCart();

  function handleAdd() {
    addToCart({ id: id || name, name, price: Number(String(price).replace(/[^0-9.]/g, '')) || 0, image });
  }

  return (
    <div className="product__card">
      {isNew && <span className="product__badge">New</span>}
      <div className="product__image">
        <img src={image} alt={name} />
      </div>

      <div className="product__info">
        <h3 className="product__name">{name}</h3>
        <p className="product__price">{price}</p>
        <button className="product__btn" onClick={handleAdd}>Add to Cart</button>
      </div>
    </div>
  );
}

export default ProductCard;
