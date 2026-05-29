import "./Product.css";
import ProductCard from "../ProductCard/ProductCard";

function Products() {
    const sampleProducts = [
        { id: 1, name: "Copper Cable 2.5mm", price: "₦8,500", image: "/images/Copper Cable 2.5mm.jpg", isNew: true },
        { id: 2, name: "Industrial Circuit Breaker 20A", price: "₦15,000", image: "/images/IndustrialCircuit Breaker 20A.jpg", isNew: true },
        { id: 3, name: "Heavy Duty Extension Box", price: "₦12,500", image: "/images/Heavy Duty Extension Box.jpg", isNew: false },
        { id: 4, name: "Stabilizer", price: "₦25,000", image: "/images/Stablizer (1).jpg", isNew: false },
        { id: 5, name: "PVC Insulated Cable 4mm", price: "₦11,200", image: "/images/Copper Cable 2.5mm.jpg", isNew: true },
        { id: 6, name: "Mini Circuit Breaker 10A", price: "₦6,800", image: "/images/IndustrialCircuit Breaker 20A.jpg", isNew: false },
        { id: 7, name: "Outdoor Junction Box", price: "₦9,400", image: "/images/Heavy Duty Extension Box.jpg", isNew: false },
        { id: 8, name: "Voltage Stabilizer 1kVA", price: "₦28,000", image: "/images/Stablizer (1).jpg", isNew: true }
    ];
    return (
        <section className="products">
            <div className="products__header">
                <h2 className="products__title">Featured Materials</h2>
                <a href="#" className="products__view-all">View All →</a>
            </div>

            <div className="products__grid">
                {sampleProducts.map(product => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        image={product.image}
                        isNew={product.isNew}
                    />
                ))}
            </div>
        </section>
    );
}

export default Products;