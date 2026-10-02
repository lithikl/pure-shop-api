import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useFormattedPrice } from '@/hooks/useFormattedPrice';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, isLoading, updateQuantity, removeItem, checkout, getTotalPrice, setOpen } = useCartStore();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { formatPrice } = useFormattedPrice();

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

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  if (!isVisible) return null;

  const totalPrice = getTotalPrice();

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Overlay */}
      <div 
        className={`absolute inset-0 bg-foreground/20 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
        onClick={handleClose}
        aria-hidden="true"
      />
      
      {/* Panel */}
      <div
        className={`absolute top-0 right-0 h-full w-full max-w-[400px] bg-background flex flex-col ${isClosing ? 'animate-slide-out-right' : 'animate-slide-in-right'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="nav-height flex items-center justify-between page-padding border-b border-border flex-shrink-0">
          <span className="text-sm uppercase tracking-wide">Cart ({items.length})</span>
          <button
            ref={closeButtonRef}
            onClick={handleClose}
            className="text-xs uppercase tracking-wide hover:opacity-60 transition-opacity"
            aria-label="Close cart"
          >
            Close
          </button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">Your cart is empty</p>
              <Link
                to="/"
                onClick={handleClose}
                className="text-sm underline underline-offset-4 hover:opacity-60 transition-opacity"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              <div className="divide-y divide-border">
                {items.map((item) => (
                  <div key={item.variantId} className="p-4 flex gap-4">
                    <div className="w-20 h-20 bg-secondary flex-shrink-0">
                      {item.product.node.images?.edges?.[0]?.node && (
                        <img
                          src={item.product.node.images.edges[0].node.url}
                          alt={item.product.node.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-xs mb-1 line-clamp-1 uppercase">{item.product.node.title}</p>
                      {item.variantTitle !== 'Default Title' && (
                        <p className="text-xs text-muted-foreground mb-2">{item.variantTitle}</p>
                      )}
                      <p className="text-sm">
                        {formatPrice(item.price.amount)}
                      </p>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-border">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-secondary transition-colors text-xs"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-xs">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-secondary transition-colors text-xs"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 border-t border-border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Subtotal</span>
                <span className="text-sm">{formatPrice(totalPrice.toString())}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Shipping and taxes calculated at checkout.
              </p>
              <button
                onClick={checkout}
                disabled={isLoading}
                className="w-full h-12 bg-foreground text-background text-xs uppercase hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating checkout...
                  </>
                ) : (
                  'Checkout'
                )}
              </button>
              <Link
                to="/cart"
                onClick={handleClose}
                className="block w-full h-12 border border-border text-xs uppercase hover:bg-secondary transition-colors flex items-center justify-center mt-2"
              >
                View Cart
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
