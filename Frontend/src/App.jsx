import { useEffect, useState } from 'react';
import { products as seedProducts } from './data/products';
import { isAdminEmail, isSupabaseConfigured, supaAuth, supaProducts } from './libSupabaseRest';
import { useToast } from './context/ToastContext.jsx';
import AuthModal from './components/AuthModal.jsx';
import Home from './Pages/Home/Home.jsx';
import Shop from './Pages/Shop/Shop.jsx';
import Cart from './Pages/Cart/Cart.jsx';
import Checkout from './Pages/Checkout/Checkout.jsx';
import Admin from './Pages/Admin/Admin.jsx';
import Orders from './Pages/Orders/Orders.jsx';
import MyOrders from './Pages/MyOrders/MyOrders.jsx';
import About from './Pages/About/About.jsx';
import Contact from './Pages/Contact/Contact.jsx';
import './App.css';
import './Pages/Home/Home.css';
import './Pages/Shop/Shop.css';
import './Pages/Cart/Cart.css';
import './Pages/Checkout/Checkout.css';
import './Pages/Admin/Admin.css';
import './Pages/Orders/Orders.css';
import './Pages/MyOrders/MyOrders.css';

function uid(prefix = 'OME') {
  return `${prefix}-${Math.random().toString(36).slice(2, 7).toUpperCase()}-${Date.now().toString().slice(-5)}`;
}

function useTheme() {
  const [theme, setTheme] = useState(localStorage.getItem('ome-theme') || 'dark');
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('ome-theme', theme);
  }, [theme]);
  return { theme, toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')) };
}

function useAuthSystem(toast) {
  const [user, setUser] = useState(() => supaAuth.user());
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authNote, setAuthNote] = useState('');
  const isAdmin = isAdminEmail(user);

  const requireLogin = (message = 'Please login first to continue.') => {
    if (user) return true;
    toast?.showToast?.(message, 'info');
    setAuthNote(message);
    setAuthMode('login');
    setAuthOpen(true);
    return false;
  };

  const cancelAuth = () => {
    setAuthOpen(false);
    setAuthNote('');
  };

  const login = async (email, password) => {
    const data = await supaAuth.login(email, password);
    setUser(data.user);
    setAuthOpen(false);
    setAuthNote('');
    if (isAdminEmail(data.user)) location.hash = '#/admin';
    toast?.showToast?.('Welcome back. You are signed in.', 'success');
  };

  const signup = async (name, email, password) => {
    const data = await supaAuth.signup(name, email, password);
    setUser(data.user || { email, user_metadata: { full_name: name } });
    setAuthOpen(false);
    setAuthNote('');
    toast?.showToast?.('Account created. You are ready to shop.', 'success');
  };

  const logout = () => {
    supaAuth.logout();
    setUser(null);
    location.hash = '#/';
    toast?.showToast?.('Logged out successfully.', 'info');
  };

  return { user, isAdmin, authOpen, setAuthOpen, authMode, setAuthMode, authNote, requireLogin, login, signup, logout, cancelAuth };
}

