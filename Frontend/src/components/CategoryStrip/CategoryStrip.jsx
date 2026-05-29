import "./CategoryStrip.css";

function CategoryStrip() {
  const categories = [
    { id: 1, name: "Phones & Tablets", icon: "📱" },
    { id: 2, name: "Computers & Accessories", icon: "💻" },
    { id: 3, name: "Electronics", icon: "⚡" },
    { id: 4, name: "Home Appliances", icon: "🏠" },
    { id: 5, name: "Power Supplies", icon: "🔋" },
    { id: 6, name: "Office Devices", icon: "🖨️" },
  ];

  return (
    <section className="cat2">
      <div className="cat2__header">
        <h2>Explore Categories</h2>
        <p>Find the right tools for your projects</p>
      </div>

      <div className="cat2__grid">
        {categories.map((cat) => (
          <div key={cat.id} className="cat2__card">
            <div className="cat2__iconWrap">
              <span className="cat2__icon">{cat.icon}</span>
              <span className="cat2__glow"></span>
            </div>

            <h3>{cat.name}</h3>

            <button className="cat2__btn">
              Shop Now →
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CategoryStrip;