import "./NewArrivals.css";

const items = [
  {
    id: 1,
    title: "Heavy Duty Extension Box",
    image: "/images/heavy-duty-extension-box.jpg",
    price: 12500,
    tag: "NEW",
  },
  {
    id: 2,
    title: "Industrial Circuit Breaker 20A",
    image: "/images/industrial-circuit-breaker-20a.jpg",
    price: 15000,
    tag: "HOT",
  },
  {
    id: 3,
    title: "Copper Cable 2.5mm",
    image: "/images/copper-cable-2.5mm.jpg",
    price: 8500,
    tag: "STOCK",
  },
  {
    id: 4,
    title: "Stabilizer",
    image: "/images/stabilizer.jpg",
    price: 25000,
    tag: "NEW",
  },
];

function formatNaira(n) {
  return new Intl.NumberFormat("en-NG").format(n);
}

function NewArrivals() {
  const heroBg = "/images/new-arrivals-hero.jpg"; // change to your hero image

  return (
    <section className="na">
      <div className="na__hero" style={{ "--bg": `url(${heroBg})` }}>
        <div className="na__wrap na__heroWrap">
          <div className="na__copy">
            <span className="na__pill">New stock just landed</span>
            <h2 className="na__title">
              New Arrivals for <span>Serious Projects</span>
            </h2>
            <p className="na__subtitle">
              Premium electrical materials, clean finish, solid performance. Pick what you need,
              ship fast.
            </p>

            <div className="na__actions">
              <a className="na__btn na__btn--primary" href="#shop">
                Shop New Arrivals
              </a>
              <a className="na__btn na__btn--ghost" href="#contact">
                Request a Quote
              </a>
            </div>

            <div className="na__stats">
              <div className="na__stat">
                <span className="na__statNum">24h</span>
                <span className="na__statText">Dispatch</span>
              </div>
              <div className="na__stat">
                <span className="na__statNum">100%</span>
                <span className="na__statText">Quality Check</span>
              </div>
              <div className="na__stat">
                <span className="na__statNum">Top</span>
                <span className="na__statText">Brands</span>
              </div>
            </div>
          </div>

          <div className="na__featured" aria-hidden="true">
            <div className="na__glassCard">
              <div className="na__featuredTop">
                <span className="na__featuredBadge">Featured</span>
                <span className="na__featuredPrice">
                  ₦{formatNaira(items[0].price)}
                </span>
              </div>
              <div className="na__featuredImg">
                <img src={items[0].image} alt={items[0].title} />
              </div>
              <div className="na__featuredBottom">
                <p className="na__featuredTitle">{items[0].title}</p>
                <p className="na__featuredHint">High demand this week</p>
              </div>
            </div>

            <div className="na__orbs" aria-hidden="true">
              <span className="na__orb na__orb--1" />
              <span className="na__orb na__orb--2" />
              <span className="na__orb na__orb--3" />
            </div>
          </div>
        </div>
      </div>

      <div className="na__wrap">
        <div className="na__head">
          <h3 className="na__sectionTitle">Shop New Arrivals</h3>
          <p className="na__sectionSub">
            Curated products that electricians actually love using.
          </p>
        </div>

        <div className="na__grid">
          {items.map((it) => (
            <article key={it.id} className="na__card">
              <div className="na__thumb">
                <img src={it.image} alt={it.title} loading="lazy" />
                <span className="na__tag">{it.tag}</span>
              </div>

              <div className="na__info">
                <h4 className="na__name">{it.title}</h4>
                <div className="na__meta">
                  <p className="na__price">₦{formatNaira(it.price)}</p>
                  <button className="na__add" type="button">
                    Add to cart
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default NewArrivals;