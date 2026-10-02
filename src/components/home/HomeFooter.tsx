import { Link } from 'react-router-dom';

const columns = [
  { title: 'Shop', links: [['All products', '/products'], ['Collections', '/collections'], ['Cart', '/cart']] },
  { title: 'House', links: [['About', '/about'], ['Contact', '/contact'], ['Shipping', '/shipping']] },
  { title: 'Legal', links: [['Privacy', '/privacy'], ['Terms', '/terms'], ['Cookies', '/cookies']] },
] as const;

export default function HomeFooter() {
  return (
    <footer className="page-padding pt-24 pb-8 border-t border-border">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="eyebrow mb-6">Correspondence</p>
          <p className="font-display normal-case text-2xl md:text-3xl leading-snug max-w-md">
            Releases are announced quietly. Write to us at{' '}
            <a href="mailto:studio@noirknull.com" className="link-underline italic">studio@noirknull.com</a>
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title} className="md:col-span-2">
            <p className="eyebrow mb-5">{col.title}</p>
            <ul className="space-y-3">
              {col.links.map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-24 font-display normal-case text-[22vw] leading-[0.8] tracking-[-0.05em] text-center select-none">
        Noir<span className="italic font-light">knull</span>
      </p>
      <div className="mt-8 flex flex-col sm:flex-row justify-between gap-2 eyebrow">
        <span>© {new Date().getFullYear()} NOIRKNULL</span>
        <span>Made in India</span>
      </div>
    </footer>
  );
}
