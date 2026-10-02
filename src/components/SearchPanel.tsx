import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { searchProducts, ShopifyProduct } from '@/lib/shopify';
import { useFormattedPrice } from '@/hooks/useFormattedPrice';

interface SearchPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchPanel({ open, onClose }: SearchPanelProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { formatPrice } = useFormattedPrice();

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.length > 1) {
        setLoading(true);
        try {
          const products = await searchProducts(query);
          setResults(products);
        } catch (error) {
          if (import.meta.env.DEV) {
            console.error('Search error:', error);
          }
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background animate-fade-in">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-xs uppercase tracking-wide hover:opacity-60 transition-opacity"
        aria-label="Close search"
      >
        Close
      </button>

      {/* Centered content */}
      <div 
        className="h-full flex flex-col items-center justify-center px-6"
        role="dialog"
        aria-modal="true"
        aria-label="Search"
      >
        {/* Search input */}
        <div className="w-full max-w-xl">
          <div className="flex items-center border-b border-border pb-4">
            <span className="text-sm text-muted-foreground mr-4 flex-shrink-0 uppercase tracking-wide">Search</span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder=""
              className="flex-1 bg-transparent outline-none text-lg"
            />
            {loading && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />}
          </div>

          {/* Results */}
          {(query.length > 1 || results.length > 0) && (
            <div className="mt-8 max-h-[50vh] overflow-y-auto">
              {results.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {results.map((product) => (
                    <Link
                      key={product.node.id}
                      to={`/product/${product.node.handle}`}
                      onClick={onClose}
                      className="hover:opacity-80 transition-opacity"
                    >
                      <div className="aspect-square bg-secondary mb-3">
                        {product.node.images.edges[0] && (
                          <img
                            src={product.node.images.edges[0].node.url}
                            alt={product.node.images.edges[0].node.altText || product.node.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <p className="text-xs mb-1 line-clamp-1">{product.node.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(product.node.priceRange.minVariantPrice.amount)}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : query.length > 1 && !loading ? (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">No products found</p>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
