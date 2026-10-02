import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShopifyProduct } from '@/lib/shopify';
import { Badge } from '@/components/ui/badge';
import { useFormattedPrice } from '@/hooks/useFormattedPrice';

interface ProductCardProps {
  product: ShopifyProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageIndex, setImageIndex] = useState(0);
  const { node } = product;
  const images = node.images.edges;
  const hasMultipleImages = images.length > 1;
  const { formatPrice } = useFormattedPrice();
  
  // Check if product has "new" tag (case-insensitive)
  const isNew = node.tags?.some(tag => tag.toLowerCase() === 'new');

  return (
    <Link
      to={`/product/${node.handle}`}
      className="group block"
      onMouseEnter={() => hasMultipleImages && setImageIndex(1)}
      onMouseLeave={() => setImageIndex(0)}
    >
      <div className="aspect-square bg-secondary mb-3 overflow-hidden relative">
        {images[imageIndex] ? (
          <img
            src={images[imageIndex].node.url}
            alt={images[imageIndex].node.altText || node.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
            No image
          </div>
        )}
        
        {isNew && (
          <Badge variant="outline" className="absolute top-2 left-2 bg-background text-xs px-1.5 py-0.5 rounded-none font-normal uppercase">
            New
          </Badge>
        )}
        
        {!node.availableForSale && (
          <div className="absolute bottom-0 left-0 right-0 bg-background/90 py-2 text-center">
            <span className="text-xs text-muted-foreground">Sold out</span>
          </div>
        )}
      </div>
      
      <p className="text-xs mb-1 line-clamp-1 uppercase">{node.title}</p>
      <p className="text-xs text-muted-foreground">
        {formatPrice(node.priceRange.minVariantPrice.amount)}
      </p>
    </Link>
  );
}
