import { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import ProductGrid from '@/components/ProductGrid';
import FilterPanel from '@/components/FilterPanel';
import { fetchProducts, ShopifyProduct } from '@/lib/shopify';
import { SlidersHorizontal } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchProducts(24);
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Failed to load products:', error);
        }
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const handleFilterChange = useCallback((filtered: ShopifyProduct[]) => {
    setFilteredProducts(filtered);
    const diff = products.length - filtered.length;
    setActiveFilterCount(diff > 0 ? 1 : 0);
  }, [products.length]);

  return (
    <Layout>
      <Helmet>
        <title>Shop — VOID™</title>
        <meta name="description" content="Browse our collection of ultra-minimal streetwear essentials." />
      </Helmet>
      
      <section className="page-padding py-16 min-h-screen">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-lg uppercase">All Products</h1>
        </div>

        {/* Filter Bar */}
        {!loading && products.length > 0 && (
          <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
            <button
              onClick={() => setFilterOpen(true)}
              className="flex items-center gap-2 text-sm uppercase hover:opacity-60 transition-opacity"
            >
              <SlidersHorizontal className="w-4 h-4" strokeWidth={1.5} />
              Filters
              {filteredProducts.length !== products.length && (
                <span className="text-muted-foreground">
                  ({filteredProducts.length})
                </span>
              )}
            </button>
            <span className="text-sm text-muted-foreground">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            </span>
          </div>
        )}
        
        <ProductGrid products={filteredProducts} loading={loading} />
      </section>

      {/* Filter Panel */}
      <FilterPanel
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        products={products}
        onFilterChange={handleFilterChange}
        activeFilterCount={activeFilterCount}
      />
    </Layout>
  );
}
