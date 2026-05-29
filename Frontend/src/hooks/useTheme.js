import { useEffect, useState } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState(localStorage.getItem('ome-theme') || 'dark');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('ome-theme', theme);
  }, [theme]);

  return { theme, toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')) };
}
