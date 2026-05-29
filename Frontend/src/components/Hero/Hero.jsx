import { useEffect, useMemo, useRef, useState } from "react";
import "./Hero.css";

function Hero() {
  const slides = useMemo(
    () => [
      {
        id: 1,
        title: "Copper Cable 2.5mm",
        subtitle: "Pure copper, durable insulation, stable current flow.",
        accent: "#c41e3a",
        tone: "#FFD700",
        image: "/images/Copper Cable 2.5mm.jpg",
      },
      {
        id: 2,
        title: "Heavy Duty Extension Box",
        subtitle: "Heavy build, safe sockets, perfect for worksites.",
        accent: "#FF6B35",
        tone: "#87CEEB",
        image: "/images/Heavy Duty Extension Box.jpg",
      },
      {
        id: 3,
        title: "Industrial Circuit Breaker 20A",
        subtitle: "Reliable protection, smooth trip response, long life.",
        accent: "#FFD700",
        tone: "#90EE90",
        image: "/images/IndustrialCircuit Breaker 20A.jpg",
      },
      {
        id: 4,
        title: "Stabilizer",
        subtitle: "Voltage balance, appliance safety, clean performance.",
        accent: "#4169E1",
        tone: "#FF69B4",
        image: "/images/Stablizer (1).jpg",
      },
    ],
    []
  );

  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(null);

  const goTo = (idx) => setCurrent((idx + slides.length) % slides.length);
  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  // Autoplay slideshow
  useEffect(() => {
    const t = setInterval(() => {
      setCurrent((p) => (p + 1) % slides.length);
    }, 5200);
    return () => clearInterval(t);
  }, [slides.length]);


  // Keyboard support
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current]);


  // Swipe support
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const endX = e.changedTouches[0].clientX;
    const diff = endX - touchStartX.current;

    if (Math.abs(diff) > 50) {
      if (diff < 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  const active = slides[current];

  return (
    <section
      className="hero2"
      style={{
        "--accent": active.accent,
        "--tone": active.tone,
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Background layer */}
      <div className="hero2__bg" aria-hidden="true" />

      <div className="hero2__wrap">
        {/* Left copy */}
        <div className="hero2__copy">
          <div className="hero2__chip">
            <span className="hero2__dot" />
            New stock in store
          </div>

          <h1 className="hero2__title">
            {active.title.split(" ").slice(0, 2).join(" ")}{" "}
            <span>{active.title.split(" ").slice(2).join(" ")}</span>
          </h1>

          <p className="hero2__sub">{active.subtitle}</p>

          <div className="hero2__actions">
            <a className="hero2__btn hero2__btn--primary" href="#products">
              Shop Now
            </a>
            <a className="hero2__btn hero2__btn--ghost" href="#contact">
              Request Quote
            </a>
          </div>

          {/* Indicators */}
          <div className="hero2__indicators">
            {slides.map((s, i) => (
              <button
                key={s.id}
                className={`hero2__indicator ${i === current ? "is-active" : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right product card */}
        <div className="hero2__stage">
          <div className="hero2__card">
            <div className="hero2__cardTop">
              <span className="hero2__badge">Featured</span>
              <div className="hero2__nav">
                <button className="hero2__navBtn" onClick={prev} aria-label="Previous">
                  ❮
                </button>
                <button className="hero2__navBtn" onClick={next} aria-label="Next">
                  ❯
                </button>
              </div>
            </div>

            <div className="hero2__imageWrap">
              <div
                className="hero2__slider"
                style={{ transform: `translateX(-${current * 100}%)` }}
                aria-live="polite"
              >
                {slides.map((slide) => (
                  <img
                    key={slide.id}
                    src={slide.image}
                    alt={slide.title}
                    className="hero2__image"
                    loading="eager"
                  />
                ))}
              </div>
            </div>

            <div className="hero2__cardBottom">
              <p className="hero2__name">{active.title}</p>
              <p className="hero2__hint">Swipe, tap dots, or use arrows.</p>
            </div>
          </div>

          {/* Decorative blobs */}
          <span className="hero2__blob hero2__blob--1" aria-hidden="true" />
          <span className="hero2__blob hero2__blob--2" aria-hidden="true" />
          <span className="hero2__ring" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

export default Hero;