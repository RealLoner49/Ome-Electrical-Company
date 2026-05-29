import { useEffect, useState } from 'react';
import { products as seedProducts } from '../data/products';
import { isSupabaseConfigured, supaProducts } from '../libSupabaseRest';
import { uid } from '../utils/uid';

export function useProducts(toast) {
  const [items, setItems] = useState(seedProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
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

  useEffect(() => { fetchProducts(); }, []);

  const createProduct = async (product) => {
    const clean = { ...product, id: product.id || uid('PROD'), product_id: product.product_id || product.id || uid('PRD') };
    const saved = isSupabaseConfigured ? await supaProducts.create(clean) : clean;
    if (isSupabaseConfigured) await fetchProducts();
    else setItems((current) => [saved, ...current]);
    toast?.showToast?.(`${saved.name || 'Product'} added to products.`, 'success');
  };

  const updateProduct = async (id, product) => {
    const saved = isSupabaseConfigured ? await supaProducts.update(id, product) : { ...product, id };
    if (isSupabaseConfigured) await fetchProducts();
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
    if (isSupabaseConfigured) await fetchProducts();
    else setItems((current) => current.filter((product) => product.id !== id && product.product_id !== productId));
    toast?.showToast?.(`${target?.name || 'Product'} deleted from Supabase.`, 'info');
  };

  return { products: items, loading, productError: error, createProduct, updateProduct, deleteProduct, fetchProducts, reload: fetchProducts };
}
