import { useState } from 'react';

export default function Nav({ route, setRoute, auth, cart, theme, orderCount = 0 }) {
  const [open, setOpen] = useState(false);
  const link = (path) => { setRoute(path); setOpen(false); };
  const navs = [['/', 'HOME'], ['/about', 'ABOUT'], ['/contact', 'CONTACT'], ['/shop', 'SHOP']];

  return <header className="nav"><button className="brand" onClick={() => link('/')}>OME<span>Electrical</span></button><button className="hamb" onClick={() => setOpen(!open)}>{open ? 'x' : 'menu'}</button><nav className={open ? 'open' : ''}>{navs.map(([path, label]) => <button className={route === path ? 'active' : ''} onClick={() => link(path)} key={path}>{label}</button>)}{auth.isAdmin && <button className={route === '/admin' ? 'active admin-pill' : ''} onClick={() => link('/admin')}>ADMIN</button>}<button onClick={theme.toggleTheme}>{theme.theme === 'dark' ? 'Light' : 'Dark'}</button>{auth.isAdmin ? <button className={`orders-nav-button ${route === '/orders' ? 'active' : ''}`} onClick={() => link('/orders')}><span className="nav-count-badge">{orderCount}</span>ORDERS</button> : <button onClick={() => link('/cart')}>Cart ({cart.count})</button>}{auth.user ? <button onClick={auth.logout}>Logout</button> : <button className="login" onClick={() => auth.setAuthOpen(true)}>Login</button>}</nav></header>;
}
