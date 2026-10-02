import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import heroImage from '@/assets/hero-image.webp';

export default function AboutPage() {
  return (
    <Layout>
      <Helmet>
        <title>About — VOID™</title>
        <meta name="description" content="VOID™ — Ultra-minimal streetwear for those who value simplicity." />
      </Helmet>

      <section className="min-h-[calc(100vh-3.5rem)]">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[calc(100vh-3.5rem)]">
          {/* Image Column */}
          <div className="h-64 md:h-auto">
            <img 
              src={heroImage} 
              alt="VOID™ brand imagery" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Text Column */}
          <div className="flex items-center page-padding py-16 md:py-0">
            <div className="max-w-sm">
              <h1 className="text-sm mb-8">About</h1>
              
              <div className="space-y-6 text-xs text-muted-foreground leading-relaxed">
                <p>
                  VOID™ is built on the principle that less is more. We create essential 
                  pieces that exist at the intersection of comfort and design.
                </p>
                <p>
                  Every garment is designed with intention—clean lines, quality materials, 
                  and timeless silhouettes that transcend seasonal trends.
                </p>
                <p>
                  Founded in 2024, we believe clothing should be felt, not seen. 
                  Our collections are meant to complement, never to dominate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
