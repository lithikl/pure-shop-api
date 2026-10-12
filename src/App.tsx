import { useEffect, useState } from "react";
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, ShoppingBag, X, Search, SlidersHorizontal } from "lucide-react";
import Checkout from "./Checkout";
import Admin from "./Admin";
import { EternalFit, HomepageSettings, Shoe, loadEternalFits, loadFeatured, loadHomepageSettings, loadProducts } from "./store";
import PatternWaves from "./PatternWaves";
import TrackOrder from "./TrackOrder";

type CartItem = { shoe: Shoe; size: number };

const money = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const tintFromTone = (tone: string) => {
  const t = tone.toLowerCase();
  if (t.includes("crimson") || t.includes("red") || t.includes("burgundy") || t.includes("maroon")) return "#c94b45";
  if (t.includes("orange") || t.includes("coral") || t.includes("peach")) return "#d77b4a";
  if (t.includes("yellow") || t.includes("gold") || t.includes("mustard")) return "#c9a83d";
  if (t.includes("green") || t.includes("olive") || t.includes("mint")) return "#6e9b72";
  if (t.includes("blue") || t.includes("navy") || t.includes("cobalt") || t.includes("cyan")) return "#557ca8";
  if (t.includes("purple") || t.includes("violet") || t.includes("lilac")) return "#8a72a5";
  if (t.includes("pink") || t.includes("rose")) return "#c98292";
  if (t.includes("brown") || t.includes("tan") || t.includes("camel") || t.includes("beige")) return "#a98768";
  if (t.includes("black") || t.includes("ink") || t.includes("charcoal")) return "#55575a";
  if (t.includes("white") || t.includes("cloud") || t.includes("chalk") || t.includes("bone")) return "#bfc5c9";
  if (t.includes("grey") || t.includes("gray") || t.includes("stone") || t.includes("mono")) return "#8c9094";
  return "#8b8b86";
};

