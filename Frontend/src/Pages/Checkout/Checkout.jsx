import { useMemo, useState } from 'react';
import { formatPrice } from '../../data/products';
import { PAYSTACK_PUBLIC_KEY } from '../../libSupabaseRest';
import { useToast } from '../../context/ToastContext.jsx';
import { useOrders } from '../../context/OrderContext.jsx';
import { notifyAdminOrder } from '../../services/api.js';
import './Checkout.css';

const ADMIN_NOTIFICATION_EMAIL = 'omeelectrical28@gmail.com';

const deliveryZones = [
  {
    id: 'pickup',
    label: 'Pickup from store',
    short: 'Pickup',
    fee: 0,
    eta: 'Same day after stock confirmation',
    note: 'Customer picks up. No rider or logistics fee added.',
    promise: 'Your order can be picked up once stock is confirmed. We will call before pickup.',
  },
  {
    id: 'lagos-close',
    label: 'Lagos close dispatch',
    short: 'Close Lagos',
    fee: 2500,
    eta: '2-3 days',
    note: 'For nearby Lagos areas with normal rider distance.',
    promise: 'Your order will arrive in 2-3 days. We will place a call across when we get to the destination given by you.',
  },
  {
    id: 'lagos-far',
    label: 'Far Lagos / outskirts',
    short: 'Far Lagos',
    fee: 6000,
    eta: '3-5 days',
    note: 'For Ikorodu, Ajah, Epe, Badagry, outskirts and longer rider routes.',
    promise: 'Your order will arrive in 3-5 days. We will call before dispatch and again when the rider gets close to your destination.',
  },
  {
    id: 'interstate',
    label: 'Inter-state delivery',
    short: 'Inter-state',
    fee: 12000,
    eta: '5-10 days',
    note: 'Base logistics deposit. Admin can confirm extra waybill cost before dispatch.',
    promise: 'Your order will arrive in 5-10 days depending on the state and transport company. Admin will confirm waybill details before dispatch.',
  },
];

const paymentRoutes = {
  paystack: { label: 'Paystack card', adminNote: 'Customer selected Paystack card checkout.' },
  transfer: { label: 'Local transfer', adminNote: 'Customer selected local bank transfer.' },
  delivery: { label: 'Pay on delivery', adminNote: 'Customer selected pay on delivery.' },
};

function uid(prefix = 'OME') {
  return `${prefix}-${Math.random().toString(36).slice(2, 7).toUpperCase()}-${Date.now().toString().slice(-5)}`;
}

function buildOrderLines(items) {
  if (!items.length) return 'No items selected';

  return items
    .map((item) => {
      const productCode = item.product_id || item.id;
      return `${item.qty} x ${item.name} (${productCode}) - ${formatPrice(item.price * item.qty)}`;
    })
    .join('\n');
}

