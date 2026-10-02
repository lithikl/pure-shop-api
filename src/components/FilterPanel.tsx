import { useEffect, useRef, useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { ShopifyProduct } from '@/lib/shopify';

interface FilterPanelProps {
  open: boolean;
  onClose: () => void;
  products: ShopifyProduct[];
  onFilterChange: (filtered: ShopifyProduct[]) => void;
  activeFilterCount: number;
}

type SortOption = 'default' | 'price-low' | 'price-high';

export default function FilterPanel({ 
  open, 
  onClose, 
  products, 
  onFilterChange,
  activeFilterCount 
}: FilterPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showInStock, setShowInStock] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('default');

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

  // Extract available sizes and collections from products
  const { availableSizes, availableCollections } = useMemo(() => {
    const sizes = new Set<string>();
    const collections = new Map<string, { title: string; handle: string }>();

    products.forEach((product) => {
      product.node.options.forEach((option) => {
        if (option.name.toLowerCase() === 'size') {
          option.values.forEach((v) => sizes.add(v));
        }
      });
      
      // Get collections from product
      product.node.collections?.edges.forEach((edge) => {
        const handle = edge.node.handle;
        // Skip frontpage/homepage collections
        if (handle !== 'frontpage' && handle !== 'home-page') {
          collections.set(handle, { title: edge.node.title, handle });
        }
      });
    });

    return {
      availableSizes: Array.from(sizes),
      availableCollections: Array.from(collections.values()),
    };
  }, [products]);

  // Apply filters
  useEffect(() => {
    let filtered = [...products];

    if (selectedSizes.length > 0) {
      filtered = filtered.filter((product) =>
        product.node.options.some(
          (option) =>
            option.name.toLowerCase() === 'size' &&
            option.values.some((v) => selectedSizes.includes(v))
        )
      );
    }

    if (selectedTypes.length > 0) {
      filtered = filtered.filter((product) =>
        product.node.collections?.edges.some((edge) =>
          selectedTypes.includes(edge.node.handle)
        )
      );
    }

    if (showInStock) {
      filtered = filtered.filter((product) => product.node.availableForSale);
    }

    if (sortBy === 'price-low') {
      filtered.sort(
        (a, b) =>
          parseFloat(a.node.priceRange.minVariantPrice.amount) -
          parseFloat(b.node.priceRange.minVariantPrice.amount)
      );
    } else if (sortBy === 'price-high') {
      filtered.sort(
        (a, b) =>
          parseFloat(b.node.priceRange.minVariantPrice.amount) -
          parseFloat(a.node.priceRange.minVariantPrice.amount)
      );
    }

    onFilterChange(filtered);
  }, [products, selectedSizes, selectedTypes, showInStock, sortBy, onFilterChange]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleType = (handle: string) => {
    setSelectedTypes((prev) =>
      prev.includes(handle) ? prev.filter((t) => t !== handle) : [...prev, handle]
    );
  };

  const clearFilters = () => {
    setSelectedSizes([]);
    setSelectedTypes([]);
    setShowInStock(false);
    setSortBy('default');
  };

  const hasActiveFilters =
    selectedSizes.length > 0 || selectedTypes.length > 0 || showInStock || sortBy !== 'default';

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
        className={`absolute top-0 left-0 h-full w-[320px] max-w-[85vw] bg-background ${isClosing ? 'animate-slide-out-left' : 'animate-slide-in-left'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Filter panel"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="nav-height flex items-center justify-between page-padding border-b border-border">
            <span className="text-sm font-medium uppercase">Filters</span>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="p-2 -mr-2 hover:opacity-60 transition-opacity"
              aria-label="Close filters"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto py-6 page-padding">
            {/* Sort By */}
            <div className="mb-8">
              <h3 className="text-xs uppercase text-muted-foreground mb-4">Sort By</h3>
              <div className="space-y-3">
                {[
                  { value: 'default', label: 'Default' },
                  { value: 'price-low', label: 'Price: Low to High' },
                  { value: 'price-high', label: 'Price: High to Low' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 text-sm cursor-pointer hover:opacity-60 transition-opacity"
                  >
                    <input
                      type="radio"
                      name="sort"
                      checked={sortBy === option.value}
                      onChange={() => setSortBy(option.value as SortOption)}
                      className="w-3 h-3 accent-foreground"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            {availableSizes.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xs uppercase text-muted-foreground mb-4">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`px-4 py-2 text-sm border transition-colors ${
                        selectedSizes.includes(size)
                          ? 'border-foreground bg-foreground text-background'
                          : 'border-border hover:border-foreground'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Category Filter */}
            {availableCollections.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xs uppercase text-muted-foreground mb-4">Category</h3>
                <div className="space-y-3">
                  {availableCollections.map((collection) => (
                    <label
                      key={collection.handle}
                      className="flex items-center gap-3 text-sm cursor-pointer hover:opacity-60 transition-opacity"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(collection.handle)}
                        onChange={() => toggleType(collection.handle)}
                        className="w-3 h-3 accent-foreground"
                      />
                      {collection.title}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Availability Filter */}
            <div className="mb-8">
              <h3 className="text-xs uppercase text-muted-foreground mb-4">Availability</h3>
              <label className="flex items-center gap-3 text-sm cursor-pointer hover:opacity-60 transition-opacity">
                <input
                  type="checkbox"
                  checked={showInStock}
                  onChange={(e) => setShowInStock(e.target.checked)}
                  className="w-3 h-3 accent-foreground"
                />
                In Stock Only
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="page-padding py-4 border-t border-border flex gap-4">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex-1 py-3 text-sm uppercase border border-border hover:border-foreground transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 py-3 text-sm uppercase bg-foreground text-background hover:opacity-80 transition-opacity"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export a hook to track filter count
export function useFilterCount(
  selectedSizes: string[],
  selectedTypes: string[],
  showInStock: boolean,
  sortBy: string
): number {
  return (
    selectedSizes.length +
    selectedTypes.length +
    (showInStock ? 1 : 0) +
    (sortBy !== 'default' ? 1 : 0)
  );
}
