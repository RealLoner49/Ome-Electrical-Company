import { useState } from 'react';
import { ADMIN_EMAIL } from '../../libSupabaseRest';
import { formatPrice } from '../../data/products';
import { useOrders } from '../../context/OrderContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import './Orders.css';

const statuses = ['pending', 'payment-received', 'processing', 'delivered', 'cancelled'];
const routeLabels = {
  paystack: 'Paystack',
  transfer: 'Local transfer',
  delivery: 'Pay on delivery',
};

function statusLabel(status) {
  return status.replace('-', ' ');
}

function routeKey(order) {
  if (order.methodKey) return order.methodKey;
  const method = (order.method || '').toLowerCase();
  if (method.includes('transfer')) return 'transfer';
  if (method.includes('delivery')) return 'delivery';
  return 'paystack';
}

export default function Orders({ auth }) {
  const { orders, updateOrderStatus, hideOrderForAdmin, clearOrders } = useOrders();
  const toast = useToast();
  const [statusDrafts, setStatusDrafts] = useState({});
  const adminOrders = orders.filter((order) => !order.adminDeleted);
  const pending = adminOrders.filter((order) => order.status === 'pending').length;
  const totalValue = adminOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const paystackCount = adminOrders.filter((order) => routeKey(order) === 'paystack').length;
  const transferCount = adminOrders.filter((order) => routeKey(order) === 'transfer').length;
  const deliveryCount = adminOrders.filter((order) => routeKey(order) === 'delivery').length;

  const handleDeleteOrder = async (order) => {
    const confirmed = await toast?.showConfirm?.(
      `Delete order ${order.ref}?`,
      { type: 'error', cancelLabel: 'Cancel', confirmLabel: 'Delete' }
    );

    if (!confirmed) return;

    hideOrderForAdmin(order.id);
    toast?.showToast?.(`${order.ref} removed from admin orders. Customer can still see it.`, 'info');
  };

  const handleStatusChange = (order) => {
    const nextStatus = statusDrafts[order.id];
    if (!nextStatus) {
      toast?.showToast?.('Choose a status before updating this order.', 'info');
      return;
    }

    if (nextStatus === order.status) {
      toast?.showToast?.(`${order.ref} is already ${statusLabel(nextStatus)}.`, 'info');
      return;
    }

    updateOrderStatus(order.id, nextStatus);
    setStatusDrafts((current) => ({ ...current, [order.id]: '' }));
    toast?.showToast?.(`${order.ref} marked as ${statusLabel(nextStatus)}.`, 'success');
  };

  if (!auth.isAdmin) {
    return (
      <main className="orders-page">
        <section className="orders-gate">
          <p className="eyebrow">Orders access</p>
          <h1>Sign in with the admin email to view orders.</h1>
          <p>Use the admin account configured as {ADMIN_EMAIL}.</p>
          <button
            onClick={() => {
              auth.setAuthMode('login');
              auth.setAuthOpen(true);
            }}
          >
            Admin login
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="orders-page">
      <section className="orders-hero">
        <div>
          <p className="eyebrow">Order context</p>
          <h1>Track checkout requests without mixing them with products.</h1>
          <p>Orders submitted from checkout are saved here for the logged-in admin on this browser.</p>
        </div>
        <div className="orders-live-card">
          <span>Admin</span>
          <b>{auth.user?.email}</b>
          <small>{adminOrders.length} order{adminOrders.length === 1 ? '' : 's'} saved</small>
        </div>
      </section>

      <section className="orders-metrics">
        <article>
          <b>{adminOrders.length}</b>
          <span>Total orders</span>
        </article>
        <article>
          <b>{pending}</b>
          <span>Pending</span>
        </article>
        <article>
          <b>{formatPrice(totalValue)}</b>
          <span>Order value</span>
        </article>
        <article>
          <b>{paystackCount}</b>
          <span>Paystack</span>
        </article>
        <article>
          <b>{transferCount}</b>
          <span>Local transfer</span>
        </article>
        <article>
          <b>{deliveryCount}</b>
          <span>Pay on delivery</span>
        </article>
      </section>

      <section className="orders-panel">
        <div className="orders-panel-head">
          <div>
            <p className="eyebrow">Checkout queue</p>
            <h2>Orders</h2>
          </div>
          <button className="ghost" disabled={!adminOrders.length} onClick={clearOrders}>
            Clear orders
          </button>
        </div>

        {!adminOrders.length ? (
          <div className="orders-empty">
            <h3>No orders yet</h3>
            <p>When a customer completes checkout, the order will show up here.</p>
          </div>
        ) : (
          <div className="orders-list">
            {adminOrders.map((order) => (
              <article className="order-card" key={order.id}>
                <div className="order-card-head">
                  <div>
                    <div className="order-badges">
                      <span className={`order-status order-status--${order.status}`}>
                        {statusLabel(order.status)}
                      </span>
                      <span className={`payment-route payment-route--${routeKey(order)}`}>
                        Customer selected {routeLabels[routeKey(order)]}
                      </span>
                    </div>
                    <h3>{order.ref}</h3>
                    <p>{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <strong>{formatPrice(order.total || 0)}</strong>
                </div>

                <section className="order-block">
                  <div className="order-block-head">
                    <span>Customer form details</span>
                    <b>What the buyer entered at checkout</b>
                  </div>

                  <div className="order-customer">
                    <p><span>Full name</span><b>{order.customer?.name || 'Not provided'}</b></p>
                    <p><span>Email</span><b>{order.customer?.email || 'Not provided'}</b></p>
                    <p><span>Phone</span><b>{order.customer?.phone || 'Not provided'}</b></p>
                    <p className="order-payment-cell"><span>Payment selected</span><b>{order.method}</b><small>{order.paymentNote}</small></p>
                    <p><span>Payment ref</span><b>{order.paymentReference || order.ref}</b></p>
                    <p><span>Delivery route</span><b>{order.delivery?.label || 'Not provided'}</b></p>
                    <p><span>Delivery fee</span><b>{formatPrice(order.deliveryFee || 0)}</b></p>
                    <p><span>ETA selected</span><b>{order.delivery?.eta || 'Not provided'}</b></p>
                    <p><span>Delivery note</span><b>{order.delivery?.note || 'None'}</b></p>
                    <p className="order-wide"><span>Delivery address</span><b>{order.customer?.address || 'Not provided'}</b></p>
                    <p className="order-wide"><span>Rider note / landmark</span><b>{order.customer?.note || 'No rider note added'}</b></p>
                  </div>
                </section>

                <section className="order-block">
                  <div className="order-block-head">
                    <span>Products ordered</span>
                    <b>{order.items?.length || 0} item{order.items?.length === 1 ? '' : 's'} in this order</b>
                  </div>

                  <div className="order-items">
                    {order.items?.map((item) => (
                      <div className="order-item" key={`${order.id}-${item.id}`}>
                        <span>{item.qty}x</span>
                        <div>
                          <b>{item.name}</b>
                          <small>{item.product_id || item.id}</small>
                        </div>
                        <small>{formatPrice(item.price)} each</small>
                        <strong>{formatPrice(item.price * item.qty)}</strong>
                      </div>
                    ))}
                  </div>

                  <div className="order-total-box">
                    <p><span>Subtotal</span><b>{formatPrice(order.subtotal || 0)}</b></p>
                    <p><span>Delivery</span><b>{formatPrice(order.deliveryFee || 0)}</b></p>
                    <p><span>Total</span><b>{formatPrice(order.total || 0)}</b></p>
                  </div>
                </section>

                {order.feedback && (
                  <section className="order-feedback">
                    <span>Customer feedback</span>
                    <b>{order.feedback.rating}/5 rating</b>
                    <p>{order.feedback.message}</p>
                  </section>
                )}

                <div className="order-actions">
                  <div className="order-status-control">
                    <label htmlFor={`status-${order.id}`}>Admin status update</label>
                    <select
                      id={`status-${order.id}`}
                      value={statusDrafts[order.id] || ''}
                      onChange={(event) => setStatusDrafts((current) => ({ ...current, [order.id]: event.target.value }))}
                    >
                      <option value="">Choose new status</option>
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {statusLabel(status)}{status === order.status ? ' - current' : ''}
                        </option>
                      ))}
                    </select>
                    <button onClick={() => handleStatusChange(order)}>
                      Update status
                    </button>
                  </div>
                  <button
                    className="order-delete-button"
                    onClick={() => handleDeleteOrder(order)}
                  >
                    delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
