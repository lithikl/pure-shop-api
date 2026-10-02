import { ShopifyProduct } from '@/lib/shopify';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: ShopifyProduct[];
  loading?: boolean;
}

export default function ProductGrid({ products, loading }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square bg-secondary mb-3" />
            <div className="h-3 bg-secondary mb-2 w-3/4" />
            <div className="h-3 bg-secondary w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-muted-foreground mb-2">No products found</p>
        <p className="text-xs text-muted-foreground">
          Add products via chat to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product.node.id} product={product} />
      ))}
    </div>
  );
}
