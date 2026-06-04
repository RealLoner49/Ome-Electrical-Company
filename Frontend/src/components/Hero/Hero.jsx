import { useEffect, useMemo, useRef, useState } from "react";
import "./Hero.css";

function Hero() {
  const slides = useMemo(
    () => [
      {
        id: 1,
        title: "Copper Cable 2.5mm",
        subtitle: "Pure copper wiring built for safe current flow and long-term durability.",
        image: "/images/Copper Cable 2.5mm.jpg",
      },
      {
        id: 2,
        title: "Heavy Duty Extension Box",
        subtitle: "Reliable sockets for homes, shops, offices, and worksites.",
        image: "/images/Heavy Duty Extension Box.jpg",
      },
      {
        id: 3,
        title: "Industrial Circuit Breaker 20A",
        subtitle: "Quality circuit protection for electrical safety and performance.",
        image: "/images/IndustrialCircuit Breaker 20A.jpg",
      },
      {
        id: 4,
        title: "Stabilizer",
        subtitle: "Protect your appliances from unstable voltage and sudden power surges.",
        image: "/images/Stablizer (1).jpg",
      },
    ],
    []
  );

  const applianceCards = [
    { name: "Ceiling Fans", text: "Durable fans for homes and offices.", icon: "🌀" },
    { name: "LED Lights", text: "Bright, energy-saving lighting options.", icon: "💡" },
    { name: "Sockets & Switches", text: "Premium fittings for clean installations.", icon: "🔌" },
    { name: "Stabilizers", text: "Voltage protection for your appliances.", icon: "⚡" },
  ];

  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(null);

  const goTo = (idx) => setCurrent((idx + slides.length) % slides.length);
  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5200);

    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current]);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;

    const endX = e.changedTouches[0].clientX;
    const diff = endX - touchStartX.current;

    if (Math.abs(diff) > 50) {
      diff < 0 ? next() : prev();
    }

    touchStartX.current = null;
  };

  const active = slides[current];

  return (
    <section
      className="hero2"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="hero2__wrap">
        <div className="hero2__copy">
          <div className="hero2__chip">
            <span />
            Trusted Electrical Store
          </div>

          <h1 className="hero2__title">
            Quality Electrical Products for Homes & Businesses
          </h1>

          <p className="hero2__sub">
            Shop original cables, switches, fans, lights, stabilizers, circuit
            breakers, and other reliable electrical appliances.
          </p>

          <div className="hero2__actions">
            <a className="hero2__btn hero2__btn--primary" href="#products">
              Shop Products
            </a>
            <a className="hero2__btn hero2__btn--secondary" href="#contact">
              Request Quote
            </a>
          </div>

          <div className="hero2__miniGrid">
            {applianceCards.map((item) => (
              <div className="hero2__miniCard" key={item.name}>
                <div className="hero2__miniIcon">{item.icon}</div>
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero2__stage">
          <div className="hero2__productCard">
            <div className="hero2__cardTop">
              <span>Featured Product</span>

              <div className="hero2__nav">
                <button onClick={prev} aria-label="Previous product">
                  ❮
                </button>
                <button onClick={next} aria-label="Next product">
                  ❯
                </button>
              </div>
            </div>

            <div className="hero2__imageBox">
              <div
                className="hero2__slider"
                style={{ transform: `translateX(-${current * 100}%)` }}
              >
                {slides.map((slide) => (
                  <img
                    key={slide.id}
                    src={slide.image}
                    alt={slide.title}
                    className="hero2__image"
                  />
                ))}
              </div>
            </div>

            <div className="hero2__cardBottom">
              <p className="hero2__category">Available in store</p>
              <h2>{active.title}</h2>
              <p>{active.subtitle}</p>
            </div>

            <div className="hero2__indicators">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => goTo(index)}
                  className={index === current ? "is-active" : ""}
                  aria-label={`Go to product ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;