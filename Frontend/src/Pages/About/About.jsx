import './About.css';

const aboutStats = [
  { value: '500+', label: 'stocked electrical items' },
  { value: '24hr', label: 'Lagos dispatch target' },
  { value: '100%', label: 'product ID tracking' },
];

const aboutValues = [
  { title: 'Honest supply', text: 'Every product should be clear, priced properly, and easy to identify before a technician pays for it.' },
  { title: 'Project speed', text: 'Customers should be able to move from quote to checkout without long back-and-forth messages.' },
  { title: 'After-sale confidence', text: 'Orders, payment routes, and support details stay organized so customers can trust the process.' },
];

const timeline = [
  { year: 'The beginning', title: 'A small electrical supply desk', text: 'OME started with a simple idea: help homeowners, electricians, and project buyers find dependable electrical materials without confusion.' },
  { year: 'Growing demand', title: 'From walk-ins to project orders', text: 'As more builders and technicians asked for cables, lighting, breakers, sockets, and protection devices, the company began organizing stock by real job needs.' },
  { year: 'Today', title: 'A smarter commerce system', text: 'The store is being shaped into a cleaner digital supply hub, where products, checkout, admin updates, and delivery notes work together.' },
];

const promises = [
  'Clear product IDs for faster confirmation',
  'Curated materials for homes, offices, and worksites',
  'Admin-managed pricing, images, and stock',
  'Checkout options built around Nigerian buyers',
];

const members = [
  {
    name: 'Ogbuefi John  Omerebere',
    role: 'Founder and project lead',
    text: 'A steady leader with a passion for dependable electrical supply, clear business values, and customer trust. His direction helps OME Electrical stay focused on quality products, honest service, and long-term growth.',
    image: '/images/CO-FOUNDER.jpeg',
    initials: 'M1',
  },
  {
    name: 'Ogbuefi Ifeoma Julieth',
    role: 'Operations and customer care',
    text: 'Bringing warmth, discipline, and care to the daily experience of the brand. She helps keep customer support, product questions, and order follow-up clear, respectful, and well organized.',
    image: '/images/Boss Lady.jpeg',
    initials: 'M2',
  },
  {
    name: 'Mr&Mrs Ogbuefi',
    role: 'Business partners and brand builders',
    text: 'Together, they bring business focus, shared leadership, and strong commitment to OME Electrical. Their support helps shape a brand built on reliability, trust, and service customers can believe in.',
    image: '/images/FOUNDERS.jpeg',
    initials: 'M3',
  },
];

export default function About() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="about-copy">
          <p className="eyebrow">About OME Electrical</p>
          <h1>Built from a local supply desk into a smarter electrical store.</h1>
          <p>
            OME Electrical Company serves homeowners, technicians, builders, and facility teams with electrical
            supplies that are easier to find, easier to order, and easier to trust.
          </p>
          <div className="about-stats">
            {aboutStats.map((stat) => (
              <div key={stat.label}><b>{stat.value}</b><span>{stat.label}</span></div>
            ))}
          </div>
        </div>

        <div className="about-board" aria-hidden="true">
          <div className="circuit-node node-a"></div>
          <div className="circuit-node node-b"></div>
          <div className="circuit-node node-c"></div>
          <div className="circuit-chip">
            <span>OME</span>
            <b>Electrical commerce core</b>
            <small>Inventory - Checkout - Dispatch</small>
          </div>
        </div>
      </section>

      <section className="about-origin">
        <div>
          <p className="eyebrow">How it started</p>
          <h2>OME began with the everyday problem most electrical buyers know too well.</h2>
        </div>
        <p>
          Customers needed the right cable size, the right breaker rating, the right socket finish, or a dependable
          stabilizer, but the buying process was often scattered across phone calls, unclear pictures, and delayed
          confirmation. OME was built to make that process cleaner: clear catalogue, visible product IDs, better
          order notes, and a system the admin can update as stock changes.
        </p>
      </section>

      <section className="about-timeline">
        {timeline.map((item, index) => (
          <article key={item.title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <small>{item.year}</small>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <section className="about-story">
        <div>
          <p className="eyebrow">What we are building</p>
          <h2>A better supply desk for modern electrical work.</h2>
        </div>
        <p>
          Instead of messy catalogues and slow order confirmation, OME keeps the experience structured: clear
          product IDs, quick category browsing, checkout notes for riders, and admin-ready product management for
          the business behind the counter.
        </p>
      </section>

      <section className="about-promise">
        <div>
          <p className="eyebrow">Customer promise</p>
          <h2>Less guessing. More confidence.</h2>
        </div>
        <div className="promise-list">
          {promises.map((promise) => <p key={promise}>{promise}</p>)}
        </div>
      </section>

      <section className="about-values">
        {aboutValues.map((item, index) => (
          <article className="about-value" key={item.title}>
            <span>0{index + 1}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <section className="about-members">
        <div className="about-members-head">
          <h2>Meet the members</h2>
          <p>The people behind the site.</p>
        </div>

        <div className="about-member-grid">
          {members.map((member) => (
            <article className="about-member-card" key={member.name}>
              <div className="about-member-photo">
                <img
                  src={member.image}
                  alt={member.name}
                  onError={(event) => {
                    event.currentTarget.style.display = 'none';
                  }}
                />
                <span>{member.initials}</span>
              </div>
              <div>
                <h3>{member.name}</h3>
                <b>{member.role}</b>
                <p>{member.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
