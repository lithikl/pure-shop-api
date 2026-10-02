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
  const [scrolled, setScrolled] = useState(false);
  const totalItems = useCartStore(state => state.getTotalItems());
  const setCartOpen = useCartStore(state => state.setOpen);
  const cartOpen = useCartStore(state => state.isOpen);
  const location = useLocation();
  
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    // Always show solid navbar
    setScrolled(true);
  }, []);

  const navStyles = scrolled
    ? 'bg-background/95 backdrop-blur-sm border-b border-border text-foreground'
    : 'bg-transparent border-transparent text-white';

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navStyles}`}>
        <nav className="nav-height flex items-center justify-between page-padding">
          {/* Left - Menu button */}
          <button
            onClick={() => setMenuOpen(true)}
            className="text-xs uppercase tracking-wide hover:opacity-60 transition-opacity"
            aria-label="Open menu"
          >
            Menu
          </button>

          {/* Center - Logo */}
          <Link 
            to="/" 
            className="absolute left-1/2 -translate-x-1/2"
          >
            <Logo />
          </Link>

          {/* Right - Actions */}
          <div className="flex items-center gap-4">
            {!isMobile && (
              <>
                <button
                  onClick={() => setSearchOpen(true)}
                  className="text-xs uppercase tracking-wide hover:opacity-60 transition-opacity"
                  aria-label="Search"
                >
                  Search
                </button>
                
                <Link
                  to="/account"
                  className="text-xs uppercase tracking-wide hover:opacity-60 transition-opacity"
                  aria-label="Account"
                >
                  Account
                </Link>
              </>
            )}
            
            <button
              onClick={() => setCartOpen(true)}
              className="text-xs uppercase tracking-wide hover:opacity-60 transition-opacity"
              aria-label="Cart"
            >
              Cart{totalItems > 0 && ` (${totalItems})`}
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
