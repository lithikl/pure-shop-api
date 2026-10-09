import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight, ArrowLeft, ArrowRight, Check, ChevronDown, Heart,
  Menu, Minus, Plus, Search, ShoppingBag, SlidersHorizontal, X
} from "lucide-react";

type Product = {
  id: number; name: string; subtitle: string; price: number; category: "Men" | "Women" | "Kids";
  type: string; image: string; alt: string; color: string; sizes: string[]; badge?: string;
};

const products: Product[] = [
  { id: 1, name: "Essential Cotton Tee", subtitle: "Heavyweight · Relaxed fit", price: 799, category: "Men", type: "T-Shirts", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=85", alt: "White heavyweight cotton t-shirt", color: "Chalk", sizes: ["S", "M", "L", "XL"], badge: "Bestseller" },
  { id: 2, name: "Everyday Straight Jeans", subtitle: "Washed denim · Straight fit", price: 1699, category: "Men", type: "Denim", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1000&q=85", alt: "Blue straight fit denim jeans", color: "Indigo", sizes: ["28", "30", "32", "34", "36"] },
  { id: 3, name: "Soft Structure Shirt", subtitle: "Cotton poplin · Boxy fit", price: 1299, category: "Women", type: "Shirts", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=85", alt: "Neutral cotton button-up shirt", color: "Oat", sizes: ["XS", "S", "M", "L"], badge: "New" },
  { id: 4, name: "Daily Rib Tank", subtitle: "Stretch cotton · Slim fit", price: 599, category: "Women", type: "Tops", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=85", alt: "Minimal everyday top", color: "Black", sizes: ["XS", "S", "M", "L", "XL"] },
  { id: 5, name: "Weekend Overshirt", subtitle: "Brushed twill · Easy fit", price: 1899, category: "Men", type: "Shirts", image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=85", alt: "Neutral casual overshirt", color: "Stone", sizes: ["S", "M", "L", "XL"], badge: "New" },
  { id: 6, name: "Everyday Mini Tote", subtitle: "Canvas · Everyday carry", price: 499, category: "Women", type: "Accessories", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=85", alt: "Canvas everyday tote bag", color: "Natural", sizes: ["One size"] },
  { id: 7, name: "Little Day Tee", subtitle: "Organic cotton · Easy fit", price: 499, category: "Kids", type: "T-Shirts", image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=1000&q=85", alt: "Children's casual cotton t-shirt", color: "Cloud", sizes: ["2Y", "4Y", "6Y", "8Y"] },
  { id: 8, name: "Relaxed Linen Blend", subtitle: "Linen blend · Wide leg", price: 1499, category: "Women", type: "Trousers", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85", alt: "Relaxed neutral fashion trousers", color: "Sand", sizes: ["XS", "S", "M", "L"] },
];

type CartLine = { productId: number; size: string; quantity: number };
const money = (amount: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

export default function App() {
  const [page, setPage] = useState<"home" | "shop" | "checkout">("home");
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [sort, setSort] = useState("featured");
  const [filterOpen, setFilterOpen] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cart, setCart] = useState<CartLine[]>(() => {
    try { return JSON.parse(localStorage.getItem("xiv-cart") || "[]") as CartLine[]; } catch { return []; }
  });
  const [notice, setNotice] = useState("");
  const [orderComplete, setOrderComplete] = useState(false);

  useEffect(() => { localStorage.setItem("xiv-cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setSelected(null); setCartOpen(false); setMenuOpen(false); setSearchOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered = useMemo(() => {
    let list = products.filter((p) => (category === "All" || p.category === category) &&
      (p.name + " " + p.subtitle + " " + p.type + " " + p.category).toLowerCase().includes(query.toLowerCase()));
    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "new") list = [...list].sort((a, b) => Number(!!b.badge) - Number(!!a.badge));
    return list;
  }, [category, query, sort]);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, line) => sum + (products.find((p) => p.id === line.productId)?.price || 0) * line.quantity, 0);
  const cartProducts = cart.map((line) => ({ ...line, product: products.find((p) => p.id === line.productId)! })).filter((line) => line.product);

  const goShop = (nextCategory = "All") => {
    setCategory(nextCategory); setPage("shop"); setMenuOpen(false); setSelected(null); setSearchOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const addToCart = (product: Product, size: string) => {
    if (!size) { setNotice("Choose a size first"); return; }
    setCart((old) => {
      const found = old.find((line) => line.productId === product.id && line.size === size);
      return found ? old.map((line) => line.productId === product.id && line.size === size ? { ...line, quantity: line.quantity + 1 } : line)
        : [...old, { productId: product.id, size, quantity: 1 }];
    });
    setSelected(null); setCartOpen(true); setNotice("");
  };
  const changeQty = (productId: number, size: string, delta: number) => setCart((old) => old.map((line) =>
    line.productId === productId && line.size === size ? { ...line, quantity: line.quantity + delta } : line
  ).filter((line) => line.quantity > 0));
  const openProduct = (product: Product) => { setSelected(product); setSelectedSize(product.sizes[0]); setNotice(""); };
  const toggleWish = (id: number) => setWishlist((old) => old.includes(id) ? old.filter((x) => x !== id) : [...old, id]);

  return (
    <div className="store-shell">
      <div className="announcement">A LITTLE MORE YOU. A LITTLE LESS EVERYTHING ELSE. <span>FREE SHIPPING ON ORDERS OVER ₹1,999</span></div>
      <header className="site-header">
        <button className="icon-button mobile-menu" aria-label="Open menu" onClick={() => setMenuOpen(true)}><Menu size={21}/></button>
        <nav className="desktop-nav"><button onClick={() => { setPage("home"); setCategory("All"); window.scrollTo({top:0,behavior:"smooth"}); }}>Home</button><button onClick={() => goShop("All")}>Collections</button><button onClick={() => { goShop("All"); setSort("new"); }}>New</button></nav>
        <button className="wordmark" onClick={() => { setPage("home"); setCategory("All"); window.scrollTo({top:0,behavior:"smooth"}); }} aria-label="XIV home">XIV<span>®</span></button>
        <div className="header-actions">
          <button className="icon-button search-trigger" aria-label="Search" onClick={() => setSearchOpen((v) => !v)}><Search size={19}/></button>
          <button className="icon-button wishlist-trigger" aria-label="Saved items" onClick={() => { setQuery(""); setPage("shop"); setCategory("All"); setNotice(wishlist.length ? "Your saved pieces are marked with hearts." : "Tap a heart to save your favourites."); window.scrollTo({top:0,behavior:"smooth"}); }}><Heart size={19}/>{wishlist.length > 0 && <i>{wishlist.length}</i>}</button>
          <button className="cart-trigger" onClick={() => setCartOpen(true)}><ShoppingBag size={17}/><span>Cart ({cartCount})</span></button>
        </div>
      </header>

      {searchOpen && <div className="search-panel"><Search size={18}/><input autoFocus placeholder="Search pieces, categories..." value={query} onChange={(e) => { setQuery(e.target.value); setPage("shop"); }} onKeyDown={(e) => e.key === "Enter" && goShop(category)}/><button onClick={() => { setSearchOpen(false); setQuery(""); }} aria-label="Close search"><X size={18}/></button><span>{filtered.length} results</span></div>}

      <main>
        {page === "home" && <>
          <section className="hero">
            <div className="hero-left">
              <div className="vertical-categories">{["Men", "Women", "Kids"].map((c) => <button key={c} onClick={() => goShop(c)}>{c}</button>)}</div>
              <p className="eyebrow hero-season">A NEW POINT OF VIEW / 2026</p>
              <h1>New<br/>Collection<span>.</span></h1>
              <p className="hero-copy">Everyday pieces. Considered details.<br/>Made to move with you.</p>
              <button className="primary-button" onClick={() => goShop("All")}>Go to shop <ArrowRight size={16}/></button>
              <span className="hero-index">01 — 04</span>
            </div>
            <button className="hero-image hero-image-one" onClick={() => openProduct(products[2])} aria-label="Explore the soft structure shirt">
              <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85" alt="Editorial fashion collection"/>
              <span>FORM / 01 <ArrowDownRight size={15}/></span>
            </button>
            <button className="hero-image hero-image-two" onClick={() => openProduct(products[4])} aria-label="Explore the weekend overshirt">
              <img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=85" alt="Modern streetwear editorial"/>
              <span>FEEL / 02 <ArrowDownRight size={15}/></span>
            </button>
            <div className="hero-bottom-note">XIV COLLECTIONS 23—26 <span>DESIGNED FOR EVERY DAY</span></div>
          </section>

          <section className="section new-section" id="new">
            <div className="section-heading"><div><p className="eyebrow">JUST LANDED / 001</p><h2>New this week <sup>08</sup></h2></div><button className="text-link" onClick={() => { setSort("new"); goShop("All"); }}>See all <ArrowRight size={16}/></button></div>
            <div className="product-grid featured-grid">{products.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} wished={wishlist.includes(p.id)} onWish={() => toggleWish(p.id)} onOpen={() => openProduct(p)}/>)}</div>
          </section>

          <section className="collection-band">
            <div className="collection-copy"><p className="eyebrow">XIV COLLECTIONS 23—26</p><h2>Less, but<br/><em>better.</em></h2><p>A considered wardrobe built around the pieces you reach for again and again.</p><button className="light-button" onClick={() => goShop("All")}>Explore the collection <ArrowRight size={16}/></button></div>
            <div className="collection-image"><img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85" alt="Fashion editorial for the XIV collection"/><span>THE EVERYDAY EDIT / NO. 04</span></div>
          </section>

          <section className="section shop-section"><div className="section-heading"><div><p className="eyebrow">THE ROTATION</p><h2>Made for repeat wear</h2></div><button className="text-link" onClick={() => goShop("All")}>Shop all <ArrowRight size={16}/></button></div><CategoryTiles onChoose={goShop}/></section>

          <section className="approach"><p className="eyebrow">OUR APPROACH TO FASHION</p><h2>Good clothes.<br/><em>Long stories.</em></h2><p>Thoughtfully selected fabrics, useful silhouettes and details that earn their place in your everyday rotation.</p><button className="text-link" onClick={() => goShop("All")}>Find your everyday <ArrowRight size={16}/></button><div className="approach-images"><img src="https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=900&q=85" alt="Neutral wardrobe details"/><img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=85" alt="Everyday fashion styling"/><img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=85" alt="Fashion editorial"/><img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85" alt="Streetwear editorial"/></div></section>
        </>}

        {page === "shop" && <section className="section catalog-section"><div className="catalog-title"><p className="eyebrow">THE XIV EDIT / {category.toUpperCase()}</p><h1>{category === "All" ? "All pieces" : category + "'s collection"}<sup>{filtered.length.toString().padStart(2, "0")}</sup></h1><p>Easy layers, everyday essentials and pieces worth keeping.</p></div>
          <div className="catalog-controls"><div className="category-tabs">{["All", "Men", "Women", "Kids"].map((c) => <button key={c} className={category === c ? "active" : ""} onClick={() => setCategory(c)}>{c}</button>)}</div><div className="control-right"><button className="filter-button" onClick={() => setFilterOpen((v) => !v)}><SlidersHorizontal size={15}/> Filter</button><label>Sort <ChevronDown size={14}/><select aria-label="Sort products" value={sort} onChange={(e) => setSort(e.target.value)}><option value="featured">Featured</option><option value="new">New arrivals</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></label></div></div>
          {filterOpen && <div className="filter-panel"><span>Category</span>{["All", "Men", "Women", "Kids"].map((c) => <button key={c} className={category === c ? "selected" : ""} onClick={() => setCategory(c)}>{c}</button>)}<button className="clear-filter" onClick={() => { setCategory("All"); setSort("featured"); setQuery(""); }}>Clear all</button></div>}
          {notice && <p className="notice">{notice}</p>}
          {filtered.length ? <div className="product-grid catalog-grid">{filtered.map((p) => <ProductCard key={p.id} product={p} wished={wishlist.includes(p.id)} onWish={() => toggleWish(p.id)} onOpen={() => openProduct(p)}/>)}</div> : <div className="empty-state"><p>No pieces found.</p><button className="text-link" onClick={() => { setQuery(""); setCategory("All"); }}>Clear search <ArrowRight size={16}/></button></div>}
        </section>}

        {page === "checkout" && <section className="section checkout-page"><button className="back-link" onClick={() => { setPage("home"); setCartOpen(true); }}><ArrowLeft size={16}/> Back to bag</button>{orderComplete ? <div className="order-success"><div className="success-icon"><Check/></div><p className="eyebrow">THANK YOU</p><h1>Your order is noted.</h1><p>This is a demo checkout, so no payment has been taken and no order has been sent to a fulfilment system.</p><button className="primary-button" onClick={() => { setOrderComplete(false); setCart([]); setPage("home"); window.scrollTo({top:0,behavior:"smooth"}); }}>Continue shopping <ArrowRight size={16}/></button></div> : <><div className="checkout-heading"><p className="eyebrow">ALMOST YOURS</p><h1>Checkout</h1><p>Complete your details to preview the order flow.</p></div><div className="checkout-layout"><form className="checkout-form" onSubmit={(e) => { e.preventDefault(); setOrderComplete(true); }}><h2>Contact information</h2><label>Email address<input type="email" placeholder="you@example.com" required/></label><h2>Shipping address</h2><div className="form-two"><label>First name<input autoComplete="given-name" required/></label><label>Last name<input autoComplete="family-name" required/></label></div><label>Address<input autoComplete="street-address" required/></label><div className="form-two"><label>City<input autoComplete="address-level2" required/></label><label>PIN code<input inputMode="numeric" pattern="[0-9]{6}" maxLength={6} autoComplete="postal-code" required/></label></div><label>Phone number<input type="tel" inputMode="tel" pattern="[0-9+() -]{8,16}" autoComplete="tel" required/></label><div className="demo-warning">Demo checkout only. Payment gateway and server-side order creation must be connected before launch.</div><button className="primary-button full-button" type="submit">Preview order · {money(subtotal)} <ArrowRight size={16}/></button></form><aside className="order-summary"><h2>Your order <span>{cartCount} items</span></h2>{cartProducts.map((line) => <div className="summary-line" key={line.productId + line.size}><img src={line.product.image} alt={line.product.alt}/><div><b>{line.product.name}</b><span>Size {line.size} · Qty {line.quantity}</span></div><strong>{money(line.product.price * line.quantity)}</strong></div>)}<div className="summary-total"><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div className="summary-total"><span>Shipping</span><span>{subtotal >= 1999 || subtotal === 0 ? "Free" : money(99)}</span></div><div className="summary-total grand-total"><span>Total</span><strong>{money(subtotal + (subtotal > 0 && subtotal < 1999 ? 99 : 0))}</strong></div></aside></div></>}</section>}
      </main>

      <footer className="site-footer"><div className="footer-top"><div><button className="footer-logo" onClick={() => { setPage("home"); window.scrollTo({top:0,behavior:"smooth"}); }}>XIV<span>®</span></button><p>Everyday pieces, thoughtfully considered.</p></div><div className="footer-links"><div><b>Explore</b><button onClick={() => goShop("All")}>Shop all</button><button onClick={() => goShop("Men")}>Men</button><button onClick={() => goShop("Women")}>Women</button><button onClick={() => goShop("Kids")}>Kids</button></div><div><b>Help</b><a href="mailto:hello@xiv.store">Contact us</a><button onClick={() => setNotice("Shipping details will be published before launch.")}>Shipping</button><button onClick={() => setNotice("Returns policy will be published before launch.")}>Returns</button></div><div><b>Follow along</b><a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram ↗</a><a href="https://www.pinterest.com/" target="_blank" rel="noreferrer">Pinterest ↗</a></div></div></div><div className="footer-bottom"><span>© XIV STUDIO 2026</span><span>MADE FOR EVERY DAY</span><button onClick={() => window.scrollTo({top:0,behavior:"smooth"})}>Back to top ↑</button></div></footer>

      {menuOpen && <div className="overlay-layer" onMouseDown={(e) => e.target === e.currentTarget && setMenuOpen(false)}><aside className="side-panel menu-panel"><div className="panel-head"><span>MENU / XIV</span><button className="icon-button" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X/></button></div><div className="menu-links"><button onClick={() => { setPage("home"); setMenuOpen(false); }}>Home <ArrowRight/></button><button onClick={() => goShop("All")}>Shop all <ArrowRight/></button><button onClick={() => goShop("Men")}>Men <ArrowRight/></button><button onClick={() => goShop("Women")}>Women <ArrowRight/></button><button onClick={() => goShop("Kids")}>Kids <ArrowRight/></button><button onClick={() => { setPage("shop"); setSort("new"); setMenuOpen(false); }}>New arrivals <ArrowRight/></button></div><p className="panel-note">XIV COLLECTIONS / 2026</p></aside></div>}

      {cartOpen && <div className="overlay-layer" onMouseDown={(e) => e.target === e.currentTarget && setCartOpen(false)}><aside className="side-panel cart-panel"><div className="panel-head"><span>YOUR BAG / {cartCount.toString().padStart(2, "0")}</span><button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close cart"><X/></button></div>{cartProducts.length ? <><div className="cart-lines">{cartProducts.map((line) => <div className="cart-line" key={line.productId + line.size}><img src={line.product.image} alt={line.product.alt}/><div className="cart-line-info"><p className="eyebrow">{line.product.category} / {line.product.type}</p><h3>{line.product.name}</h3><span>Size: {line.size}</span><strong>{money(line.product.price)}</strong><div className="qty-control"><button aria-label="Decrease quantity" onClick={() => changeQty(line.productId, line.size, -1)}><Minus size={13}/></button><span>{line.quantity}</span><button aria-label="Increase quantity" onClick={() => changeQty(line.productId, line.size, 1)}><Plus size={13}/></button><button className="remove-line" onClick={() => setCart((old) => old.filter((item) => !(item.productId === line.productId && item.size === line.size)))}>Remove</button></div></div></div>)}</div><div className="cart-footer"><div className="cart-subtotal"><span>Subtotal</span><strong>{money(subtotal)}</strong></div><p>Shipping and taxes calculated at checkout.</p><button className="primary-button full-button" onClick={() => { setCartOpen(false); setPage("checkout"); window.scrollTo({top:0,behavior:"smooth"}); }}>Continue to checkout <ArrowRight size={16}/></button><button className="continue-link" onClick={() => { setCartOpen(false); goShop("All"); }}>Continue shopping</button></div></> : <div className="empty-cart"><ShoppingBag size={30}/><h3>Your bag is taking a break.</h3><p>Find something you’ll reach for every day.</p><button className="primary-button" onClick={() => { setCartOpen(false); goShop("All"); }}>Explore pieces <ArrowRight size={16}/></button></div>}</aside></div>}

      {selected && <div className="overlay-layer product-overlay" onMouseDown={(e) => e.target === e.currentTarget && setSelected(null)}><section className="product-modal"><button className="modal-close icon-button" onClick={() => setSelected(null)} aria-label="Close product"><X/></button><div className="modal-image"><img src={selected.image} alt={selected.alt}/>{selected.badge && <span className="product-badge">{selected.badge}</span>}</div><div className="modal-info"><p className="eyebrow">{selected.category} / {selected.type}</p><h2>{selected.name}</h2><p className="modal-subtitle">{selected.subtitle}</p><strong className="modal-price">{money(selected.price)}</strong><p className="tax-note">Inclusive of all taxes</p><div className="modal-rule"/><div className="size-heading"><span>Choose size</span><button onClick={() => setNotice("Check the garment description and fit notes before choosing your usual size.")}>Size guide</button></div><div className="size-options">{selected.sizes.map((size) => <button key={size} className={selectedSize === size ? "chosen" : ""} onClick={() => { setSelectedSize(size); setNotice(""); }}>{size}</button>)}</div>{notice && <p className="notice">{notice}</p>}<button className="primary-button full-button" onClick={() => addToCart(selected, selectedSize)}>Add to bag · {money(selected.price)} <ArrowRight size={16}/></button><button className="modal-wish" onClick={() => toggleWish(selected.id)}><Heart size={16} fill={wishlist.includes(selected.id) ? "currentColor" : "none"}/>{wishlist.includes(selected.id) ? "Saved to favourites" : "Add to favourites"}</button><div className="modal-details"><p>DETAILS</p><span>Designed for everyday wear with a considered fit and easy styling.</span><p>COLOUR</p><span>{selected.color}</span><p>CARE</p><span>Follow the care label. Wash with similar colours.</span></div></div></section></div>}
    </div>
  );
}

function ProductCard({ product, wished, onWish, onOpen }: { product: Product; wished: boolean; onWish: () => void; onOpen: () => void }) {
  return <article className="product-card"><button className="product-image" onClick={onOpen} aria-label={"View " + product.name}><img src={product.image} alt={product.alt} loading="lazy"/>{product.badge && <span className="product-badge">{product.badge}</span>}<span className="quick-view">Quick view <ArrowRight size={14}/></span></button><button className={"wish-button " + (wished ? "is-wished" : "")} onClick={onWish} aria-label={wished ? "Remove from favourites" : "Add to favourites"}><Heart size={17} fill={wished ? "currentColor" : "none"}/></button><div className="product-meta"><div><p>{product.type}</p><button onClick={onOpen}>{product.name}</button></div><strong>{money(product.price)}</strong></div><p className="product-subtitle">{product.subtitle}</p></article>;
}

function CategoryTiles({ onChoose }: { onChoose: (category: string) => void }) {
  const tiles = [
    { name: "Men", note: "Everyday essentials", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85" },
    { name: "Women", note: "Easy, considered layers", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=85" },
    { name: "Kids", note: "Made for little days", image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=1000&q=85" },
  ];
  return <div className="category-tiles">{tiles.map((tile) => <button className="category-tile" key={tile.name} onClick={() => onChoose(tile.name)}><img src={tile.image} alt={tile.name + " collection"} loading="lazy"/><span className="tile-note">{tile.note}</span><span className="tile-title">{tile.name}<ArrowUpRightIcon/></span></button>)}</div>;
}
function ArrowUpRightIcon() { return <ArrowDownRight size={18} className="tile-arrow"/>; }
