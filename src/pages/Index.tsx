import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import FeaturedCarousel from '@/components/FeaturedCarousel';

export default function Index() {
  return (
    <Layout>
      <Helmet>
        <title>VOID™ — Minimal Shopify Storefront Template | Lovable</title>
        <meta name="description" content="Shopify storefront for fashion brands. Zero noise, full function. Connect your store, customize, and start selling in minutes." />
      </Helmet>
      
      {/* Hero Section */}
      <section className="h-[calc(100vh-56px)] w-full relative bg-background">
        {/* Featured Products Carousel */}
        <FeaturedCarousel collectionHandle="frontpage" />
        
        {/* CTA Button */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center z-10">
          <Link
            to="/products"
            className="px-8 py-3 text-xs uppercase bg-foreground text-background hover:bg-foreground/80 transition-colors"
          >
            Shop All
          </Link>
        </div>
      </section>
    </Layout>
  );
}
