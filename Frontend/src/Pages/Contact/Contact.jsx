import { useState } from 'react';
import { useToast } from '../../context/ToastContext.jsx';
import './Contact.css';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xqejlwkw';
const FEEDBACK_RECIPIENT = 'omeelectrical28@gmail.com';

const contactChannels = [
  {
    label: 'Sales line',
    value: '+234 803 760 1699',
    meta: 'Fast quotes for cables, breakers and lighting',
  },
  {
    label: 'WhatsApp desk',
    value: '+234 803 760 1699',
    meta: 'Send product IDs, photos, technician requests or delivery notes',
  },
  {
    label: 'Email support',
    value: 'omeelectrical28@gmail.com',
    meta: 'Invoices, bulk orders and account help',
  },
];

const contactSignals = [
  'Quote sent in 11m',
  'Technician request routed',
  'Lagos pickup ready',
  'Technician standby',
];

const contactStats = [
  { value: '11m', label: 'average quote response' },
  { value: '24-72h', label: 'delivery planning window' },
  { value: '3', label: 'support channels' },
];

function contactHref(item) {
  if (item.label.includes('WhatsApp')) {
    const message = encodeURIComponent('Hello OME Electrical, I need help with a product, order, or technician request.');
    return `https://wa.me/2348037601699?text=${message}`;
  }

  if (item.label.includes('Email')) return `mailto:${item.value}`;

  return `tel:${item.value.replaceAll(' ', '')}`;
}

export default function Contact() {
  const toast = useToast();
  const [sending, setSending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSending(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Message could not be sent.');
      }

      toast?.showToast?.('Message sent successfully. We will contact you soon.', 'success');
      form.reset();
    } catch {
      toast?.showToast?.(
        'Message failed to send. Please check your Formspree link and try again.',
        'error'
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <div className="contact-copy">
          <p className="eyebrow">Contact command center</p>

          <h1>Talk to OME before the current drops.</h1>

          <p>
            Need a quote, an order update, a technician for house work, or help matching an electrical part?
            Route the message straight to the right desk and keep your project moving.
          </p>

          <div className="contact-actions">
            <a href="tel:+234 8037601699">Call now</a>

            <a className="contact-action--ghost" href="mailto:omeelectrical28@gmail.com">
              Email support
            </a>
          </div>

          <div className="contact-mini-stats">
            {contactStats.map((stat) => (
              <div key={stat.label}>
                <b>{stat.value}</b>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="contact-orbit" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>

          <div className="contact-core">
            <b>OME</b>
            <small>live support</small>
          </div>
        </div>
      </section>

      <section className="contact-grid">
        <div className="contact-panel contact-panel--channels">
          <div>
            <p className="eyebrow">Direct lines</p>
            <h2>Pick the fastest route</h2>
          </div>

          {contactChannels.map((item) => (
            <a
              className="contact-channel"
              href={contactHref(item)}
              key={item.label}
              target={item.label.includes('WhatsApp') ? '_blank' : undefined}
              rel={item.label.includes('WhatsApp') ? 'noreferrer' : undefined}
            >
              <span>{item.label}</span>
              <b>{item.value}</b>
              <small>{item.meta}</small>
            </a>
          ))}
        </div>

        <form className="contact-panel contact-form" onSubmit={handleSubmit}>
          <div>
            <p className="eyebrow">Priority request</p>
            <h2>Send the details</h2>
          </div>

          <div className="contact-form-row">
            <input required name="name" placeholder="Full name" />

            <input required name="email" type="email" placeholder="Email address" />
          </div>

          <select required name="request_type" defaultValue="Product quote">
            <option>Product quote</option>
            <option>Product feedback</option>
            <option>Order follow-up</option>
            <option>Technician request</option>
            <option>Bulk procurement</option>
            <option>Technical support</option>
          </select>

          <div className="contact-technician-note">
            <b>Need a technician?</b>
            <span>Use this form for house wiring, light fitting, socket repairs, breaker checks, installation, troubleshooting, or site inspection.</span>
          </div>

          <div className="contact-form-row">
            <input name="product_reference" placeholder="Product name or ID (for feedback)" />

            <select name="usage_duration" defaultValue="">
              <option value="">How long have you used it?</option>
              <option>Less than 1 month</option>
              <option>1-3 months</option>
              <option>3-6 months</option>
              <option>More than 6 months</option>
            </select>
          </div>

          <input name="service_location" placeholder="Service location or house address (for technician request)" />

          <textarea
            required
            name="message"
            placeholder="Tell us the product IDs, quantity, delivery area, technician job details, installation issue, or how the product is lasting..."
          ></textarea>

          <input type="hidden" name="source" value="OME Electrical Website Contact Page" />
          <input type="hidden" name="recipient" value={FEEDBACK_RECIPIENT} />
          <input type="hidden" name="_subject" value="OME Electrical customer message / technician request" />

          <button type="submit" disabled={sending}>
            {sending ? 'Sending...' : 'Transmit request'}
          </button>
        </form>

        <aside className="contact-panel contact-status">
          <p className="eyebrow">Response pulse</p>

          <h2>Support is online</h2>

          <p className="contact-status-copy">
            Send product IDs, quantities, delivery area, technician job details, or installation questions. The clearer the details,
            the faster the team can reply.
          </p>

          <div className="pulse-ring">
            <i></i>
          </div>

          {contactSignals.map((signal, index) => (
            <div className="signal-row" key={signal}>
              <span>0{index + 1}</span>
              <b>{signal}</b>
            </div>
          ))}
        </aside>
      </section>
    </main>
  );
}
