import { formatPrice } from '../../data/products';

export default function Cart({ cart, setRoute, auth }) {
  return (
    <main className="cart-page">
      <section className="cart-hero">
        <div>
          <p className="eyebrow">Dispatch cart</p>
          <h1>Your order, tuned for fast fulfillment.</h1>
          <p>Use the plus and minus controls to adjust quantities. Product IDs stay attached so dispatch can identify every item quickly.</p>
        </div>
        <div className="cart-count">
          <b>{cart.count}</b>
          <span>{cart.count === 1 ? 'item selected' : 'items selected'}</span>
        </div>
      </section>

      <section className="cart-layout">
        <div className="cart-panel">
          {cart.cart.length ? (
            cart.cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt="" />
                <div className="cart-item__info">
                  <small>{item.product_id || item.id}</small>
                  <b>{item.name}</b>
                  <span>{formatPrice(item.price)}</span>
                </div>
                <div className="qty-stepper" aria-label={`Quantity for ${item.name}`}>
                  <button type="button" onClick={() => cart.setQty(item.id, item.qty - 1)} aria-label="Decrease quantity">-</button>
                  <strong>{item.qty}</strong>
                  <button type="button" onClick={() => cart.setQty(item.id, item.qty + 1)} aria-label="Increase quantity">+</button>
                </div>
                <b className="line-total">{formatPrice(item.price * item.qty)}</b>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <h2>Your cart is empty</h2>
              <p>Explore the shop and add products for checkout.</p>
              <button onClick={() => setRoute('/shop')}>Go to shop</button>
            </div>
          )}
        </div>

        <aside className="summary cart-summary">
          <h3>Order summary</h3>
          <p>Subtotal <b>{formatPrice(cart.subtotal)}</b></p>
          <p>Delivery <b>Calculated at checkout</b></p>
          <h2>{formatPrice(cart.subtotal)}</h2>
          <button disabled={!cart.cart.length} onClick={() => auth.requireLogin('Login before checkout.') && setRoute('/checkout')}>
            Proceed to checkout
          </button>
          {cart.cart.length ? <button className="ghost cart-clear" onClick={cart.clear}>Clear cart</button> : null}
        </aside>
      </section>
    </main>
  );
}
