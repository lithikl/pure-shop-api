import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronRight } from 'lucide-react';
import Layout from '@/components/Layout';
import { fetchCollections, fetchCollectionByHandle, ShopifyCollection, ShopifyProduct } from '@/lib/shopify';

export default function CollectionsPage() {
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [collectionProducts, setCollectionProducts] = useState<Record<string, ShopifyProduct[]>>({});
  const [hoveredCollection, setHoveredCollection] = useState<string | null>(null);

  useEffect(() => {
    async function loadCollections() {
      try {
        const data = await fetchCollections(20);
        // Filter out homepage-only collection(s)
        const filteredData = data.filter((c) => {
          const handle = c.node.handle?.trim().toLowerCase();
          const title = c.node.title?.trim().toLowerCase();
          return handle !== 'frontpage' && title !== 'home page';
        });
        setCollections(filteredData);
        
        // Load products for all collections
        filteredData.forEach(async (collection) => {
          const handle = collection.node.handle;
          try {
            const collectionData = await fetchCollectionByHandle(handle, 5);
            if (collectionData) {
              setCollectionProducts(prev => ({
                ...prev,
                [handle]: collectionData.products.slice(0, 5)
              }));
            }
          } catch (error) {
            if (import.meta.env.DEV) {
              console.error(`Failed to load products for ${handle}:`, error);
            }
          }
        });
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Failed to load collections:', error);
        }
      } finally {
        setLoading(false);
      }
    }
    loadCollections();
  }, []);

  return (
    <Layout>
      <Helmet>
        <title>Collections — VOID™</title>
        <meta name="description" content="Browse our curated collections of minimal streetwear essentials." />
      </Helmet>

      <section className="page-padding pb-12">
        <div className="py-12">
          <p className="text-xs text-muted-foreground">Collections</p>
        </div>

        {loading ? (
          <div className="border-t border-border">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="py-5 border-b border-border animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="h-5 bg-secondary/50 w-1/4" />
                  <div className="flex gap-2">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <div key={j} className="w-20 h-20 bg-secondary/30" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : collections.length === 0 ? (
          <div className="py-20 text-center border-t border-border">
            <p className="text-sm text-muted-foreground mb-2">No collections found</p>
            <p className="text-xs text-muted-foreground">
              Create collections in Shopify to organize your products.
            </p>
          </div>
        ) : (
          <div className="border-t border-border">
            {collections.map((collection) => {
              const handle = collection.node.handle;
              const isHovered = hoveredCollection === handle;
              const products = collectionProducts[handle] || [];
              const isLoading = !collectionProducts[handle];

              return (
                <Link
                  key={collection.node.id}
                  to={`/collections/${handle}`}
                  className="flex items-center justify-between py-5 border-b border-border"
                  onMouseEnter={() => setHoveredCollection(handle)}
                  onMouseLeave={() => setHoveredCollection(null)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium uppercase text-foreground">
                      {collection.node.title}
                    </span>
                    {!isLoading && (
                      <span className="text-xs text-muted-foreground">
                        ({products.length})
                      </span>
                    )}
                    <ChevronRight className={`
                      w-4 h-4 transition-all duration-300
                      ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}
                    `} />
                  </div>

                  {/* Product thumbnails */}
                  <div className="flex items-center gap-2 h-20">
                    {isLoading ? (
                      <div className="flex gap-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className="w-20 h-20 animate-pulse bg-secondary/30"
                          />
                        ))}
                      </div>
                    ) : products.length > 0 ? (
                      products.map((product) => {
                        const image = product.node.images.edges[0]?.node;
                        return (
                          <div
                            key={product.node.id}
                            className="w-20 h-20 flex-shrink-0 overflow-hidden"
                          >
                            {image ? (
                              <img
                                src={image.url}
                                alt={image.altText || product.node.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-secondary/30 flex items-center justify-center text-xs text-muted-foreground">
                                No image
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <span className="text-xs text-muted-foreground">No products</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </Layout>
  );
}