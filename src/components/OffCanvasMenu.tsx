import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocaleStore, LOCALE_OPTIONS } from '@/stores/localeStore';

interface OffCanvasMenuProps {
  open: boolean;
  onClose: () => void;
  onOpenSearch?: () => void;
}

const menuLinks = [
  { label: 'Shop', href: '/products', index: '01' },
  { label: 'Collections', href: '/collections', index: '02' },
  { label: 'New Arrivals', href: '/collections/new-arrivals', index: '03' },
  { label: 'About', href: '/about', index: '04' },
  { label: 'Contact', href: '/contact', index: '05' },
];

const legalLinks = [
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Cookie Policy', href: '/cookies' },
  { label: 'Shipping & Returns', href: '/shipping' },
  { label: 'Sitemap', href: '/sitemap' },
];

export default function OffCanvasMenu({ open, onClose, onOpenSearch }: OffCanvasMenuProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [localeOpen, setLocaleOpen] = useState(false);
  const { selectedLocale, setLocale } = useLocaleStore();

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      setIsClosing(false);
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => closeButtonRef.current?.focus());
    } else if (isVisible) {
      setIsClosing(true);
      const timer = window.setTimeout(() => {
        setIsVisible(false);
        setIsClosing(false);
        document.body.style.overflow = '';
      }, 500);
      return () => window.clearTimeout(timer);
    }
  }, [open, isVisible]);

  useEffect(() => () => { document.body.style.overflow = ''; }, []);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])')
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <div
        className={`absolute inset-0 bg-foreground/30 backdrop-blur-[6px] transition-opacity duration-500 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        ref={panelRef}
        className={`absolute left-0 top-0 h-full w-full max-w-[980px] overflow-hidden bg-[#f5f3ee] shadow-[30px_0_100px_rgba(0,0,0,0.14)] transition-transform duration-700 ease-[cubic-bezier(.76,0,.24,1)] ${isClosing ? '-translate-x-full' : 'translate-x-0'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.16]" style={{ backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        <div className="pointer-events-none absolute -right-32 top-1/3 h-[34rem] w-[34rem] rounded-full border border-foreground/[0.08] animate-[spin_28s_linear_infinite]" />
        <div className="pointer-events-none absolute right-24 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-white/70 blur-3xl animate-pulse" />

        <div className="relative flex h-full flex-col">
          <header className="flex h-20 shrink-0 items-center justify-between border-b border-foreground/10 px-6 md:px-12">
            <div className="flex items-center gap-3 text-[9px] uppercase tracking-[0.35em] text-foreground/50">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-foreground" />
              NOIRKNULL / NAVIGATION
            </div>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="group flex items-center gap-3 text-[11px] uppercase tracking-[0.25em]"
              aria-label="Close menu"
            >
              <span className="transition-transform duration-300 group-hover:rotate-90">×</span>
              Close
            </button>
          </header>

          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:flex-row">
            <nav className="flex-1 px-6 py-10 md:px-12 md:py-14 lg:px-16 lg:py-16">
              <p className="mb-7 text-[9px] uppercase tracking-[0.4em] text-foreground/45">Explore</p>
              <ul className="space-y-1">
                {menuLinks.map((link, i) => (
                  <li key={link.href} className="overflow-hidden">
                    <Link
                      to={link.href}
                      onClick={onClose}
                      className="group/link flex items-baseline gap-5 py-2 md:py-3 animate-[menuItemIn_650ms_cubic-bezier(.22,1,.36,1)_both]"
                      style={{ animationDelay: `${i * 70 + 120}ms` }}
                    >
                      <span className="w-7 text-[9px] tracking-[0.2em] text-foreground/35 transition-colors duration-300 group-hover/link:text-foreground">{link.index}</span>
                      <span className="relative text-[clamp(2.4rem,5.2vw,5rem)] font-light uppercase leading-[0.95] tracking-[-0.045em] transition-all duration-500 group-hover/link:translate-x-4 group-hover/link:italic">
                        {link.label}
                        <span className="absolute -bottom-1 left-0 h-px w-0 bg-foreground transition-all duration-500 group-hover/link:w-full" />
                      </span>
                      <span className="ml-auto text-xl opacity-0 transition-all duration-500 group-hover/link:translate-x-1 group-hover/link:opacity-100">↗</span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3 lg:hidden">
                <button onClick={() => { onClose(); onOpenSearch?.(); }} className="border border-foreground px-5 py-3 text-[10px] uppercase tracking-[0.22em] transition hover:bg-foreground hover:text-background">Search</button>
                <Link to="/account" onClick={onClose} className="border border-foreground/30 px-5 py-3 text-[10px] uppercase tracking-[0.22em] transition hover:bg-foreground hover:text-background">Account</Link>
              </div>
            </nav>

            <aside className="w-full shrink-0 border-t border-foreground/10 p-6 md:p-12 lg:w-[300px] lg:border-l lg:border-t-0 lg:p-10">
              <div className="mb-10">
                <p className="mb-4 text-[9px] uppercase tracking-[0.4em] text-foreground/45">At a glance</p>
                <div className="border border-foreground/10 bg-white/45 p-5 backdrop-blur-sm">
                  <p className="text-5xl font-light tracking-[-0.06em]">N°01</p>
                  <p className="mt-3 text-[9px] uppercase leading-5 tracking-[0.22em] text-foreground/55">Independent streetwear<br />Chennai / India</p>
                </div>
              </div>

              <div className="mb-10">
                <button onClick={() => setLocaleOpen(!localeOpen)} className="flex w-full items-center justify-between border-b border-foreground/15 pb-4 text-[10px] uppercase tracking-[0.22em]">
                  <span>{selectedLocale.country} / {selectedLocale.currencyCode}</span>
                  <span className="text-lg transition-transform duration-300">{localeOpen ? '−' : '+'}</span>
                </button>
                <div className={`grid transition-all duration-500 ${localeOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
                  <ul className="overflow-hidden space-y-2">
                    {LOCALE_OPTIONS.map((option) => (
                      <li key={option.countryCode}>
                        <button onClick={() => { setLocale(option); setLocaleOpen(false); }} className="w-full py-1 text-left text-[10px] uppercase tracking-[0.15em] text-foreground/55 transition hover:translate-x-2 hover:text-foreground">
                          {option.country} ({option.currencyCode})
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <p className="mb-4 text-[9px] uppercase tracking-[0.4em] text-foreground/45">Information</p>
                <ul className="space-y-2">
                  {legalLinks.map((link) => (
                    <li key={link.href}>
                      <Link to={link.href} onClick={onClose} className="group flex items-center justify-between py-1 text-[10px] uppercase tracking-[0.14em] text-foreground/55 transition hover:text-foreground">
                        {link.label}<span className="opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>

          <footer className="hidden shrink-0 border-t border-foreground/10 px-6 py-4 text-[8px] uppercase tracking-[0.3em] text-foreground/35 md:flex md:justify-between md:px-12">
            <span>NOIRKNULL / Objects / Attitude / Form</span>
            <span>© 2026 NOIRKNULL</span>
          </footer>
        </div>
      </aside>
    </div>
  );
}
