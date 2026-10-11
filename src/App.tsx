import { useEffect, useState } from "react";
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, Menu, ShoppingBag, X, Search, SlidersHorizontal } from "lucide-react";

type Shoe = { id: number; name: string; kind: string; price: number; image: string; tone: string; tag?: string };
type CartItem = { shoe: Shoe; size: number };

const shoes: Shoe[] = [
  { id: 1, name: "NOIR / 01", kind: "Everyday Runner", price: 4290, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1100&q=90", tone: "Crimson / Chalk", tag: "BESTSELLER" },
  { id: 2, name: "NULL / 02", kind: "Street Low", price: 3890, image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1100&q=90", tone: "Cloud / Ink", tag: "NEW DROP" },
  { id: 3, name: "FORM / 03", kind: "Retro Court", price: 4590, image: "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=1100&q=90", tone: "Stone / Bone" },
  { id: 4, name: "AFTER / 04", kind: "Daily Essential", price: 3490, image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1100&q=90", tone: "Mono / Grey" },
];
const money = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export default function App() {
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [added, setAdded] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const openShop = () => { setMenuOpen(false); setSelectedProduct(null); setShopOpen(true); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const goTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const openProduct = (shoe: Shoe) => {
    setSelectedProduct(shoe);
    setSelectedSize(null);
    setOpenDetail("description");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const closeProduct = () => { setSelectedProduct(null); setSelectedSize(null); };
  const categories = ["ALL", "RUNNERS", "STREET", "COURT", "ESSENTIALS"];
  const visibleShoes = shoes.filter((shoe) => {
    const matchesSearch = `${shoe.name} ${shoe.kind} ${shoe.tone} ${shoe.tag || ""}`.toLowerCase().includes(searchTerm.trim().toLowerCase());
    const category = shoe.kind === "Everyday Runner" ? "RUNNERS" : shoe.kind === "Street Low" ? "STREET" : shoe.kind === "Retro Court" ? "COURT" : "ESSENTIALS";
    return matchesSearch && (activeCategory === "ALL" || category === activeCategory);
  }).sort((a,b) => sortBy === "price-low" ? a.price-b.price : sortBy === "price-high" ? b.price-a.price : sortBy === "name" ? a.name.localeCompare(b.name) : a.id-b.id);
  const add = (shoe: Shoe, size: number) => {
    setCart((old) => [...old, { shoe, size }]);
    setAdded(shoe.id);
    setCartOpen(true);
    window.setTimeout(() => setAdded((v) => v === shoe.id ? null : v), 1300);
  };
  const cartSubtotal = cart.reduce((sum, item) => sum + item.shoe.price, 0);
  const shippingCost = cart.length === 0 ? 0 : shippingMethod === "express" ? 199 : cartSubtotal >= 5000 ? 0 : 99;
  const checkoutTotal = cartSubtotal + shippingCost;
  const openCheckout = () => { setCartOpen(false); setCheckoutStep("details"); setCheckoutOpen(true); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const updateCheckout = (key: keyof typeof checkoutData, value: string) => setCheckoutData((old) => ({ ...old, [key]: value }));
  const checkoutReady = Boolean(checkoutData.email.trim() && checkoutData.phone.trim() && checkoutData.firstName.trim() && checkoutData.lastName.trim() && checkoutData.address.trim() && checkoutData.city.trim() && checkoutData.state.trim() && checkoutData.pincode.trim().length === 6);

  return <div className="noir-site">
    <div className="topline"><span>INDEPENDENT FOOTWEAR / EST. 2026</span><span>FREE SHIPPING OVER ₹5,000 ↗</span></div>
    <header className={shopOpen || selectedProduct ? "noir-header" : "noir-header liquid-glass-header"}>
      <button className="mobile-menu" aria-label="Open navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      <nav className={menuOpen ? "nav-links nav-open" : "nav-links"}>
        <button className="nav-primary" onClick={openShop}>SHOP <span>↗</span></button>
        <button className="nav-primary" onClick={() => { closeProduct(); goTo("manifesto"); }}>OUR WORLD</button>
      </nav>
      <button className="noir-logo" onClick={() => { closeProduct(); setShopOpen(false); setMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }} aria-label="Noirknull home">noirknull<span>®</span></button>
      <button className="bag-button" onClick={() => setCartOpen(true)}><ShoppingBag size={17}/><span>BAG</span><b>{cart.length}</b></button>
    </header>

    {shopOpen && !selectedProduct && <main className="shop-page">
      <div className="shop-page-top"><div className="shop-breadcrumb"><button onClick={() => { setShopOpen(false); window.scrollTo({top:0,behavior:"smooth"}); }}>HOME</button><span>/</span><span>SHOP ALL</span></div><p className="kicker">NOIRKNULL® — THE FIRST DROP</p><h1>Find your<br/><em>own pace.</em></h1><p className="shop-intro">Considered silhouettes. Everyday movement.<br/>Find the pair that feels like you.</p></div>
      <section className="fit-picks">
        <div className="fit-picks-heading"><div><p className="kicker">STYLE NOTES / 001</p><h2>The finishing<br/><em>touches.</em></h2></div><p>Small details. Entirely different energy.<br/>Explore the moodboard, then find your pair below.</p></div>
        <div className="fit-picks-grid">
          <article className="fit-pick fit-pick-wide"><img src="https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1000&q=85" alt="Streetwear outfit inspiration"/><div><span>01 / THE OFF-DUTY FIT</span><h3>Easy layers.<br/>Strong silhouette.</h3><p>Keep the shape relaxed and let the sneakers do the talking.</p></div></article>
          <article className="fit-pick"><img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=650&q=85" alt="Minimal watch detail"/><div><span>02 / ACCESSORIES</span><h3>Details that<br/>feel like you.</h3><p>Clean, useful, never too much.</p></div></article>
          <article className="fit-pick"><img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=650&q=85" alt="Everyday backpack"/><div><span>03 / EVERYDAY CARRY</span><h3>Take your<br/>own route.</h3><p>Built around the places your day takes you.</p></div></article>
        </div>
        <div className="fit-picks-bottom"><span>STYLE IS PERSONAL. THIS IS JUST A STARTING POINT.</span><span>NOIRKNULL® — 2026</span></div>
      </section>
   
      <div className="shop-toolbar"><div className="shop-result-count">{visibleShoes.length} OBJECT{visibleShoes.length===1?"":"S"} <span> / THE COLLECTION</span></div><label className="shop-search"><Search size={17}/><input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search sneakers, styles..." aria-label="Search products"/>{searchTerm && <button onClick={() => setSearchTerm("")} aria-label="Clear search"><X size={15}/></button>}</label><label className="shop-sort"><SlidersHorizontal size={15}/><span>SORT</span><select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort products"><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name: A–Z</option></select></label></div>
      <div className="shop-body"><aside className="shop-filters"><p className="filter-heading">CATEGORIES <span>+</span></p>{categories.map((category) => <button key={category} className={activeCategory===category?"category-filter active":"category-filter"} onClick={() => setActiveCategory(category)}>{category}<span>{category==="ALL"?shoes.length:shoes.filter((shoe)=> (shoe.kind==="Everyday Runner"?"RUNNERS":shoe.kind==="Street Low"?"STREET":shoe.kind==="Retro Court"?"COURT":"ESSENTIALS")===category).length}</span></button>)}<div className="filter-note"><span>N/K — 2026</span><p>Less noise.<br/>More intention.</p></div></aside>
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
          <img className="editorial-main-sneaker" src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=90" alt="Red sneaker styled for the Noirknull collection"/>
          <div className="editorial-float-card editorial-accessory-one"><img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=420&q=85" alt="Minimal everyday watch accessory"/><span>THE DAILY DETAIL <b>01</b></span></div>
          <div className="editorial-float-card editorial-accessory-two"><img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=420&q=85" alt="Minimal streetwear backpack"/><span>CARRY YOUR WORLD <b>02</b></span></div>
          <div className="editorial-art-stamp">N/K<small>STYLE STUDY 001</small></div>
          <span className="editorial-orbit-label">EVERYDAY / UNCOMMON ↗</span>
        </div>
      </section>
 </main>}
    {selectedProduct && <main className="product-page">
      <div className="product-crumb"><button onClick={closeProduct}>← BACK TO SHOP</button><span>COLLECTION / {selectedProduct.name}</span><span>NOIRKNULL®</span></div>
      <div className="product-layout">
        <div className="product-gallery">
          <div className="product-main-image"><img src={selectedProduct.image} alt={selectedProduct.kind}/><span className="product-image-index">N/K — OBJECT {String(selectedProduct.id).padStart(2, "0")}</span></div>
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
      <section className="related-products"><div><p className="kicker">KEEP EXPLORING</p><h2>More from the<br/><em>first drop.</em></h2></div><div className="related-grid">{shoes.filter((shoe) => shoe.id !== selectedProduct.id).slice(0,3).map((shoe) => <button key={shoe.id} className="related-card" onClick={() => openProduct(shoe)}><img src={shoe.image} alt={shoe.kind}/><span>{shoe.name} <b>{money(shoe.price)}</b></span><small>{shoe.kind} ↗</small></button>)}</div></section>
    </main>}
    {checkoutOpen && <main className="checkout-page">
      {checkoutStep === "success" ? <section className="checkout-success">
        <div className="checkout-success-mark">✓</div>
        <p className="kicker">NOIRKNULL / ORDER CONFIRMED</p><h1>You are<br/><em>all set.</em></h1>
        <p>Your order has been placed successfully. A confirmation will be sent to {checkoutData.email || "your email"}.</p>
        <div className="checkout-success-meta"><span>ORDER / NK-{Date.now().toString().slice(-6)}</span><span>NOIRKNULL® — 2026</span></div>
        <button className="checkout-primary" onClick={() => { setCheckoutOpen(false); setCart([]); setCheckoutStep("details"); window.scrollTo({top:0,behavior:"smooth"}); }}>RETURN HOME <ArrowUpRight size={16}/></button>
      </section> : <div className="checkout-shell">
        <div className="checkout-main">
          <div className="checkout-header"><button className="checkout-back" onClick={() => { setCheckoutOpen(false); setCartOpen(true); }}>← BACK TO BAG</button><div><p className="kicker">NOIRKNULL® / CHECKOUT</p><h1>Complete<br/><em>your order.</em></h1></div><div className="checkout-progress"><span className="active">01 DETAILS</span><i/><span className={checkoutStep === "review" ? "active" : ""}>02 REVIEW</span><i/><span>03 CONFIRMED</span></div></div>
          {checkoutStep === "details" ? <div className="checkout-form">
            <section className="checkout-section"><div className="checkout-section-head"><span>01</span><div><p>CONTACT</p><small>Where should we send your order updates?</small></div></div><div className="checkout-grid one"><label><span>EMAIL ADDRESS *</span><input type="email" value={checkoutData.email} onChange={e=>updateCheckout("email",e.target.value)} placeholder="you@example.com" autoComplete="email"/></label><label><span>PHONE NUMBER *</span><input type="tel" value={checkoutData.phone} onChange={e=>updateCheckout("phone",e.target.value)} placeholder="+91 98765 43210" autoComplete="tel"/></label></div></section>
            <section className="checkout-section"><div className="checkout-section-head"><span>02</span><div><p>DELIVERY ADDRESS</p><small>We currently ship across India.</small></div></div><div className="checkout-grid two"><label><span>FIRST NAME *</span><input value={checkoutData.firstName} onChange={e=>updateCheckout("firstName",e.target.value)} autoComplete="given-name"/></label><label><span>LAST NAME *</span><input value={checkoutData.lastName} onChange={e=>updateCheckout("lastName",e.target.value)} autoComplete="family-name"/></label><label className="wide"><span>ADDRESS *</span><input value={checkoutData.address} onChange={e=>updateCheckout("address",e.target.value)} placeholder="House / flat number, street" autoComplete="street-address"/></label><label className="wide"><span>APARTMENT / LANDMARK</span><input value={checkoutData.apartment} onChange={e=>updateCheckout("apartment",e.target.value)} placeholder="Optional"/></label><label><span>CITY *</span><input value={checkoutData.city} onChange={e=>updateCheckout("city",e.target.value)} autoComplete="address-level2"/></label><label><span>STATE *</span><input value={checkoutData.state} onChange={e=>updateCheckout("state",e.target.value)} autoComplete="address-level1"/></label><label><span>PINCODE *</span><input inputMode="numeric" maxLength={6} value={checkoutData.pincode} onChange={e=>updateCheckout("pincode",e.target.value.replace(/\D/g,"").slice(0,6))} autoComplete="postal-code"/></label></div></section>
            <section className="checkout-section"><div className="checkout-section-head"><span>03</span><div><p>SHIPPING METHOD</p><small>Choose how quickly you want your order.</small></div></div><div className="checkout-options"><button className={shippingMethod==="standard"?"checkout-option selected":"checkout-option"} onClick={()=>setShippingMethod("standard")}><span><b>STANDARD DELIVERY</b><small>3–7 business days</small></span><strong>{cartSubtotal>=5000?"FREE":money(99)}</strong></button><button className={shippingMethod==="express"?"checkout-option selected":"checkout-option"} onClick={()=>setShippingMethod("express")}><span><b>EXPRESS DELIVERY</b><small>1–3 business days</small></span><strong>{money(199)}</strong></button></div></section>
            <section className="checkout-section"><div className="checkout-section-head"><span>04</span><div><p>PAYMENT</p><small>Select your preferred payment method.</small></div></div><div className="checkout-options"><button className={paymentMethod==="upi"?"checkout-option selected":"checkout-option"} onClick={()=>setPaymentMethod("upi")}><span><b>UPI</b><small>Google Pay, PhonePe, Paytm & more</small></span><strong>↗</strong></button><button className={paymentMethod==="card"?"checkout-option selected":"checkout-option"} onClick={()=>setPaymentMethod("card")}><span><b>CARD</b><small>Credit or debit card</small></span><strong>↗</strong></button><button className={paymentMethod==="cod"?"checkout-option selected":"checkout-option"} onClick={()=>setPaymentMethod("cod")}><span><b>CASH ON DELIVERY</b><small>Pay when your order arrives</small></span><strong>↗</strong></button></div><p className="checkout-payment-note">Payment details are collected securely at the payment step. No card information is stored on this page.</p></section>
            <button className="checkout-primary checkout-continue" disabled={!checkoutReady} onClick={()=>checkoutReady && setCheckoutStep("review")}>REVIEW ORDER <ArrowRight size={17}/></button>{!checkoutReady && <p className="checkout-validation">Complete the required contact and delivery fields to continue.</p>}
          </div> : <div className="checkout-review">
            <div className="review-card"><div className="review-card-head"><div><p className="kicker">DELIVERING TO</p><h2>{checkoutData.firstName} {checkoutData.lastName}</h2></div><button onClick={()=>setCheckoutStep("details")}>EDIT</button></div><p>{checkoutData.address}{checkoutData.apartment ? ", " + checkoutData.apartment : ""}<br/>{checkoutData.city}, {checkoutData.state} — {checkoutData.pincode}</p><span>{checkoutData.email} · {checkoutData.phone}</span></div>
            <div className="review-card"><div className="review-card-head"><div><p className="kicker">DELIVERY</p><h2>{shippingMethod==="standard"?"Standard":"Express"} delivery</h2></div><button onClick={()=>setCheckoutStep("details")}>EDIT</button></div><p>{shippingMethod==="standard"?"3–7 business days":"1–3 business days"}</p></div>
            <div className="review-card"><div className="review-card-head"><div><p className="kicker">PAYMENT</p><h2>{paymentMethod==="upi"?"UPI":paymentMethod==="card"?"Card":"Cash on delivery"}</h2></div><button onClick={()=>setCheckoutStep("details")}>EDIT</button></div><p>{paymentMethod==="cod"?"Pay when your order arrives.":"You will complete payment securely after confirming this order."}</p></div>
            <button className="checkout-primary" onClick={()=>setCheckoutStep("success")}>PLACE ORDER — {money(checkoutTotal)} <ArrowRight size={17}/></button><p className="checkout-terms">By placing your order, you confirm that your delivery details are correct and agree to the store purchase terms.</p>
          </div>}
        </div>
        <aside className="checkout-summary"><div className="checkout-summary-sticky"><div className="summary-title"><p className="kicker">YOUR ORDER</p><h2>Order summary <span>{cart.length}</span></h2></div><div className="summary-items">{cart.map((item,i)=><div className="summary-item" key={`${item.shoe.id}-${item.size}-${i}`}><div className="summary-image"><img src={item.shoe.image} alt={item.shoe.kind}/><span>{item.size}</span></div><div><p>{item.shoe.kind}</p><h3>{item.shoe.name}</h3><small>SIZE {item.size}</small></div><strong>{money(item.shoe.price)}</strong></div>)}</div><div className="summary-totals"><div><span>SUBTOTAL</span><b>{money(cartSubtotal)}</b></div><div><span>SHIPPING</span><b>{shippingCost===0?"FREE":money(shippingCost)}</b></div><div className="summary-total"><span>TOTAL</span><strong>{money(checkoutTotal)}</strong></div></div><p className="summary-note">Prices include applicable taxes. Free standard shipping on orders over ₹5,000.</p></div></aside>
      </div></main>}
    <main id="top" className={selectedProduct || shopOpen ? "home-content home-hidden" : "home-content"}>
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
          <button className="shoe-photo" onClick={() => openProduct(shoe)} aria-label={`View ${shoe.name} details`}><img src={shoe.image} alt={shoe.kind}/>{shoe.tag && <span className="shoe-tag">{shoe.tag}</span>}<span className="quick-add">VIEW DETAILS ↗</span></button>
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

    <footer className={selectedProduct || shopOpen ? "noir-footer home-hidden" : "noir-footer"}><div className="footer-main"><button className="noir-logo footer-wordmark" onClick={() => goTo("top")}>noirknull<span>®</span></button><p>MOVE DIFFERENT.<br/>STAY YOURSELF.</p><div className="footer-nav"><button onClick={() => goTo("collection")}>SHOP THE DROP</button><button onClick={() => goTo("manifesto")}>OUR WORLD</button><a href="mailto:hello@noirknull.com">CONTACT ↗</a></div></div><div className="footer-legal"><span>© NOIRKNULL 2026</span><span>INDEPENDENT BY NATURE.</span><button onClick={() => goTo("top")}>BACK TO TOP ↑</button></div></footer>

    {cartOpen && <div className="cart-backdrop" onClick={() => setCartOpen(false)}><aside className="cart-drawer" onClick={(e) => e.stopPropagation()}><div className="cart-head"><div><p className="kicker">NOIRKNULL / YOUR BAG</p><h2>Your picks <span>({cart.length})</span></h2></div><button onClick={() => setCartOpen(false)} aria-label="Close bag"><X/></button></div>{cart.length === 0 ? <div className="empty-bag"><ShoppingBag size={28}/><p>Your bag is taking it slow.</p><button onClick={() => { setCartOpen(false); goTo("collection"); }}>EXPLORE THE DROP <ArrowRight size={15}/></button></div> : <><div className="bag-items">{cart.map((item, i) => <div className="bag-item" key={`${item.shoe.id}-${item.size}-${i}`}><img src={item.shoe.image} alt={item.shoe.kind}/><div><p>{item.shoe.kind} · SIZE {item.size}</p><h3>{item.shoe.name}</h3><strong>{money(item.shoe.price)}</strong></div><button aria-label="Remove item" onClick={() => setCart((old) => old.filter((_, index) => index !== i))}><X size={15}/></button></div>)}</div><div className="bag-bottom"><div><span>SUBTOTAL</span><strong>{money(cart.reduce((sum, item) => sum + item.shoe.price, 0))}</strong></div><p>Shipping and taxes calculated at checkout.</p><button onClick={openCheckout}>CONTINUE TO CHECKOUT <ArrowRight size={16}/></button></div></>}</aside></div>}
  </div>;
}
