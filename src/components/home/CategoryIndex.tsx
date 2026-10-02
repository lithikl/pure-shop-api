import { Link } from 'react-router-dom';
import SectionHeading from './SectionHeading';

const categories = [
  { to: '/collections/footwear', label: 'Footwear', note: 'Leather · Rubber' },
  { to: '/collections/jewelry', label: 'Jewelry', note: 'Chains · Rings' },
  { to: '/collections/new-arrivals', label: 'New arrivals', note: 'Latest release' },
  { to: '/products', label: 'All objects', note: 'Full archive' },
];

export default function CategoryIndex() {
  return (
    <section className="page-padding py-28 md:py-44">
      <SectionHeading index="03" eyebrow="Index" title={<>Browse the <span className="italic font-light">archive</span></>} />
      <ul className="mt-12 md:mt-16">
        {categories.map((c, i) => (
          <li key={c.to} className="border-b border-border">
            <Link
              to={c.to}
              className="group flex items-baseline justify-between gap-6 py-6 md:py-8 transition-colors"
            >
              <span className="flex items-baseline gap-6 md:gap-12">
                <span className="eyebrow w-6">0{i + 1}</span>
                <span className="font-display normal-case text-3xl md:text-6xl tracking-tight transition-transform duration-500 group-hover:translate-x-3 group-hover:italic">
                  {c.label}
                </span>
              </span>
              <span className="eyebrow hidden sm:inline transition-colors group-hover:text-foreground">
                {c.note} →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
