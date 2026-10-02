import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCollectionByHandle, type ShopifyProduct } from '@/lib/shopify';
import { useFormattedPrice } from '@/hooks/useFormattedPrice';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

interface FeaturedProductsProps {
  collectionHandle?: string;
  limit?: number;
}

export default function FeaturedProducts({ collectionHandle = 'frontpage', limit = 6 }: FeaturedProductsProps) {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { formatPrice } = useFormattedPrice();

  useEffect(() => {
    let active = true;
    fetchCollectionByHandle(collectionHandle, limit)
      .then((data) => active && data && setProducts(data.products))
      .catch((e) => import.meta.env.DEV && console.error(e))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [collectionHandle, limit]);

  return (
    <section className="page-padding pb-28 md:pb-44">
      <SectionHeading
        index="01"
        eyebrow="Selected pieces"
        title={<>The <span className="italic font-light">first</span> release</>}
        link={{ to: '/products', label: 'View all' }}
      />

      <div className="mt-12 md:mt-16 grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-secondary animate-pulse" />
            ))
          : products.map((product, i) => {
              const { node } = product;
              const img = node.images.edges[0]?.node;
              return (
                <Reveal key={node.id} delay={(i % 3) * 100}>
                  <Link to={`/product/${node.handle}`} className="group block">
                    <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
                      {img && (
                        <img
                          src={img.url}
                          alt={img.altText || node.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                        />
                      )}
                      <span className="absolute top-3 left-3 eyebrow">No. {String(i + 1).padStart(2, '0')}</span>
                      {!node.availableForSale && (
                        <span className="absolute bottom-3 left-3 eyebrow">Sold out</span>
                      )}
                    </div>
                    <div className="mt-4 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                      <p className="font-display normal-case text-lg md:text-xl">{node.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(node.priceRange.minVariantPrice.amount)}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
      </div>
    </section>
  );
}
