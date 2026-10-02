import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '@/stores/cartStore';
import { useFormattedPrice } from '@/hooks/useFormattedPrice';

interface CartDrawerProps { open: boolean; onClose: () => void; }

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, getTotalPrice, setOpen } = useCartStore();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { formatPrice } = useFormattedPrice();

  useEffect(() => {
    if (open) {
      setIsVisible(true); setIsClosing(false); closeButtonRef.current?.focus(); document.body.style.overflow = 'hidden';
    } else if (isVisible) {
      setIsClosing(true);
      const timer = setTimeout(() => { setIsVisible(false); setIsClosing(false); document.body.style.overflow = ''; }, 450);
      return () => clearTimeout(timer);
    }
  }, [open, isVisible]);
  useEffect(() => () => { document.body.style.overflow = ''; }, []);
  useEffect(() => {
    const key = (e: KeyboardEvent) => e.key === 'Escape' && open && onClose();
    document.addEventListener('keydown', key); return () => document.removeEventListener('keydown', key);
  }, [open, onClose]);

  const close = () => { setOpen(false); onClose(); };
  if (!isVisible) return null;
  const total = getTotalPrice();

  return (
    <div className="fixed inset-0 z-[100]">
      <div className={`absolute inset-0 bg-foreground/30 backdrop-blur-[5px] transition-opacity duration-500 ${isClosing ? 'opacity-0' : 'opacity-100'}`} onClick={close} />
      <aside className={`absolute right-0 top-0 flex h-full w-full max-w-[480px] flex-col bg-[#f7f5f0] shadow-[-25px_0_80px_rgba(0,0,0,.12)] transition-transform duration-500 ease-out ${isClosing ? 'translate-x-full' : 'translate-x-0'}`} role="dialog" aria-modal="true" aria-label="Shopping cart">
        <header className="flex h-20 shrink-0 items-center justify-between border-b border-foreground/10 px-6 md:px-8">
          <div><p className="text-[9px] uppercase tracking-[.35em] text-foreground/45">Your selection</p><p className="mt-1 text-lg uppercase tracking-[-.02em]">Cart / {items.length}</p></div>
          <button ref={closeButtonRef} onClick={close} className="text-[10px] uppercase tracking-[.2em] transition hover:opacity-50">Close ×</button>
        </header>

        {items.length === 0 ? (
          <div className="relative flex flex-1 items-center justify-center overflow-hidden">
            <div className="absolute h-72 w-72 rounded-full border border-foreground/[.06] animate-[spin_24s_linear_infinite]" />
            <div className="relative text-center"><p className="text-5xl font-light tracking-[-.06em]">EMPTY</p><p className="mt-3 text-[9px] uppercase tracking-[.3em] text-foreground/45">Nothing here yet</p><Link to="/products" onClick={close} className="mt-7 inline-flex border border-foreground px-7 py-3 text-[10px] uppercase tracking-[.2em] transition hover:bg-foreground hover:text-background">Explore Shop →</Link></div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-5 md:px-8">
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={item.variantId} className="group flex gap-4 border border-foreground/[.08] bg-white/50 p-3 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(0,0,0,.07)]" style={{ animationDelay: `${index * 70}ms` }}>
                    <div className="h-28 w-24 shrink-0 overflow-hidden bg-secondary"><img src={item.product.node.images?.edges?.[0]?.node?.url} alt={item.product.node.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /></div>
                    <div className="min-w-0 flex-1 py-1">
                      <div className="flex justify-between gap-3"><Link to={`/product/${item.product.node.handle}`} onClick={close} className="truncate text-[11px] uppercase tracking-[.08em]">{item.product.node.title}</Link><span className="text-[11px]">{formatPrice(item.price.amount)}</span></div>
                      {item.variantTitle !== 'Default Title' && <p className="mt-1 text-[9px] uppercase tracking-[.14em] text-foreground/45">{item.variantTitle}</p>}
                      <div className="mt-9 flex items-center justify-between"><div className="flex items-center border border-foreground/15"><button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="h-8 w-8 transition hover:bg-foreground hover:text-background">−</button><span className="w-9 text-center text-[10px]">{item.quantity}</span><button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} className="h-8 w-8 transition hover:bg-foreground hover:text-background">+</button></div><button onClick={() => removeItem(item.variantId)} className="text-[9px] uppercase tracking-[.15em] text-foreground/45 transition hover:text-foreground">Remove</button></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <footer className="shrink-0 border-t border-foreground/10 bg-white/35 p-5 md:p-8">
              <div className="mb-5 flex justify-between text-sm"><span className="uppercase tracking-[.08em]">Subtotal</span><span>{formatPrice(total.toString())}</span></div>
              <p className="mb-5 text-[9px] uppercase tracking-[.18em] text-foreground/45">Shipping and taxes calculated at checkout.</p>
              <Link to="/checkout" onClick={close} className="group flex h-14 items-center justify-center gap-3 bg-foreground text-background text-[10px] uppercase tracking-[.25em] transition-all hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(0,0,0,.16)]">Checkout <span className="transition group-hover:translate-x-1">→</span></Link>
              <Link to="/cart" onClick={close} className="mt-3 flex h-12 items-center justify-center border border-foreground text-[10px] uppercase tracking-[.2em] transition hover:bg-foreground hover:text-background">View Full Cart</Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
