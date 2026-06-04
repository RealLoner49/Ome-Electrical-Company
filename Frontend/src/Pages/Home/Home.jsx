import './Home.css';

const homeHighlights = [
  { label: 'Cables', value: '2.5mm copper ready' },
  { label: 'Breakers', value: 'Industrial protection' },
  { label: 'Lighting', value: 'Clean install picks' },
  { label: 'Dispatch', value: 'Rider notes enabled' },
];

const homeFlow = [
  { label: 'Browse by category', route: '/shop' },
  { label: 'Add with product ID', route: '/shop' },
  { label: 'Checkout with notes', route: '/cart' },
  { label: 'Dispatch the order', route: '/my-orders' },
];

const featuredProducts = [
  {
    name: 'Crystal chandelier',
    category: 'Lighting',
    note: 'Warm room lighting with a premium ceiling finish.',
    image: '/images/product-chandelier.png',
    fit: 'chandelier',
  },
  {
    name: 'Standing fan',
    category: 'Cooling',
    note: 'Adjustable pedestal fan for homes, offices, and shop spaces.',
    image: '/images/product-standing-fan.png',
    fit: 'standing-fan',
  },
  {
    name: 'Street solar light',
    category: 'Outdoor lighting',
    note: 'Solar-powered LED lighting for compounds, gates, and outdoor spaces.',
    image: '/images/product-street-solar-light.png',
    fit: 'solar-light',
  },
];

export default function Home({ setRoute }) {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-copy">
          <p className="eyebrow">Premium electrical supplies</p>
          <h1>Electrical shopping with voltage, speed and serious polish.</h1>
          <p>
            Shop cables, lighting, breakers, sockets and industrial power accessories with clear product IDs,
            rider notes and a checkout flow made for real dispatch work.
          </p>
          <div className="hero-actions">
            <button onClick={() => setRoute('/shop')}>Shop Products</button>
            <button className="ghost" onClick={() => setRoute('/about')}>Explore Company</button>
          </div>
        </div>

        <div className="home-cockpit">
          <div className="cockpit-top">
            <span>OME stock board</span>
            <b>Live</b>
          </div>
          <div className="cockpit-layout">
            <div className="cockpit-lines">
              {homeHighlights.map((item) => (
                <div key={item.label}>
                  <span>{item.label}</span>
                  <b>{item.value}</b>
                </div>
              ))}
            </div>
            <div className="stock-meter">
              <strong>Ready</strong>
              <small>Updated products, prices and stock notes</small>
            </div>
          </div>
          <div className="cockpit-product">
            <img src="/images/Copper Cable 2.5mm.jpg" alt="Copper cable roll" />
          </div>
        </div>
      </section>

      <section className="stats home-stats">
        <div><b>500+</b><span>Electrical items ready</span></div>
        <div><b>24hr</b><span>Lagos dispatch target</span></div>
        <div><b>Secure</b><span>Supabase-ready backend</span></div>
      </section>

      <section className="home-products">
        <div className="home-products-head">
          <p className="eyebrow">Popular picks</p>
          <h2>Products customers ask for often.</h2>
        </div>

        <div className="home-product-grid">
          {featuredProducts.map((product) => (
            <article className={`home-product-card home-product-card--${product.fit}`} key={product.name}>
              <div className="home-product-image">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="home-product-body">
                <span>{product.category}</span>
                <h3>{product.name}</h3>
                <p>{product.note}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-flow">
        <div>
          <p className="eyebrow">How orders move</p>
          <h2>From product search to delivery without the usual friction.</h2>
        </div>
        <div className="flow-track">
          {homeFlow.map((step, index) => (
            <button type="button" className="flow-card" onClick={() => setRoute(step.route)} key={step.label}>
              <span>0{index + 1}</span>
              <b>{step.label}</b>
            </button>
          ))}
        </div>
      </section>

      <section className="home-technician">
        <div>
          <p className="eyebrow">Need a technician?</p>
          <h2>Get help for house wiring, repairs, installation, and electrical checks.</h2>
          <p>
            If you need someone to handle the work at home or on-site, send the details and OME Electrical
            will follow up with the right support.
          </p>
        </div>
        <button type="button" onClick={() => setRoute('/contact')}>Request Technician</button>
      </section>

      <section className="home-showcase">
        <article>
          <p className="eyebrow">Built for buyers</p>
          <h3>Find the right part fast.</h3>
          <p>Search categories, compare product cards and add items with their product IDs intact for cleaner confirmation.</p>
        </article>
        <article>
          <p className="eyebrow">Built for operators</p>
          <h3>Run the store smarter.</h3>
          <p>Admin-ready product control helps keep pricing, stock, images and dispatch details in one focused place.</p>
        </article>
      </section>
    </main>
  );
}
