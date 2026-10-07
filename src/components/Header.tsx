import { useEffect, useState } from 'react'
import { site } from '../config/site'
import { whatsappLink } from '../lib/whatsapp'
import { CloseIcon, MenuIcon, PhoneIcon, WhatsAppIcon } from './icons'
import { Logo } from './Logo'

const navLinks = [
  { href: '#services', label: 'Services' },
  { href: '#storage', label: 'Storage' },
  { href: '#coverage', label: 'Coverage' },
  { href: '#faq', label: 'FAQ' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className={`header${scrolled ? ' is-scrolled' : ''}${menuOpen ? ' is-open' : ''}`}>
      <div className="header__inner container">
        <a href="#top" className="header__brand" aria-label={`${site.name} — home`}>
          <Logo />
        </a>
        <nav className="header__nav" aria-label="Main">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="header__actions">
          <a className="header__phone" href={`tel:${site.phoneE164}`}>
            <PhoneIcon width={18} height={18} /> <span>{site.phoneDisplay}</span>
          </a>
          <a className="btn btn--cta btn--sm" href="#quote">
            Get a quote
          </a>
          <button
            type="button"
            className="header__menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
      <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile" hidden={!menuOpen}>
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} onClick={closeMenu}>
            {link.label}
          </a>
        ))}
        <a href={whatsappLink()} target="_blank" rel="noopener" onClick={closeMenu}>
          <WhatsAppIcon width={20} height={20} /> WhatsApp us
        </a>
        <a href={`tel:${site.phoneE164}`} onClick={closeMenu}>
          <PhoneIcon width={20} height={20} /> {site.phoneDisplay}
        </a>
      </nav>
    </header>
  )
}