export default function App() {
  const isAdmin = window.location.pathname === "/admin";
  const isTrackOrder = window.location.pathname === "/track-order";
  const [products, setProducts] = useState<Shoe[]>(loadProducts);
  const [featuredIds, setFeaturedIds] = useState<number[]>(loadFeatured);
  const [eternalFits, setEternalFits] = useState<EternalFit[]>(loadEternalFits);
  const [homepage, setHomepage] = useState<HomepageSettings>(loadHomepageSettings);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Shoe | null>(null);
  const [shopOpen, setShopOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [sortBy, setSortBy] = useState("featured");
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [openDetail, setOpenDetail] = useState<string | null>("description");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"details" | "review" | "success">("details");
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "upi" | "card">("upi");
  const [checkoutData, setCheckoutData] = useState({ email: "", phone: "", firstName: "", lastName: "", address: "", apartment: "", city: "Chennai", state: "Tamil Nadu", pincode: "" });
  const [added, setAdded] = useState<number | null>(null);

  useEffect(() => {
    const syncProducts = () => setProducts(loadProducts());
    const syncFeatured = () => setFeaturedIds(loadFeatured());
    const syncEternalFits = () => setEternalFits(loadEternalFits());
    const syncHomepage = () => setHomepage(loadHomepageSettings());
    window.addEventListener("noirknull:products", syncProducts);
    window.addEventListener("noirknull:featured", syncFeatured);
    window.addEventListener("noirknull:eternal-fits", syncEternalFits);
    window.addEventListener("noirknull:homepage", syncHomepage);
    window.addEventListener("storage", syncProducts);
    window.addEventListener("storage", syncFeatured);
    window.addEventListener("storage", syncEternalFits);
    window.addEventListener("storage", syncHomepage);
    return () => {
      window.removeEventListener("noirknull:products", syncProducts);
      window.removeEventListener("noirknull:featured", syncFeatured);
      window.removeEventListener("noirknull:eternal-fits", syncEternalFits);
      window.removeEventListener("noirknull:homepage", syncHomepage);
      window.removeEventListener("storage", syncProducts);
      window.removeEventListener("storage", syncFeatured);
      window.removeEventListener("storage", syncEternalFits);
      window.removeEventListener("storage", syncHomepage);
    };
  }, []);

  useEffect(() => {
    const revealElements = Array.from(document.querySelectorAll(".reveal"));
    if (!revealElements.length) return;
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.08, rootMargin: "0px 0px -8% 0px" });
    revealElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [shopOpen, selectedProduct, checkoutOpen]);

  useEffect(() => {
    const stage = document.querySelector(".best-sellers-stage");
    if (!stage) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        stage.classList.add("best-sellers-active");
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(stage);
    return () => observer.disconnect();
  }, [shopOpen, selectedProduct, checkoutOpen]);


  useEffect(() => {
    const track = document.querySelector<HTMLElement>(".eternal-fits-track");
    if (!track || !eternalFits.length) return;

    // The CSS animation is intentionally continuous; duplicate content makes
    // the loop seamless instead of snapping back to the first image.
    track.style.setProperty("--eternal-count", String(eternalFits.length));

    return () => {
      track.style.removeProperty("--eternal-count");
    };
  }, [eternalFits.length]);

  const openShop = () => {
    
    setSelectedProduct(null);
    setShopOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goTo = (id: string) => {
    
    setSelectedProduct(null);
    setShopOpen(false);
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };
  const openProduct = (shoe: Shoe) => {
    setSelectedProduct(shoe);
    setSelectedSize(null);
    setOpenDetail("description");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const closeProduct = () => { setSelectedProduct(null); setSelectedSize(null); };
  const categoryName = (shoe: Shoe) => (shoe.category?.trim() || (shoe.kind === "Everyday Runner" ? "Runners" : shoe.kind === "Street Low" ? "Street" : shoe.kind === "Retro Court" ? "Court" : "Essentials"));
  const categories = ["ALL", ...Array.from(new Set(products.map(categoryName))).sort()];
  const homepageShoes = products.filter((shoe) => featuredIds.includes(shoe.id));
  const homeCollection = homepageShoes.length ? homepageShoes : products;
  const visibleShoes = products.filter((shoe) => {
    const matchesSearch = `${shoe.name} ${shoe.kind} ${shoe.tone} ${shoe.tag || ""}`.toLowerCase().includes(searchTerm.trim().toLowerCase());
    const category = categoryName(shoe);
    return matchesSearch && (activeCategory === "ALL" || category.toUpperCase() === activeCategory.toUpperCase());
  }).sort((a,b) => sortBy === "price-low" ? a.price-b.price : sortBy === "price-high" ? b.price-a.price : sortBy === "name" ? a.name.localeCompare(b.name) : a.id-b.id);
  const add = (shoe: Shoe, size: number) => {
    setSelectedProduct(null);
    setShopOpen(false);
    setCart((old) => [...old, { shoe, size }]);
    setAdded(shoe.id);
    setCartOpen(true);
    window.setTimeout(() => setAdded((v) => v === shoe.id ? null : v), 1300);
  };
  const cartSubtotal = cart.reduce((sum, item) => sum + item.shoe.price, 0);
  const shippingCost = cart.length === 0 ? 0 : shippingMethod === "express" ? 199 : cartSubtotal >= 5000 ? 0 : 99;
  const checkoutTotal = cartSubtotal + shippingCost;
  const openCheckout = () => {
    setCartOpen(false);
    setSelectedProduct(null);
    setShopOpen(false);
    setCheckoutStep("details");
    setCheckoutOpen(true);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "instant" }));
  };
  const updateCheckout = (key: keyof typeof checkoutData, value: string) => setCheckoutData((old) => ({ ...old, [key]: value }));
  const checkoutReady = Boolean(checkoutData.email.trim() && checkoutData.phone.trim() && checkoutData.firstName.trim() && checkoutData.lastName.trim() && checkoutData.address.trim() && checkoutData.city.trim() && checkoutData.state.trim() && checkoutData.pincode.trim().length === 6);

  if (isAdmin) return <Admin />;
  if (isTrackOrder) return <TrackOrder />;

  return <div className="noir-site">
    <div className="topline"><span>INDEPENDENT FOOTWEAR / EST. 2026</span><span>FREE SHIPPING OVER ₹5,000 ↗</span></div>
    <header className="noir-header liquid-glass-header">
      <nav className="nav-links">
        <button className="nav-primary header-shop-link" onClick={openShop}>SHOP <span>↗</span></button>
        <button className="nav-primary header-world-link" onClick={() => { closeProduct(); goTo("manifesto"); }}>OUR WORLD</button>
      </nav>
      <button className="noir-logo" onClick={() => { closeProduct(); setShopOpen(false); setCheckoutOpen(false); setCartOpen(false); requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "instant" })); }} aria-label="NoirKnull home">NoirKnull<span>®</span></button>
      <button className="bag-button" onClick={() => setCartOpen(true)}><ShoppingBag size={17}/><span>BAG</span><b>{cart.length}</b></button>
    </header>

    {shopOpen && !selectedProduct && <main className="shop-page">
      <div className="shop-page-top"><div className="shop-breadcrumb"><button onClick={() => { setShopOpen(false); window.scrollTo({top:0,behavior:"smooth"}); }}>HOME</button><span>/</span><span>SHOP ALL</span></div><p className="kicker">NOIRKNULL® — THE FIRST DROP</p><h1>Find your<br/><em>own pace.</em></h1><p className="shop-intro">Considered silhouettes. Everyday movement.<br/>Find the pair that feels like you.</p></div>
      <section className="fit-picks">
        <div className="fit-picks-heading"><div><p className="kicker">STYLE NOTES / 001</p><h2>The finishing<br/><em>touches.</em></h2></div><p>Small details. Entirely different energy.<br/>Explore the moodboard, then find your pair below.</p></div>
        <div className="fit-picks-grid">
          <article className="fit-pick fit-pick-wide"><img src={homepage.fitPickImages[0]} alt="Streetwear outfit inspiration"/><div><span>01 / THE OFF-DUTY FIT</span><h3>Easy layers.<br/>Strong silhouette.</h3><p>Keep the shape relaxed and let the sneakers do the talking.</p></div></article>
          <article className="fit-pick"><img src={homepage.fitPickImages[1]} alt="Minimal watch detail"/><div><span>02 / ACCESSORIES</span><h3>Details that<br/>feel like you.</h3><p>Clean, useful, never too much.</p></div></article>
          <article className="fit-pick"><img src={homepage.fitPickImages[2]} alt="Everyday backpack"/><div><span>03 / EVERYDAY CARRY</span><h3>Take your<br/>own route.</h3><p>Built around the places your day takes you.</p></div></article>
        </div>
        <div className="fit-picks-bottom"><span>STYLE IS PERSONAL. THIS IS JUST A STARTING POINT.</span><span>NOIRKNULL® — 2026</span></div>
      </section>
   
      <div className="shop-toolbar"><div className="shop-result-count">{visibleShoes.length} OBJECT{visibleShoes.length===1?"":"S"} <span> / THE COLLECTION</span></div><label className="shop-search"><Search size={17}/><input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search sneakers, styles..." aria-label="Search products"/>{searchTerm && <button onClick={() => setSearchTerm("")} aria-label="Clear search"><X size={15}/></button>}</label><label className="shop-sort"><SlidersHorizontal size={15}/><span>SORT</span><select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort products"><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name: A–Z</option></select></label></div>
      <div className="shop-body"><aside className="shop-filters"><p className="filter-heading">CATEGORIES <span>+</span></p>{categories.map((category) => <button key={category} className={activeCategory===category?"category-filter active":"category-filter"} onClick={() => setActiveCategory(category)}>{category}<span>{category==="ALL"?products.length:products.filter((shoe)=>categoryName(shoe).toUpperCase()===category.toUpperCase()).length}</span></button>)}<div className="filter-note"><span>N/K — 2026</span><p>Less noise.<br/>More intention.</p></div></aside>
      <div className="shop-results">{visibleShoes.length ? <div className="shop-product-grid">{visibleShoes.map((shoe,i)=><article className="shop-product-card" key={shoe.id}><button className="shop-product-image" onClick={()=>openProduct(shoe)} aria-label={`View ${shoe.name}`}><img src={shoe.image} alt={shoe.kind}/>{shoe.tag&&<span className="shoe-tag">{shoe.tag}</span>}<span className="shop-view-link">VIEW PRODUCT <ArrowUpRight size={15}/></span></button><div className="shop-product-meta"><div><p>{shoe.kind}</p><h2>{shoe.name}</h2><span>{shoe.tone}</span></div><strong>{money(shoe.price)}</strong></div></article>)}</div> : <div className="shop-empty"><Search size={25}/><h2>No matches found.</h2><p>Try another search or clear your filters.</p><button onClick={()=>{setSearchTerm("");setActiveCategory("ALL");}}>CLEAR FILTERS ↗</button></div>}</div></div>
      <div className="shop-bottom-note"><span>DESIGNED WITH INTENTION.</span><span>NO RULES, JUST FORM — NOIRKNULL®</span></div>
      <section className="shop-editorial reveal">
        <div className="shop-editorial-copy">
          <p className="kicker"><i/> THE NOIRKNULL FIT DEPARTMENT</p>
          <h2>Build the<br/><em>whole feeling.</em></h2>
          <p>Sneakers are the starting point. Finish the fit with considered extras, everyday carry and little details that make it yours.</p>
          <button className="editorial-cta" onClick={() => { setActiveCategory("ALL"); setSearchTerm(""); document.querySelector(".shop-toolbar")?.scrollIntoView({behavior:"smooth",block:"start"}); }}>FIND YOUR PAIR <ArrowDownRight size={16}/></button>
          <div className="editorial-footnote"><span>01 — FOOTWEAR</span><span>02 — THE EXTRAS</span><span>03 — YOUR UNIFORM</span></div>
        </div>
        <div className="shop-editorial-art">
          <div className="editorial-ring editorial-ring-a"/><div className="editorial-ring editorial-ring-b"/>
          <span className="editorial-vertical">FORM / FUNCTION / FEELING</span>
          <img className="editorial-main-sneaker" src={homepage.editorialMainImage} alt="Red sneaker styled for the Noirknull collection"/>
          <div className="editorial-float-card editorial-accessory-one"><img src={homepage.editorialAccessoryImages[0]} alt="Minimal everyday watch accessory"/><span>THE DAILY DETAIL <b>01</b></span></div>
          <div className="editorial-float-card editorial-accessory-two"><img src={homepage.editorialAccessoryImages[1]} alt="Minimal streetwear backpack"/><span>CARRY YOUR WORLD <b>02</b></span></div>
          <div className="editorial-art-stamp">N/K<small>STYLE STUDY 001</small></div>
          <span className="editorial-orbit-label">EVERYDAY / UNCOMMON ↗</span>
        </div>
      </section>
 </main>}
    {selectedProduct && <main className="product-page" style={{ "--product-glass-tint": selectedProduct.glassTint?.trim() || tintFromTone(selectedProduct.tone) } as React.CSSProperties}>
      <div className="product-crumb"><button onClick={closeProduct}>← BACK TO SHOP</button><span>COLLECTION / {selectedProduct.name}</span><span>NOIRKNULL®</span></div>
      <div className="product-layout">
        <div className="product-gallery">
          <div className="product-main-image"><img src={selectedProduct.image} alt={selectedProduct.kind}/><div className="product-glass-product-label"><span>{selectedProduct.kind}</span><strong>{selectedProduct.name}</strong></div><span className="product-image-index">N/K — OBJECT {String(selectedProduct.id).padStart(2, "0")}</span></div>
          <div className="product-gallery-note"><span>FORM FOLLOWS FEELING.</span><span>DESIGNED FOR EVERYDAY MOTION ↗</span></div>
        </div>
        <div className="product-information">
          <p className="kicker"><i/> {selectedProduct.tag || "THE FIRST DROP"}</p>
          <p className="product-category">{selectedProduct.kind}</p>
          <h1>{selectedProduct.name}</h1>
          <div className="product-price-line"><strong>{money(selectedProduct.price)}</strong><span>INCLUSIVE OF TAXES</span></div>
          <p className="product-tone">{selectedProduct.tone}</p>
          <p className="product-description">A considered everyday silhouette. Clean lines, a confident profile and a design that moves with your own direction. No extra noise—just the essentials.</p>
          <div className="size-heading"><span>SELECT YOUR SIZE (INDIA / UK)</span><button onClick={() => setOpenDetail(openDetail === "size" ? null : "size")}>SIZE GUIDE ↗</button></div>
          <div className="size-grid">{[6,7,8,9,10,11,12].map((size) => <button key={size} className={selectedSize === size ? "size-option size-selected" : "size-option"} onClick={() => setSelectedSize(size)} aria-pressed={selectedSize === size}>{size}</button>)}</div>
          {openDetail === "size" && <div className="size-guide-note">Choose your usual UK/India shoe size. If you are between sizes, check the fit with our team before ordering.</div>}
          <button className="product-add-button" onClick={() => selectedSize ? add(selectedProduct, selectedSize) : document.querySelector(".size-grid")?.scrollIntoView({ behavior: "smooth", block: "center" })}>{selectedSize ? "ADD TO BAG — " + money(selectedProduct.price) : "SELECT A SIZE TO CONTINUE"} <ArrowRight size={17}/></button>
          <p className="product-delivery-note">↗ FREE SHIPPING ON ORDERS OVER ₹5,000</p>
          <div className="product-accordions">
            <div className="product-accordion"><button onClick={() => setOpenDetail(openDetail === "description" ? null : "description")}><span>PRODUCT DETAILS</span><b>{openDetail === "description" ? "−" : "+"}</b></button>{openDetail === "description" && <p>Designed around everyday versatility and a distinct silhouette. Colourway: {selectedProduct.tone}. Product: {selectedProduct.name}. A fresh take on footwear for your own pace.</p>}</div>
            <div className="product-accordion"><button onClick={() => setOpenDetail(openDetail === "fit" ? null : "fit")}><span>FIT & SIZING</span><b>{openDetail === "fit" ? "−" : "+"}</b></button>{openDetail === "fit" && <p>Available sizes shown in UK/India sizing. Select your size before adding to your bag. For exact insole measurements, confirm with the store before purchase.</p>}</div>
            <div className="product-accordion"><button onClick={() => setOpenDetail(openDetail === "shipping" ? null : "shipping")}><span>SHIPPING & RETURNS</span><b>{openDetail === "shipping" ? "−" : "+"}</b></button>{openDetail === "shipping" && <p>Shipping and return policies need to be confirmed by the store before checkout is enabled. Orders are not being processed in this preview yet.</p>}</div>
          </div>
          <div className="product-number"><span>NOIRKNULL / 2026</span><span>0{selectedProduct.id} — 04</span></div>
        </div>
      </div>
      <section className="related-products"><div><p className="kicker">KEEP EXPLORING</p><h2>More from the<br/><em>first drop.</em></h2></div><div className="related-grid">{products.filter((shoe) => shoe.id !== selectedProduct.id).slice(0,3).map((shoe) => <button key={shoe.id} className="related-card" onClick={() => openProduct(shoe)}><img src={shoe.image} alt={shoe.kind}/><span>{shoe.name} <b>{money(shoe.price)}</b></span><small>{shoe.kind} ↗</small></button>)}</div></section>
    </main>}
    {checkoutOpen && <Checkout cart={cart} onBack={() => { setCheckoutOpen(false); setCartOpen(true); }} onComplete={() => { setCheckoutOpen(false); setCart([]); setCheckoutStep("details"); window.scrollTo({ top: 0, behavior: "smooth" }); }} />}
    {!checkoutOpen && <main id="top" className={selectedProduct || shopOpen ? "home-content home-hidden" : "home-content"}>
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
          <img className="floating-shoe" src={homepage.heroImage} alt="NOIR / 01 sneaker"/>
          <div className="art-caption"><span>NOIR / 01</span><span>DESIGNED TO MOVE ↗</span></div>
        </div>
        <div className="hero-side-note">FORM FOLLOWS FEELING — SCROLL TO EXPLORE</div>
      </section>

      <section className="ticker" aria-label="Brand statement"><div className="ticker-track"><span>NO RULES, JUST FORM</span><b>✳</b><span>BUILT FOR YOUR PACE</span><b>✳</b><span>NO RULES, JUST FORM</span><b>✳</b><span>BUILT FOR YOUR PACE</span><b>✳</b></div></section>

      {homepage.showBestSellers && <section className="best-sellers section-wrap" id="collection">
        <div className="best-sellers-heading reveal">
          <div><p className="kicker">01 / THE MOST WANTED</p><h2>Best<br/><em>sellers.</em></h2></div>
          <p className="section-intro">The pairs people keep coming back for.<br/>Tap any object to explore it.</p>
        </div>
        <div className="best-sellers-stage">
          {Array.from({ length: 5 }, (_, i) => homeCollection[i % homeCollection.length]).map((shoe, i) => (
            <article className={"best-seller-item best-seller-" + (i + 1)} key={shoe.id} style={{ animationDelay: (i * 110) + "ms" }}>
              <button className="best-seller-product" onClick={() => openProduct(shoe)} aria-label={"View " + shoe.name + " details"}>
                <div className="best-seller-glass">
                  <span>{shoe.kind}</span>
                  <strong>{shoe.name}</strong>
                </div>
                <img src={shoe.image} alt={shoe.kind}/>
                {shoe.tag && <span className="best-seller-tag">{shoe.tag}</span>}
                <span className="best-seller-price">{money(shoe.price)}</span>
              </button>
            </article>
          ))}
        </div>
        <div className="best-sellers-bottom"><span>DESIGNED WITH INTENTION. WORN WITHOUT RULES.</span><button onClick={() => goTo("manifesto")}>GET TO KNOW US <ArrowUpRight size={15}/></button></div>
      </section>}

      {homepage.showEternalFits && <section className="eternal-fits section-wrap" id="eternal-fits" aria-label="Eternal Fits campaign">
        {homepage.patternWaves && <PatternWaves color="#0b0b0a" opacity={homepage.patternOpacity} speed={0.42} spacing={17} depth={1.0} interactive={true} />}
        <div className="eternal-fits-heading reveal">
          <div>
            <p className="kicker">02 / THE CAMPAIGN</p>
            <h2>Eternal<br/><em>fits.</em></h2>
          </div>
          <p className="section-intro">A moving lookbook of the people, places and silhouettes behind NoirKnull.<br/>Watch the pattern move behind the campaign.</p>
        </div>
        <div className="eternal-fits-stage">
          <div className="eternal-fits-track">
            {[...eternalFits, ...eternalFits].map((fit, index) => (
              <article className="eternal-fit-card" key={`${fit.id}-${index}`}>
                <div className="eternal-fit-image">
                  <img src={fit.image} alt={fit.title}/>
                  <div className="eternal-fit-glass">
                    <span>{fit.meta || `0${index + 1} / ${String(eternalFits.length).padStart(2, "0")}`}</span>
                    <strong>{fit.title}</strong>
                    {fit.caption && <small>{fit.caption}</small>}
                  </div>
                  <span className="eternal-fit-mark">N/K</span>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="eternal-fits-footer"><span>THE FIT NEVER STAYS STILL.</span><span>KEEP SCROLLING →</span></div>
      </section>}

      {homepage.showManifesto && <section className="manifesto" id="manifesto">
        <div className="manifesto-image"><img src={homepage.manifestoImage} alt="Minimal urban architecture in shadow"/><span className="image-coordinate">13°04' N — 80°16' E</span></div>
        <div className="manifesto-copy reveal"><p className="kicker">03 / THE NOIRKNULL POINT OF VIEW</p><h2>Less, by design.<br/><em>More, by nature.</em></h2><p>We believe what you wear should feel like you—not like everyone else. Noirknull is an independent footwear concept built around considered form, everyday comfort and the freedom to move your own way.</p><button className="underlined-link" onClick={() => goTo("details")}>THE THINKING BEHIND IT <ArrowRight size={16}/></button><span className="manifesto-mark">N/K</span></div>
      </section>}

      {homepage.showDetails && <section className="details section-wrap" id="details"><div className="details-heading reveal"><p className="kicker">04 / THE DETAILS MATTER</p><h2>Made for the<br/><em>in-between.</em></h2></div><div className="detail-list">
        <div className="detail-row reveal"><span>01</span><h3>Everyday comfort</h3><p>Easy-wearing silhouettes made to keep pace with your day.</p><ArrowUpRight size={18}/></div>
        <div className="detail-row reveal"><span>02</span><h3>Quiet statement</h3><p>Distinct shape, restrained details, nothing there by accident.</p><ArrowUpRight size={18}/></div>
        <div className="detail-row reveal"><span>03</span><h3>Your own direction</h3><p>Not here to tell you where to go. Just what to go in.</p><ArrowUpRight size={18}/></div>
      </div></section>}

      {homepage.showClosingBanner && <section className="closing-banner"><p className="kicker">YOUR MOVE.</p><h2>Find your<br/><em>own direction.</em></h2><button onClick={() => goTo("collection")}>EXPLORE THE DROP <ArrowRight size={17}/></button><span className="closing-symbol">N/K</span></section>}
    </main>}

    {!checkoutOpen && <footer className={selectedProduct || shopOpen ? "noir-footer home-hidden" : "noir-footer"}><div className="footer-main"><button className="noir-logo footer-wordmark" onClick={() => goTo("top")}>NoirKnull<span>®</span></button><p>MOVE DIFFERENT.<br/>STAY YOURSELF.</p><div className="footer-nav"><button onClick={() => goTo("collection")}>SHOP THE DROP</button><button onClick={() => goTo("manifesto")}>OUR WORLD</button><a href="/track-order">TRACK ORDER ↗</a><a href="mailto:hello@noirknull.com">CONTACT ↗</a></div></div><div className="footer-legal"><span>© NOIRKNULL 2026</span><span>INDEPENDENT BY NATURE.</span><button onClick={() => goTo("top")}>BACK TO TOP ↑</button></div></footer>

    }

    {cartOpen && <div className="cart-backdrop" onClick={() => setCartOpen(false)}><aside className="cart-drawer" onClick={(e) => e.stopPropagation()}><div className="cart-head"><div><p className="kicker">NOIRKNULL / YOUR BAG</p><h2>Your picks <span>({cart.length})</span></h2></div><button onClick={() => setCartOpen(false)} aria-label="Close bag"><X/></button></div>{cart.length === 0 ? <div className="empty-bag"><ShoppingBag size={28}/><p>Your bag is taking it slow.</p><button onClick={() => { setCartOpen(false); goTo("collection"); }}>EXPLORE THE DROP <ArrowRight size={15}/></button></div> : <><div className="bag-items">{cart.map((item, i) => <div className="bag-item" key={`${item.shoe.id}-${item.size}-${i}`}><img src={item.shoe.image} alt={item.shoe.kind}/><div><p>{item.shoe.kind} · SIZE {item.size}</p><h3>{item.shoe.name}</h3><strong>{money(item.shoe.price)}</strong></div><button aria-label="Remove item" onClick={() => setCart((old) => old.filter((_, index) => index !== i))}><X size={15}/></button></div>)}</div><div className="bag-bottom"><div><span>SUBTOTAL</span><strong>{money(cart.reduce((sum, item) => sum + item.shoe.price, 0))}</strong></div><p>Shipping and taxes calculated at checkout.</p><button onClick={openCheckout}>CONTINUE TO CHECKOUT <ArrowRight size={16}/></button></div></>}</aside></div>}
  </div>;
}
