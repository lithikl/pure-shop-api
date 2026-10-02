import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCartStore } from '@/stores/cartStore';
import OffCanvasMenu from './OffCanvasMenu';
import SearchPanel from './SearchPanel';
import CartDrawer from './CartDrawer';
import Logo from './Logo';

export default function Navbar() {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(true);
  const totalItems = useCartStore(state => state.getTotalItems());
  const setCartOpen = useCartStore(state => state.setOpen);
  const cartOpen = useCartStore(state => state.isOpen);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navStyles = scrolled
    ? 'bg-background/90 backdrop-blur-xl border-b border-border/80 shadow-[0_8px_35px_rgba(0,0,0,0.05)]'
    : 'bg-transparent border-transparent';

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navStyles}`}>
        <nav className="nav-height flex items-center justify-between page-padding">
          <button
            onClick={() => setMenuOpen(true)}
            className="group flex min-h-11 items-center gap-3 rounded-full border border-foreground/15 px-5 text-[11px] font-medium uppercase tracking-[0.24em] transition-all duration-300 hover:-translate-y-0.5 hover:bg-foreground hover:text-background hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
            aria-label="Open menu"
          >
            <span className="flex w-5 flex-col gap-1">
              <span className="h-px w-5 bg-current transition-transform duration-300 group-hover:translate-x-1" />
              <span className="h-px w-3 bg-current transition-transform duration-300 group-hover:w-5" />
            </span>
            Menu
          </button>

          <Link to="/" className="absolute left-1/2 -translate-x-1/2 transition-transform duration-300 hover:scale-[1.04]">
            <Logo />
          </Link>

          <div className="ml-auto flex items-center gap-2 md:gap-3">
            {!isMobile && (
              <>
                <button onClick={() => setSearchOpen(true)} className="min-h-11 rounded-full px-4 text-[10px] uppercase tracking-[0.2em] transition hover:bg-secondary">Search</button>
                <Link to="/account" className="min-h-11 rounded-full px-4 flex items-center text-[10px] uppercase tracking-[0.2em] transition hover:bg-secondary">Account</Link>
              </>
            )}
            <button onClick={() => setCartOpen(true)} className="group relative min-h-11 rounded-full border border-foreground/15 px-5 text-[10px] uppercase tracking-[0.2em] transition-all duration-300 hover:-translate-y-0.5 hover:bg-foreground hover:text-background" aria-label="Open cart">
              Cart{totalItems > 0 && ` (${totalItems})`}
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          </div>
        </nav>
      </header>

      <OffCanvasMenu open={menuOpen} onClose={() => setMenuOpen(false)} onOpenSearch={() => setSearchOpen(true)} />
      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
