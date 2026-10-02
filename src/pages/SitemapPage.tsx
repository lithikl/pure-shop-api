import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

const SitemapPage = () => {
  const sections = [
    {
      title: "Shop",
      links: [
        { label: "All Products", href: "/products" },
        { label: "Collections", href: "/collections" },
        { label: "New Arrivals", href: "/collections/new-arrivals" },
      ],
    },
    {
      title: "Account",
      links: [
        { label: "My Account", href: "/account" },
        { label: "Cart", href: "/cart" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Terms & Conditions", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Cookie Policy", href: "/cookies" },
        { label: "Shipping & Returns", href: "/shipping" },
      ],
    },
  ];

  return (
    <Layout>
      <Helmet>
        <title>Sitemap | VOID™</title>
        <meta name="description" content="Sitemap for VOID™ store. Find all pages and sections of our website." />
      </Helmet>
      
      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-base font-normal mb-8">Sitemap</h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-sm font-normal mb-4">{section.title}</h2>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default SitemapPage;
