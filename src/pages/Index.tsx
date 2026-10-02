import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import HomeHero from '@/components/home/HomeHero';
import Manifesto from '@/components/home/Manifesto';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import EditorialSplit from '@/components/home/EditorialSplit';
import CategoryIndex from '@/components/home/CategoryIndex';
import HomeFooter from '@/components/home/HomeFooter';

export default function Index() {
  return (
    <Layout dark>
      <Helmet>
        <title>NOIRKNULL — Footwear & Silver, Reduced to Essentials</title>
        <meta
          name="description"
          content="NOIRKNULL makes minimal leather footwear and sterling silver jewelry. Black by intention, null by design."
        />
      </Helmet>
      <HomeHero />
      <Manifesto />
      <FeaturedProducts collectionHandle="frontpage" />
      <EditorialSplit />
      <CategoryIndex />
      <HomeFooter />
    </Layout>
  );
}
