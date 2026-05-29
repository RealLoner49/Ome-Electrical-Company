import { useState } from 'react';
import { formatPrice } from '../../data/products';
import { useOrders } from '../../context/OrderContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import './MyOrders.css';

const FEEDBACK_ENDPOINT = 'https://formspree.io/f/xqejlwkw';
const FEEDBACK_RECIPIENT = 'omeelectrical28@gmail.com';

const statusMessages = {
  pending: 'Your order has been received. Admin will review it shortly.',
  processing: 'Your order is being processed. We will contact you before dispatch.',
  delivered: "We've delivered your order. Give us feedback on how our product is.",
  cancelled: 'This order has been cancelled. Contact support if this looks wrong.',
};

function statusLabel(status) {
  return status.replace('-', ' ');
}

function statusMessage(order) {
  if (order.status === 'payment-received') {
    return `Payment received. You will receive the order in ${order.delivery?.eta || 'the estimated arrival window you selected'}.`;
  }

  return statusMessages[order.status] || statusMessages.pending;
}

function productSummary(order) {
  return (order.items || [])
    .map((item) => `${item.qty} x ${item.name} (${item.product_id || item.id})`)
    .join('\n');
}

export default function MyOrders({ auth }) {
  const { orders, addFeedback, deleteOrderForCustomer } = useOrders();
  const toast = useToast();
  const [feedbackDrafts, setFeedbackDrafts] = useState({});
  const email = auth.user?.email?.toLowerCase();
  const customerOrders = orders.filter((order) =>
    !order.customerDeleted && [order.accountEmail, order.customer?.email].some((entry) => entry?.toLowerCase() === email)
  );

  const updateFeedback = (orderId, field, value) => {
    setFeedbackDrafts((current) => ({
      ...current,
      [orderId]: { rating: '5', message: '', ...(current[orderId] || {}), [field]: value },
    }));
  };

  const submitFeedback = async (event, order) => {
    event.preventDefault();
    const feedback = { rating: '5', usageDuration: '', message: '', ...(feedbackDrafts[order.id] || {}) };

    if (!feedback.message.trim()) {
      toast?.showToast?.('Please write a short feedback message.', 'info');
      return;
    }

    const formData = new FormData();
    formData.append('recipient', FEEDBACK_RECIPIENT);
    formData.append('_subject', `Product feedback for ${order.ref}`);
    formData.append('source', 'OME Electrical My Orders feedback');
    formData.append('order_ref', order.ref);
    formData.append('customer_email', auth.user.email);
    formData.append('rating', `${feedback.rating}/5`);
    formData.append('usage_duration', feedback.usageDuration || 'Not specified');
    formData.append('products', productSummary(order));
    formData.append('message', feedback.message.trim());

    try {
      const response = await fetch(FEEDBACK_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) throw new Error('Feedback email failed.');

      addFeedback(order.id, {
        rating: feedback.rating,
        usageDuration: feedback.usageDuration,
        message: feedback.message.trim(),
        customerEmail: auth.user.email,
      });
      setFeedbackDrafts((current) => ({ ...current, [order.id]: { rating: '5', usageDuration: '', message: '' } }));
      toast?.showToast?.('Thank you. Your feedback has been emailed to OME Electrical.', 'success');
    } catch {
      toast?.showToast?.('Feedback could not be emailed. Please try again or send it from Contact.', 'error');
    }
  };

  const handleCustomerDelete = async (order) => {
    if (order.status !== 'delivered') {
      toast?.showToast?.('This order cannot be deleted yet. Admin must mark it as delivered first.', 'info');
      return;
    }

    const confirmed = await toast?.showConfirm?.(
      `Are you sure you want to delete order ${order.ref}?`,
      { type: 'error', cancelLabel: 'Cancel', confirmLabel: 'Delete order' }
    );

    if (!confirmed) return;

    deleteOrderForCustomer(order.id);
    toast?.showToast?.(`${order.ref} deleted from your orders.`, 'info');
  };

  if (!auth.user) {
    return (
      <main className="my-orders-page">
        <section className="my-orders-empty">
          <p className="eyebrow">Order status</p>
          <h1>Login to view your order updates.</h1>
          <button
            onClick={() => {
              auth.setAuthMode('login');
              auth.setAuthOpen(true);
            }}
          >
            Login
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="my-orders-page">
      <section className="my-orders-hero">
        <div>
          <p className="eyebrow">My orders</p>
          <h1>Follow your order status from checkout to delivery.</h1>
          <p>Updates made by admin appear here for orders submitted with {auth.user.email}.</p>
        </div>
        <div className="my-orders-count">
          <span>Orders</span>
          <b>{customerOrders.length}</b>
        </div>
      </section>

      {!customerOrders.length ? (
        <section className="my-orders-empty">
          <h2>No orders found</h2>
          <p>Orders placed with this email will appear here after checkout.</p>
          <button onClick={() => (location.hash = '#/shop')}>Shop products</button>
        </section>
      ) : (
        <section className="my-orders-list">
          {customerOrders.map((order) => (
            <article className="my-order-card" key={order.id}>
              <div className="my-order-head">
                <div>
                  <span className={`my-order-status my-order-status--${order.status}`}>
                    {statusLabel(order.status)}
                  </span>
                  <h2>{order.ref}</h2>
                  <p>{statusMessage(order)}</p>
                </div>
                <strong>{formatPrice(order.total || 0)}</strong>
              </div>

              <div className="my-order-state">
                <span>Current state</span>
                <b>{statusLabel(order.status)}</b>
                <p>{statusMessage(order)}</p>
              </div>

              <div className="my-order-grid">
                <p><span>Payment</span><b>{order.method}</b></p>
                <p><span>Delivery route</span><b>{order.delivery?.label}</b></p>
                <p><span>ETA</span><b>{order.delivery?.eta}</b></p>
                <p><span>Address</span><b>{order.customer?.address}</b></p>
              </div>

              <div className="my-order-products-head">
                <span>Products ordered</span>
                <b>{order.items?.length || 0} product{order.items?.length === 1 ? '' : 's'}</b>
              </div>

              <div className="my-order-products">
                {order.items?.map((item) => (
                  <article className="my-order-product" key={`${order.id}-${item.id}`}>
                    <img src={item.image} alt={item.name} />
                    <div>
                      <span className={`my-order-product-state my-order-product-state--${order.status}`}>
                        {statusLabel(order.status)}
                      </span>
                      <h3>{item.name}</h3>
                      <p>{item.product_id || item.id}</p>
                      <small>{item.qty} x {formatPrice(item.price)}</small>
                    </div>
                    <strong>{formatPrice(item.price * item.qty)}</strong>
                  </article>
                ))}
              </div>

              {order.status === 'delivered' && (
                <section className="my-feedback-panel">
                  <div>
                    <span>Feedback</span>
                    <h3>How was your product?</h3>
                    <p>Tell us what you think about the item and delivery experience.</p>
                  </div>

                  {order.feedback ? (
                    <div className="my-feedback-saved">
                      <b>{order.feedback.rating}/5 rating</b>
                      {order.feedback.usageDuration && <span>Used for {order.feedback.usageDuration}</span>}
                      <p>{order.feedback.message}</p>
                    </div>
                  ) : (
                    <form className="my-feedback-form" onSubmit={(event) => submitFeedback(event, order)}>
                      <select
                        value={feedbackDrafts[order.id]?.rating || '5'}
                        onChange={(event) => updateFeedback(order.id, 'rating', event.target.value)}
                      >
                        <option value="5">5 - Excellent</option>
                        <option value="4">4 - Good</option>
                        <option value="3">3 - Okay</option>
                        <option value="2">2 - Poor</option>
                        <option value="1">1 - Bad</option>
                      </select>
                      <select
                        value={feedbackDrafts[order.id]?.usageDuration || ''}
                        onChange={(event) => updateFeedback(order.id, 'usageDuration', event.target.value)}
                      >
                        <option value="">How long has it lasted?</option>
                        <option>Less than 1 month</option>
                        <option>1-3 months</option>
                        <option>3-6 months</option>
                        <option>More than 6 months</option>
                      </select>
                      <textarea
                        placeholder="Tell us how the product is lasting, what worked well, or what should be improved..."
                        value={feedbackDrafts[order.id]?.message || ''}
                        onChange={(event) => updateFeedback(order.id, 'message', event.target.value)}
                      />
                      <button>Submit feedback</button>
                    </form>
                  )}
                </section>
              )}

              <div className="my-order-actions">
                <button
                  type="button"
                  className="my-order-delete"
                  onClick={() => handleCustomerDelete(order)}
                >
                  Delete order
                </button>
                {order.status !== 'delivered' && (
                  <span>Available after admin marks the order delivered.</span>
                )}
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
