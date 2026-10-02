import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocaleStore, LOCALE_OPTIONS } from '@/stores/localeStore';

interface OffCanvasMenuProps {
  open: boolean;
  onClose: () => void;
  onOpenSearch?: () => void;
}

const menuLinks = [
  { label: 'Shop', href: '/products' },
  { label: 'Collections', href: '/collections' },
  { label: 'New Arrivals', href: '/collections/new-arrivals' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const legalLinks = [
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Cookie Policy', href: '/cookies' },
  { label: 'Shipping & Returns', href: '/shipping' },
  { label: 'Sitemap', href: '/sitemap' },
];

export default function OffCanvasMenu({ open, onClose, onOpenSearch }: OffCanvasMenuProps) {
  const isMobile = useIsMobile();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [localeOpen, setLocaleOpen] = useState(false);
  const { selectedLocale, setLocale } = useLocaleStore();

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      setIsClosing(false);
      closeButtonRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else if (isVisible) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsClosing(false);
        document.body.style.overflow = '';
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Overlay */}
      <div 
        className={`absolute inset-0 bg-foreground/20 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Panel */}
      <div
        ref={panelRef}
        className={`absolute top-0 left-0 h-full w-[280px] max-w-[80vw] bg-background ${isClosing ? 'animate-slide-out-left' : 'animate-slide-in-left'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="nav-height flex items-center justify-end page-padding border-b border-border">
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="text-xs uppercase tracking-wide hover:opacity-60 transition-opacity"
              aria-label="Close menu"
            >
              Close
            </button>
          </div>

          {/* Main Links */}
          <nav className="flex-1 py-8 page-padding overflow-y-auto">
            <ul className="space-y-4">
              {menuLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    onClick={onClose}
                    className="text-sm uppercase hover:opacity-60 transition-opacity"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {isMobile && (
                <>
                  <li>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenSearch?.();
                      }}
                      className="text-sm uppercase hover:opacity-60 transition-opacity"
                    >
                      Search
                    </button>
                  </li>
                  <li>
                    <Link
                      to="/account"
                      onClick={onClose}
                      className="text-sm uppercase hover:opacity-60 transition-opacity"
                    >
                      Account
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>


          {/* Country/Currency Selector */}
          <div className="page-padding py-4 border-t border-border">
            <button
              onClick={() => setLocaleOpen(!localeOpen)}
              className="text-xs uppercase tracking-wide hover:opacity-60 transition-opacity flex items-center justify-between w-full"
            >
              <span>{selectedLocale.country} ({selectedLocale.currencyCode})</span>
              <span className="text-muted-foreground">{localeOpen ? '−' : '+'}</span>
            </button>
            
            {localeOpen && (
              <ul className="mt-3 space-y-2">
                {LOCALE_OPTIONS.map((option) => (
                  <li key={option.countryCode}>
                    <button
                      onClick={() => {
                        setLocale(option);
                        setLocaleOpen(false);
                      }}
                      className={`text-xs hover:opacity-60 transition-opacity w-full text-left ${
                        selectedLocale.countryCode === option.countryCode 
                          ? 'text-foreground' 
                          : 'text-muted-foreground'
                      }`}
                    >
                      {option.country} ({option.currencyCode})
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Legal Links */}
          <div className="page-padding py-4 border-t border-border">
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    onClick={onClose}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>


          {/* Footer */}
          <div className="page-padding py-4">
            <p className="text-xs text-muted-foreground">© 2025 VOID™</p>
          </div>
        </div>
      </div>
    </div>
  );
}
