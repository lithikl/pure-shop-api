import { useEffect, useState } from "react";
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, Menu, ShoppingBag, X } from "lucide-react";

type Shoe = { id: number; name: string; kind: string; price: number; image: string; tone: string; tag?: string };

const shoes: Shoe[] = [
  { id: 1, name: "NOIR / 01", kind: "Everyday Runner", price: 4290, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1100&q=90", tone: "Crimson / Chalk", tag: "BESTSELLER" },
  { id: 2, name: "NULL / 02", kind: "Street Low", price: 3890, image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1100&q=90", tone: "Cloud / Ink", tag: "NEW DROP" },
  { id: 3, name: "FORM / 03", kind: "Retro Court", price: 4590, image: "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=1100&q=90", tone: "Stone / Bone" },
  { id: 4, name: "AFTER / 04", kind: "Daily Essential", price: 3490, image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1100&q=90", tone: "Mono / Grey" },
];
const money = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export default function App() {
  const [cart, setCart] = useState<Shoe[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [added, setAdded] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const goTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const add = (shoe: Shoe) => {
    setCart((old) => [...old, shoe]);
    setAdded(shoe.id);
    window.setTimeout(() => setAdded((v) => v === shoe.id ? null : v), 1300);
  };

  return <div className="noir-site">
    <div className="topline"><span>INDEPENDENT FOOTWEAR / EST. 2026</span><span>FREE SHIPPING OVER ₹5,000 ↗</span></div>
    <header className="noir-header">
      <button className="mobile-menu" aria-label="Open navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      <nav className={menuOpen ? "nav-links nav-open" : "nav-links"}>
        <button onClick={() => goTo("collection")}>SHOP</button>
        <button onClick={() => goTo("manifesto")}>OUR WORLD</button>
        <button onClick={() => goTo("details")}>THE DETAILS</button>
      </nav>
      <button className="noir-logo" onClick={() => goTo("top")} aria-label="Noirknull home">noirknull<span>®</span></button>
      <button className="bag-button" onClick={() => setCartOpen(true)}><ShoppingBag size={17}/><span>BAG</span><b>{cart.length}</b></button>
    </header>

    <main id="top">
      <section className="shoe-hero">
        <div className="hero-copy reveal">
          <p className="kicker"><i/> NOT MADE TO BLEND IN</p>
          <h1>MOVE<br/>IN YOUR<br/><em>OWN</em> LANE<span>.</span></h1>
          <div className="hero-lower"><p>Less noise. More intention.<br/>Footwear for wherever you’re going.</p><button className="circle-link" onClick={() => goTo("collection")} aria-label="Explore collection"><ArrowDown size={20}/></button></div>
          <div className="hero-index"><span>01 / 04</span><span>THE FIRST DROP — 2026</span></div>
        </div>
        <div className="hero-art" aria-label="Featured sneaker">
          <div className="orbit orbit-one"/><div className="orbit orbit-two"/>
          <div className="hero-stamp">N/K<br/><small>OBJECTS IN MOTION</small></div>
          <img className="floating-shoe" src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1500&q=95" alt="Sculptural red sneaker from the Noirknull visual campaign"/>
          <div className="art-caption"><span>NOIR / 01</span><span>DESIGNED TO MOVE ↗</span></div>
        </div>
        <div className="hero-side-note">FORM FOLLOWS FEELING — SCROLL TO EXPLORE</div>
      </section>

      <section className="ticker" aria-label="Brand statement"><div className="ticker-track"><span>NO RULES, JUST FORM</span><b>✳</b><span>BUILT FOR YOUR PACE</span><b>✳</b><span>NO RULES, JUST FORM</span><b>✳</b><span>BUILT FOR YOUR PACE</span><b>✳</b></div></section>

      <section className="collection section-wrap" id="collection">
        <div className="section-top reveal"><div><p className="kicker">01 / THE FIRST DROP</p><h2>Objects for<br/><em>everyday motion.</em></h2></div><p className="section-intro">Four silhouettes. No unnecessary noise.<br/>Find your own kind of everyday.</p></div>
        <div className="shoe-grid">{shoes.map((shoe, i) => <article className="shoe-card reveal" key={shoe.id} style={{ transitionDelay: `${i * 90}ms` }}>
          <button className="shoe-photo" onClick={() => add(shoe)} aria-label={`Add ${shoe.name} to bag`}><img src={shoe.image} alt={shoe.kind}/>{shoe.tag && <span className="shoe-tag">{shoe.tag}</span>}<span className="quick-add">{added === shoe.id ? "ADDED ✓" : "QUICK ADD +"} </span></button>
          <div className="shoe-info"><div><p>{shoe.kind}</p><h3>{shoe.name}</h3><span>{shoe.tone}</span></div><strong>{money(shoe.price)}</strong></div>
        </article>)}</div>
        <div className="collection-bottom"><span>DESIGNED WITH INTENTION. WORN WITHOUT RULES.</span><button onClick={() => goTo("manifesto")}>GET TO KNOW US <ArrowUpRight size={15}/></button></div>
      </section>

      <section className="manifesto" id="manifesto">
        <div className="manifesto-image"><img src="https://images.unsplash.com/photo-1520256862855-398228c41684?auto=format&fit=crop&w=1400&q=90" alt="Minimal urban architecture in shadow"/><span className="image-coordinate">13°04' N — 80°16' E</span></div>
        <div className="manifesto-copy reveal"><p className="kicker">02 / THE NOIRKNULL POINT OF VIEW</p><h2>Less, by design.<br/><em>More, by nature.</em></h2><p>We believe what you wear should feel like you—not like everyone else. Noirknull is an independent footwear concept built around considered form, everyday comfort and the freedom to move your own way.</p><button className="underlined-link" onClick={() => goTo("details")}>THE THINKING BEHIND IT <ArrowRight size={16}/></button><span className="manifesto-mark">N/K</span></div>
      </section>

      <section className="details section-wrap" id="details"><div className="details-heading reveal"><p className="kicker">03 / THE DETAILS MATTER</p><h2>Made for the<br/><em>in-between.</em></h2></div><div className="detail-list">
        <div className="detail-row reveal"><span>01</span><h3>Everyday comfort</h3><p>Easy-wearing silhouettes made to keep pace with your day.</p><ArrowUpRight size={18}/></div>
        <div className="detail-row reveal"><span>02</span><h3>Quiet statement</h3><p>Distinct shape, restrained details, nothing there by accident.</p><ArrowUpRight size={18}/></div>
        <div className="detail-row reveal"><span>03</span><h3>Your own direction</h3><p>Not here to tell you where to go. Just what to go in.</p><ArrowUpRight size={18}/></div>
      </div></section>

      <section className="closing-banner"><p className="kicker">YOUR MOVE.</p><h2>Find your<br/><em>own direction.</em></h2><button onClick={() => goTo("collection")}>EXPLORE THE DROP <ArrowRight size={17}/></button><span className="closing-symbol">N/K</span></section>
    </main>

    <footer className="noir-footer"><div className="footer-main"><button className="noir-logo footer-wordmark" onClick={() => goTo("top")}>noirknull<span>®</span></button><p>MOVE DIFFERENT.<br/>STAY YOURSELF.</p><div className="footer-nav"><button onClick={() => goTo("collection")}>SHOP THE DROP</button><button onClick={() => goTo("manifesto")}>OUR WORLD</button><a href="mailto:hello@noirknull.com">CONTACT ↗</a></div></div><div className="footer-legal"><span>© NOIRKNULL 2026</span><span>INDEPENDENT BY NATURE.</span><button onClick={() => goTo("top")}>BACK TO TOP ↑</button></div></footer>

    {cartOpen && <div className="cart-backdrop" onClick={() => setCartOpen(false)}><aside className="cart-drawer" onClick={(e) => e.stopPropagation()}><div className="cart-head"><div><p className="kicker">NOIRKNULL / YOUR BAG</p><h2>Your picks <span>({cart.length})</span></h2></div><button onClick={() => setCartOpen(false)} aria-label="Close bag"><X/></button></div>{cart.length === 0 ? <div className="empty-bag"><ShoppingBag size={28}/><p>Your bag is taking it slow.</p><button onClick={() => { setCartOpen(false); goTo("collection"); }}>EXPLORE THE DROP <ArrowRight size={15}/></button></div> : <><div className="bag-items">{cart.map((shoe, i) => <div className="bag-item" key={`${shoe.id}-${i}`}><img src={shoe.image} alt={shoe.kind}/><div><p>{shoe.kind}</p><h3>{shoe.name}</h3><strong>{money(shoe.price)}</strong></div><button aria-label="Remove item" onClick={() => setCart((old) => old.filter((_, index) => index !== i))}><X size={15}/></button></div>)}</div><div className="bag-bottom"><div><span>SUBTOTAL</span><strong>{money(cart.reduce((sum, item) => sum + item.price, 0))}</strong></div><p>Shipping and taxes calculated at checkout.</p><button onClick={() => alert("This is a storefront preview. Connect checkout and payment processing before accepting orders.")}>CONTINUE TO CHECKOUT <ArrowRight size={16}/></button></div></>}</aside></div>}
  </div>;
}
