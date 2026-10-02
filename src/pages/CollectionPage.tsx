import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronLeft, Loader2 } from 'lucide-react';
import Layout from '@/components/Layout';
import ProductGrid from '@/components/ProductGrid';
import { fetchCollectionByHandle, fetchProductsByTag, ShopifyCollection, ShopifyProduct } from '@/lib/shopify';

// Special virtual collections that filter by tag instead of Shopify collections
const VIRTUAL_COLLECTIONS: Record<string, { title: string; description: string; tag: string }> = {
  // Add virtual collections here if needed (tag-based filtering)
};

export default function CollectionPage() {
  const { handle } = useParams<{ handle: string }>();
  const [collection, setCollection] = useState<ShopifyCollection['node'] | null>(null);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCollection() {
      if (!handle) return;
      
      // Check if this is a virtual collection (tag-based)
      const virtualCollection = VIRTUAL_COLLECTIONS[handle];
      if (virtualCollection) {
        try {
          const taggedProducts = await fetchProductsByTag(virtualCollection.tag);
          setCollection({
            id: handle,
            title: virtualCollection.title,
            handle: handle,
            description: virtualCollection.description
          });
          setProducts(taggedProducts);
        } catch (error) {
          if (import.meta.env.DEV) {
            console.error('Failed to load virtual collection:', error);
          }
        } finally {
          setLoading(false);
        }
        return;
      }
      
      // Regular Shopify collection
      try {
        const data = await fetchCollectionByHandle(handle);
        if (data) {
          setCollection(data.collection);
          setProducts(data.products);
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Failed to load collection:', error);
        }
      } finally {
        setLoading(false);
      }
    }
    loadCollection();
  }, [handle]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (!collection) {
    return (
      <Layout>
        <div className="page-padding py-20 text-center">
          <p className="text-sm text-muted-foreground mb-4">Collection not found</p>
          <Link to="/collections" className="text-sm underline underline-offset-4">
            View all collections
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>{collection.title} — VOID™</title>
        <meta name="description" content={collection.description?.slice(0, 160) || `Shop the ${collection.title} collection at VOID™`} />
      </Helmet>

      <div className="page-padding py-12">
        <Link
          to="/collections"
          className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Collections
        </Link>
      </div>

      <section className="page-padding pb-12">
        <h1 className="text-sm mb-8">{collection.title}</h1>
        <ProductGrid products={products} />
      </section>
    </Layout>
  );
}
