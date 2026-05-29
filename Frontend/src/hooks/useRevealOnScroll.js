import { useEffect } from 'react';

export function useRevealOnScroll() {
  useEffect(() => {
    const targets = document.querySelectorAll('.card, .product-card, .category-card, .feature-card, .page-hero, .section-heading');
    targets.forEach((element) => element.classList.add('reveal-on-scroll'));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    targets.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  });
}
