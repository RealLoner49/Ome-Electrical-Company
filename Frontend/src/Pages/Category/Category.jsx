import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import { getCategoryBySlug, getProductsByCategory } from '../../data/products';
import { Icons } from '../../components/Icons';

export default function Category({ slug }) {
  const category = getCategoryBySlug(slug);
  const products = getProductsByCategory(slug);

  if (!category) {
    window.location.hash = '#/shop';
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="shell page-main">
        <section className="page-hero card category-hero">
          <img src={category.hero} alt={category.name} />
          <div>
            <span className="eyebrow"><Icons.bolt size={16} /> {category.name}</span>
            <h1>{category.name}</h1>
            <p>{category.blurb}</p>
            <div className="hero-actions">
              <a className="primary-btn" href="#/cart">Go to cart</a>
              <a className="secondary-btn" href="#/shop">See all products</a>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Dedicated landing page</span>
              <h2>Images, descriptions, and add-to-cart built in</h2>
            </div>
          </div>
          <div className="products-grid">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