export default function Checkout({ cart, auth }) {
  const toast = useToast();
  const orders = useOrders();
  const [method, setMethod] = useState('paystack');
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    delivery: 'lagos-close',
    note: '',
  });
  const [orderStatus, setOrderStatus] = useState(null);
  const ref = useMemo(() => uid('ORDER'), []);
  const selectedZone = deliveryZones.find((zone) => zone.id === customer.delivery) || deliveryZones[1];
  const deliveryFee = selectedZone.fee;
  const total = cart.subtotal + deliveryFee;

  const setField = (field, value) => setCustomer((current) => ({ ...current, [field]: value }));

  const bankDetails = {
    bank: 'Opay Digital',
    account: '8037601699',
    name: 'OME Electrical Company',
  };

  const adminOrderMessage = useMemo(() => {
    const adminReplyTemplate = `Payment received for ${ref}. Your order is being processed. ${selectedZone.promise}`;
    const lines = [
      `Order ref / narration: ${ref}`,
      `Payment route: ${method === 'transfer' ? 'Local transfer' : method === 'delivery' ? 'Pay on delivery' : 'Paystack card'}`,
      `Customer: ${customer.name || 'Not filled yet'}`,
      `Phone: ${customer.phone || 'Not filled yet'}`,
      `Email: ${customer.email || 'Not filled yet'}`,
      `Delivery zone: ${selectedZone.label}`,
      `Delivery fee: ${formatPrice(deliveryFee)}`,
      `Delivery ETA: ${selectedZone.eta}`,
      `Address: ${customer.address || 'Not filled yet'}`,
      customer.note ? `Rider note: ${customer.note}` : null,
      '',
      'Items:',
      buildOrderLines(cart.cart),
      '',
      `Subtotal: ${formatPrice(cart.subtotal)}`,
      `Total to confirm: ${formatPrice(total)}`,
      '',
      `Admin reply after confirming payment: ${adminReplyTemplate}`,
    ].filter(Boolean);

    if (method === 'transfer') {
      lines.push('', `Bank narration customer should use: ${ref}`, 'Please match this ref with the bank alert/receipt.');
    }

    if (method === 'delivery') {
      lines.push('', 'Please call the customer first, confirm stock, delivery fee and payment on arrival.');
    }

    return encodeURIComponent(`Hello OME Electrical,\n${lines.join('\n')}`);
  }, [cart.cart, cart.subtotal, customer, deliveryFee, method, ref, selectedZone.eta, selectedZone.label, selectedZone.promise, total]);

  const whatsappOrderUrl = `https://wa.me/2348037601699?text=${adminOrderMessage}`;

  const openWhatsAppOrder = () => {
    const opened = window.open(whatsappOrderUrl, '_blank', 'noopener,noreferrer');
    if (!opened) {
      toast?.showToast?.('WhatsApp popup was blocked. Use the WhatsApp button on the order status card.', 'info');
    }
  };

  const loadPaystack = () =>
    new Promise((resolve, reject) => {
      if (window.PaystackPop) return resolve(window.PaystackPop);

      const existing = document.querySelector('script[src="https://js.paystack.co/v1/inline.js"]');
      if (existing) {
        existing.addEventListener('load', () => resolve(window.PaystackPop), { once: true });
        existing.addEventListener('error', reject, { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.onload = () => resolve(window.PaystackPop);
      script.onerror = reject;
      document.body.appendChild(script);
    });

  const validate = () => {
    if (!cart.cart.length) {
      toast?.showToast?.('Your cart is empty.', 'error');
      return false;
    }

    if (!customer.name || !customer.email || !customer.phone || !customer.address) {
      toast?.showToast?.('Please complete your delivery details.', 'error');
      return false;
    }

    return true;
  };

  const notifyAdmin = async (order) => {
    try {
      await notifyAdminOrder({
        adminEmail: ADMIN_NOTIFICATION_EMAIL,
        subject: `New OME order ${order.ref}`,
        order,
      });
    } catch (error) {
      console.warn('Admin email notification failed:', error);
    }
  };

  const saveOrder = (status = 'pending', paymentReference = ref, paymentNote = paymentRoutes[method].adminNote, shouldNotifyAdmin = false) => {
    const order = {
      id: ref,
      ref,
      accountEmail: auth?.user?.email || customer.email,
      status,
      method: paymentRoutes[method].label,
      methodKey: method,
      paymentNote,
      paymentReference,
      customer: { ...customer },
      delivery: selectedZone,
      items: cart.cart.map((item) => ({ ...item })),
      subtotal: cart.subtotal,
      deliveryFee,
      total,
    };

    orders?.addOrder?.(order);
    if (shouldNotifyAdmin) notifyAdmin(order);
  };

  const goToMyOrders = () => {
    location.hash = '#/my-orders';
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (method === 'paystack') {
      if (!PAYSTACK_PUBLIC_KEY) {
        toast?.showToast?.('Paystack public key is missing.', 'error');
        return;
      }

      try {
        saveOrder('pending', ref, 'Customer selected Paystack. Waiting for payment confirmation.');
        const PaystackPop = await loadPaystack();
        PaystackPop.setup({
          key: PAYSTACK_PUBLIC_KEY,
          email: customer.email,
          amount: total * 100,
          currency: 'NGN',
          ref,
          metadata: {
            custom_fields: [
              { display_name: 'Customer Name', variable_name: 'customer_name', value: customer.name },
              { display_name: 'Phone', variable_name: 'phone', value: customer.phone },
              { display_name: 'Address', variable_name: 'address', value: customer.address },
              { display_name: 'Delivery Zone', variable_name: 'delivery_zone', value: selectedZone.label },
              { display_name: 'Delivery Fee', variable_name: 'delivery_fee', value: formatPrice(deliveryFee) },
            ],
          },
          callback: (response) => {
            saveOrder('pending', response.reference, 'Paystack payment was successful. Waiting for admin status update.', true);
            setOrderStatus({
              type: 'paystack',
              title: 'Payment received',
              text: `Your Paystack payment was successful. Reference: ${response.reference}`,
            });
            toast?.showToast?.(`Payment successful. Ref: ${response.reference}`, 'success');
            cart.clear(true);
            goToMyOrders();
          },
          onClose: () => toast?.showToast?.('Paystack payment window closed.', 'info'),
        }).openIframe();
      } catch {
        toast?.showToast?.('Could not load Paystack. Check your internet connection.', 'error');
      }
      return;
    }

    if (method === 'transfer') {
      saveOrder('pending', ref, 'Customer selected local transfer. Waiting for bank alert or receipt confirmation.', true);
      setOrderStatus({
        type: 'transfer',
        title: 'Transfer order reserved',
        text: `Transfer ${formatPrice(total)} and use ${ref} as narration. WhatsApp is opening with the full order, then you can attach your payment evidence in that same chat.`,
      });
      openWhatsAppOrder();
      toast?.showToast?.(`Transfer order reserved. Use ${ref} as narration.`, 'success');
      cart.clear(true);
      goToMyOrders();
      return;
    }

    saveOrder('pending', ref, 'Customer selected pay on delivery. Call before dispatch.', true);
    setOrderStatus({
      type: 'delivery',
      title: 'Pay on Delivery request placed',
      text: `WhatsApp is opening with the full order. Admin will call ${customer.phone} to confirm stock, delivery fee, and rider timing.`,
    });
    openWhatsAppOrder();
    toast?.showToast?.(`Pay on delivery request placed. Ref: ${ref}`, 'success');
    cart.clear(true);
    goToMyOrders();
  };

  return (
    <main className="checkout-page">
      <section className="checkout-hero">
        <div>
          <p className="eyebrow">Checkout command</p>
          <h1>Lock the order and route it for delivery.</h1>
          <p>Pay securely with Paystack, reserve with local transfer, or choose Pay on Delivery for eligible orders.</p>
        </div>
        <div className="checkout-ref">
          <span>Order ref</span>
          <b>{ref}</b>
          <small>{cart.count} item{cart.count === 1 ? '' : 's'} in cart</small>
        </div>
      </section>

      {orderStatus && (
        <section className={`checkout-card checkout-status checkout-status--${orderStatus.type}`}>
          <div>
            <p className="eyebrow">Order status</p>
            <h2>{orderStatus.title}</h2>
            <p>{orderStatus.text}</p>
          </div>
          {(orderStatus.type === 'transfer' || orderStatus.type === 'delivery') && (
            <a href={`https://wa.me/2348037601699?text=${adminOrderMessage}`} target="_blank" rel="noreferrer">
              Send full order to admin
            </a>
          )}
          <button type="button" onClick={() => (location.hash = '#/my-orders')}>
            View order status
          </button>
        </section>
      )}

      <section className="checkout-layout">
        <form className="checkout-card checkout-form-pro" onSubmit={submit}>
          <div className="checkout-section-head">
            <p className="eyebrow">Delivery details</p>
            <h2>Where should this go?</h2>
          </div>

          <div className="checkout-form-grid">
            <input required placeholder="Full name" value={customer.name} onChange={(e) => setField('name', e.target.value)} />
            <input required type="email" placeholder="Email address" value={customer.email} onChange={(e) => setField('email', e.target.value)} />
          </div>

          <div className="checkout-form-grid">
            <input required placeholder="Phone number" value={customer.phone} onChange={(e) => setField('phone', e.target.value)} />
            <select required value={customer.delivery} onChange={(e) => setField('delivery', e.target.value)}>
              {deliveryZones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.label} - {formatPrice(zone.fee)}
                </option>
              ))}
            </select>
          </div>

          <div className="delivery-fee-panel">
            <div>
              <span>Selected delivery route</span>
              <b>{selectedZone.label}</b>
              <small>{selectedZone.note}</small>
            </div>
            <strong>{formatPrice(deliveryFee)}</strong>
          </div>

          <div className="delivery-eta-panel">
            <span>Estimated arrival</span>
            <b>{selectedZone.eta}</b>
            <p>{selectedZone.promise}</p>
          </div>

          <input required placeholder="Delivery address" value={customer.address} onChange={(e) => setField('address', e.target.value)} />
          <textarea placeholder="Rider note: nearest bus stop, landmark, preferred time" value={customer.note} onChange={(e) => setField('note', e.target.value)}></textarea>

          <div className="checkout-section-head">
            <p className="eyebrow">Payment method</p>
            <h2>Choose payment route</h2>
          </div>

          <div className="payment-options payment-options--three">
            <label className={method === 'paystack' ? 'payment-option active' : 'payment-option'}>
              <input type="radio" checked={method === 'paystack'} onChange={() => setMethod('paystack')} />
              <b>Paystack card</b>
              <span>Card, bank, transfer, USSD and test mode popup.</span>
            </label>
            <label className={method === 'transfer' ? 'payment-option active' : 'payment-option'}>
              <input type="radio" checked={method === 'transfer'} onChange={() => setMethod('transfer')} />
              <b>Local transfer</b>
              <span>Transfer, use the order ref, then send the full order to WhatsApp.</span>
            </label>
            <label className={method === 'delivery' ? 'payment-option active' : 'payment-option'}>
              <input type="radio" checked={method === 'delivery'} onChange={() => setMethod('delivery')} />
              <b>Pay on delivery</b>
              <span>Admin calls first, then rider collects cash or transfer.</span>
            </label>
          </div>

          {method === 'transfer' && (
            <div className="transfer-box payment-detail-box">
              <div>
                <p className="eyebrow">Bank transfer details</p>
                <h3>{bankDetails.name}</h3>
              </div>
              <p><span>Bank</span><b>{bankDetails.bank}</b></p>
              <p><span>Account No.</span><b>{bankDetails.account}</b></p>
              <p><span>Amount</span><b>{formatPrice(total)}</b></p>
              <p><span>Narration</span><b>{ref}</b></p>
              <div className="admin-handoff">
                <b>How admin confirms it</b>
                <span>WhatsApp opens after submit. Customer can attach payment evidence there. Admin checks the bank alert or receipt for this narration, matches it with the order, then replies in the same chat that payment has been received and processing has started.</span>
              </div>
              <div className="admin-reply-preview">
                <span>Admin reply after payment confirmation</span>
                <p>Payment received for {ref}. Your order is being processed. {selectedZone.promise}</p>
              </div>
              <ol>
                <li>Transfer the exact total amount.</li>
                <li>Use the order ref as narration.</li>
                <li>Submit, then attach your payment evidence in the WhatsApp chat that opens.</li>
              </ol>
            </div>
          )}

          {method === 'delivery' && (
            <div className="delivery-box payment-detail-box">
              <b>Pay on Delivery selected</b>
              <span>No payment now. The order is sent to WhatsApp with customer details, products, delivery fee and total, so admin can call before dispatch.</span>
              <div className="delivery-checks">
                <p>Admin receives full order</p>
                <p>{selectedZone.eta} arrival window</p>
                <p>Cash or transfer on arrival</p>
              </div>
            </div>
          )}

          <button>
            {method === 'paystack'
              ? `Pay ${formatPrice(total)} with Paystack`
              : method === 'transfer'
                ? `Reserve transfer order - ${formatPrice(total)}`
                : 'Send pay on delivery request'}
          </button>
        </form>

        <aside className="checkout-card checkout-summary-pro">
          <div className="checkout-section-head">
            <p className="eyebrow">Dispatch slip</p>
            <h2>Order summary</h2>
          </div>
          <div className="checkout-items">
            {cart.cart.length ? (
              cart.cart.map((item) => (
                <div className="checkout-line" key={item.id}>
                  <img src={item.image} alt="" />
                  <div>
                    <b>{item.name}</b>
                    <small>{item.product_id || item.id}</small>
                    <span>{item.qty} x {formatPrice(item.price)}</span>
                  </div>
                  <strong>{formatPrice(item.price * item.qty)}</strong>
                </div>
              ))
            ) : (
              <p className="checkout-empty">Your cart is empty.</p>
            )}
          </div>
          <div className="checkout-total-row">
            <span>Subtotal</span>
            <b>{formatPrice(cart.subtotal)}</b>
          </div>
          <div className="checkout-total-row checkout-total-row--stacked">
            <span>
              Delivery
              <small>{selectedZone.short} - {selectedZone.eta}</small>
            </span>
            <b>{formatPrice(deliveryFee)}</b>
          </div>
          <div className="checkout-grand-total">
            <span>Total</span>
            <b>{formatPrice(total)}</b>
          </div>
        </aside>
      </section>
    </main>
  );
}
