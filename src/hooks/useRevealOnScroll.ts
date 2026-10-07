import { useEffect } from 'react'

/**
 * Fades `[data-reveal]` elements in as they scroll into view. Elements already on screen at load,
 * and everyone who prefers reduced motion, see them immediately.
 */
export function useRevealOnScroll() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const belowFold = elements.filter((el) => el.getBoundingClientRect().top > window.innerHeight)
    belowFold.forEach((el) => el.classList.add('is-pending'))

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.remove('is-pending')
            observer.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
    )
    belowFold.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}
