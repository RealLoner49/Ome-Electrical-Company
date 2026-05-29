import "./Trending.css";
import { useCart } from "../../context/CartContext";

function Trending() {
  const trendingProducts = [
    { id: 1, name: "Copper Cable 2.5mm", price: 8500, image: "/images/Copper Cable 2.5mm.jpg", badge: "NEW" },
    { id: 2, name: "Industrial Circuit Breaker 20A", price: 15000, image: "/images/IndustrialCircuit Breaker 20A.jpg", badge: "NEW" },
    { id: 3, name: "Heavy Duty Extension Box", price: 12500, image: "/images/Heavy Duty Extension Box.jpg", badge: "HOT" },
    { id: 4, name: "Stabilizer", price: 25000, image: "/images/Stablizer (1).jpg" },
    { id: 5, name: "PVC Insulated Cable 4mm", price: 11200, image: "/images/Copper Cable 2.5mm.jpg" },
    { id: 6, name: "Mini Circuit Breaker 10A", price: 6800, image: "/images/IndustrialCircuit Breaker 20A.jpg" },
    { id: 7, name: "Outdoor Junction Box", price: 9400, image: "/images/Heavy Duty Extension Box.jpg" },
    { id: 8, name: "Voltage Stabilizer 1kVA", price: 28000, image: "/images/Stablizer (1).jpg", badge: "NEW" },
  ];

  const { addToCart } = useCart();

  const formatNaira = (n) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <section className="tr2">
      <div className="tr2__wrap">
        <div className="tr2__header">
          <div>
            <h2 className="tr2__title">Trending This Week</h2>
            <p className="tr2__sub">Hot picks electricians are buying right now.</p>
          </div>

          <a href="#products" className="tr2__viewAll">
            View All <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="tr2__grid">
          {trendingProducts.map((p) => (
            <article key={p.id} className="tr2__card">
              {p.badge && (
                <span className={`tr2__badge tr2__badge--${p.badge.toLowerCase()}`}>
                  {p.badge}
                </span>
              )}

              <div className="tr2__imgWrap">
                <img src={p.image} alt={p.name} loading="lazy" />
                <span className="tr2__shine" aria-hidden="true" />
              </div>

              <div className="tr2__info">
                <h3 className="tr2__name">{p.name}</h3>

                <div className="tr2__row">
                  <p className="tr2__price">{formatNaira(p.price)}</p>

                  <button
                    className="tr2__btn"
                    onClick={() => addToCart(p)}
                    type="button"
                  >
                    Add
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

export default Trending;