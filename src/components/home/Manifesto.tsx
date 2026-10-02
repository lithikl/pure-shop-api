import Reveal from './Reveal';

const pillars = [
  { k: 'Material', v: 'Full-grain leather and solid 925 silver. Nothing coated, nothing hollow.' },
  { k: 'Form', v: 'Silhouettes stripped back until only the necessary remains.' },
  { k: 'Time', v: 'Small runs, made slowly. Built to outlast the season it was released in.' },
];

export default function Manifesto() {
  return (
    <section className="page-padding py-28 md:py-44">
      <Reveal className="max-w-5xl">
        <p className="eyebrow mb-10">Manifesto</p>
        <p className="font-display normal-case text-3xl sm:text-4xl md:text-6xl leading-[1.08] tracking-tight">
          We make objects for those who speak quietly.{' '}
          <span className="text-muted-foreground italic font-light">
            Black, by intention. Null, by design — nothing added that does not need to be there.
          </span>
        </p>
      </Reveal>

      <div className="mt-20 md:mt-28 grid gap-10 md:grid-cols-3 md:gap-8">
        {pillars.map((p, i) => (
          <Reveal key={p.k} delay={i * 120} className="border-t border-border pt-6">
            <p className="eyebrow mb-4">
              <span className="text-foreground">0{i + 1}</span> — {p.k}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground max-w-xs">{p.v}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