function useProducts(toast) {
  const [items, setItems] = useState(seedProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    if (!isSupabaseConfigured) return;
    setLoading(true);
    try {
      setError('');
      const supabaseItems = await supaProducts.list();
      setItems(supabaseItems.length ? supabaseItems : seedProducts);
    } catch (error) {
      console.warn(error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const createProduct = async (product) => {
    const clean = { ...product, id: product.id || uid('PROD'), product_id: product.product_id || product.id || uid('PRD') };
    const saved = isSupabaseConfigured ? await supaProducts.create(clean) : clean;
    if (isSupabaseConfigured) await load();
    else setItems((current) => [saved, ...current]);
    toast?.showToast?.(`${saved.name || 'Product'} added to products.`, 'success');
  };

  const updateProduct = async (id, product) => {
    const saved = isSupabaseConfigured ? await supaProducts.update(id, product) : { ...product, id };
    if (isSupabaseConfigured) await load();
    else setItems((current) => current.map((entry) => (entry.id === id ? { ...entry, ...saved } : entry)));
    toast?.showToast?.(`${saved.name || product.name || 'Product'} updated.`, 'success');
  };

  const deleteProduct = async (id, productId) => {
    const target = items.find((product) => product.id === id || product.product_id === productId);
    try {
      if (isSupabaseConfigured) await supaProducts.remove(id, productId);
    } catch (error) {
      console.warn(error);
      toast?.showToast?.(`Delete failed in Supabase: ${error.message || 'check RLS policy or product id.'}`, 'error');
      return;
    }
    if (isSupabaseConfigured) await load();
    else setItems((current) => current.filter((product) => product.id !== id && product.product_id !== productId));
    toast?.showToast?.(`${target?.name || 'Product'} deleted from Supabase.`, 'info');
  };

  return { products: items, loading, productError: error, createProduct, updateProduct, deleteProduct, reload: load };
}

function useCart(auth, toast) {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('ome-cart-pro') || '[]'));
  useEffect(() => localStorage.setItem('ome-cart-pro', JSON.stringify(cart)), [cart]);

  const add = (product) => {
    if (!auth.requireLogin('Login or create an account before adding products to cart.')) return;
    setCart((items) => {
      const found = items.find((entry) => entry.id === product.id);
      return found ? items.map((entry) => entry.id === product.id ? { ...entry, qty: entry.qty + 1 } : entry) : [...items, { ...product, qty: 1 }];
    });
    toast?.showToast?.(`${product.name || 'Product'} added to cart.`, 'success');
  };

  const setQty = (id, qty) => setCart((items) => {
    const target = items.find((entry) => entry.id === id);
    if (target && qty <= 0) toast?.showToast?.(`${target.name || 'Product'} removed from cart.`, 'info');
    return items.map((entry) => entry.id === id ? { ...entry, qty } : entry).filter((entry) => entry.qty > 0);
  });

  const clear = (silent = false) => {
    setCart([]);
    if (!silent) toast?.showToast?.('Cart cleared.', 'info');
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  return { cart, add, setQty, clear, subtotal, count: cart.reduce((sum, item) => sum + item.qty, 0) };
}

function Nav({ route, setRoute, auth, cart, theme }) {
  const [open, setOpen] = useState(false);
  const link = (path) => { setRoute(path); setOpen(false); };
  const navs = [['/', 'HOME'], ['/about', 'ABOUT'], ['/contact', 'CONTACT'], ['/shop', 'SHOP']];

  return <header className="nav"><button className="brand" onClick={() => link('/')}>OME<span>Electrical</span></button><button className="hamb" onClick={() => setOpen(!open)}>{open ? 'x' : 'menu'}</button><nav className={open ? 'open' : ''}>{navs.map(([path, label]) => <button className={route === path ? 'active' : ''} onClick={() => link(path)} key={path}>{label}</button>)}{auth.isAdmin && <button className={route === '/admin' ? 'active admin-pill' : ''} onClick={() => link('/admin')}>ADMIN</button>}<button onClick={theme.toggleTheme}>{theme.theme === 'dark' ? 'Light' : 'Dark'}</button>{!auth.isAdmin && <>{auth.user && <button className={route === '/my-orders' ? 'active' : ''} onClick={() => link('/my-orders')}>My Orders</button>}<button onClick={() => link('/cart')}>Cart ({cart.count})</button></>}{auth.user ? <button onClick={auth.logout}>Logout</button> : <button className="login" onClick={() => auth.setAuthOpen(true)}>Login</button>}</nav></header>;
}

export default function App() {
  const [route, setRoute] = useState(location.hash.replace('#', '') || '/');
  const toast = useToast();
  const theme = useTheme();
  const auth = useAuthSystem(toast);
  const store = useProducts(toast);
  const cart = useCart(auth, toast);

  useEffect(() => {
    const handleHashChange = () => setRoute(location.hash.replace('#', '') || '/');
    addEventListener('hashchange', handleHashChange);
    return () => removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (auth.isAdmin && ['/', '/my-orders', '/orders', '/cart', '/checkout'].includes(route)) {
      location.hash = '#/admin';
      setRoute('/admin');
    }
  }, [auth.isAdmin, route]);

  const go = (path) => {
    location.hash = path;
    setRoute(path);
  };

  return <><Nav route={route} setRoute={go} auth={auth} cart={cart} theme={theme} />{route === '/' && <Home setRoute={go} />}{route === '/shop' && <Shop products={store.products} cart={cart} />}{route === '/cart' && <Cart cart={cart} setRoute={go} auth={auth} />}{route === '/checkout' && <Checkout cart={cart} auth={auth} />}{route === '/admin' && <Admin auth={auth} {...store} />}{route === '/orders' && <Orders auth={auth} />}{route === '/my-orders' && <MyOrders auth={auth} />}{route === '/about' && <About />}{route === '/contact' && <Contact />}<footer>© OME Electrical Company - Supabase-ready admin commerce</footer><AuthModal auth={auth} /></>;
}
