import { useEffect, useState } from "react";
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, ShoppingBag, X, Search, SlidersHorizontal, Share2 } from "lucide-react";
import Checkout from "./Checkout";
import Admin from "./Admin";
import { EternalFit, HomepageSettings, Shoe, defaultSizesForProduct, loadEternalFits, loadFeatured, loadHomepageSettings, loadProducts, loadCategories, hydrateFromCloud } from "./store";
import PatternWaves from "./PatternWaves";
import TrackOrder from "./TrackOrder";

type CartItem = { shoe: Shoe; size: string };

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
  const collectionPath = window.location.pathname === "/best-sellers" ? "best" : window.location.pathname === "/new-drop" ? "new" : null;
  const [products, setProducts] = useState<Shoe[]>(loadProducts);
  const [savedCategories, setSavedCategories] = useState<string[]>(loadCategories);
  const [featuredIds, setFeaturedIds] = useState<number[]>(loadFeatured);
  const [eternalFits, setEternalFits] = useState<EternalFit[]>(loadEternalFits);
  const [homepage, setHomepage] = useState<HomepageSettings>(loadHomepageSettings);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Shoe | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [galleryTouchStart, setGalleryTouchStart] = useState<number | null>(null);
  const [shopOpen, setShopOpen] = useState(collectionPath !== null);
  const [collectionMode, setCollectionMode] = useState<"best" | "new" | null>(collectionPath);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [sortBy, setSortBy] = useState("featured");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [openDetail, setOpenDetail] = useState<string | null>("description");
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"details" | "review" | "success">("details");
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "upi" | "card">("upi");
  const [checkoutData, setCheckoutData] = useState({ email: "", phone: "", firstName: "", lastName: "", address: "", apartment: "", city: "Chennai", state: "Tamil Nadu", pincode: "" });
  const [added, setAdded] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const state = await hydrateFromCloud(true);
      if (!mounted || state !== "synced") return;
      setProducts(loadProducts());
      setSavedCategories(loadCategories());
      setFeaturedIds(loadFeatured());
      setEternalFits(loadEternalFits());
      setHomepage(loadHomepageSettings());
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const syncProducts = () => setProducts(loadProducts());
    const syncFeatured = () => setFeaturedIds(loadFeatured());
    const syncEternalFits = () => setEternalFits(loadEternalFits());
    const syncHomepage = () => setHomepage(loadHomepageSettings());
    const syncCategories = () => setSavedCategories(loadCategories());
    let syncingCloud = false;
    const syncCloud = async (force = false) => {
      if (syncingCloud || document.visibilityState === "hidden") return;
      syncingCloud = true;
      try {
        const state = await hydrateFromCloud(force);
        if (state !== "synced") return;
        setProducts(loadProducts());
        setSavedCategories(loadCategories());
        setFeaturedIds(loadFeatured());
        setEternalFits(loadEternalFits());
        setHomepage(loadHomepageSettings());
      } finally {
        syncingCloud = false;
      }
    };
    window.addEventListener("noirknull:products", syncProducts);
    window.addEventListener("noirknull:featured", syncFeatured);
    window.addEventListener("noirknull:eternal-fits", syncEternalFits);
    window.addEventListener("noirknull:homepage", syncHomepage);
    window.addEventListener("noirknull:categories", syncCategories);
    window.addEventListener("storage", syncProducts);
    window.addEventListener("storage", syncFeatured);
    window.addEventListener("storage", syncEternalFits);
    window.addEventListener("storage", syncHomepage);
    const channel = (() => { try { return new BroadcastChannel("noirknull-store"); } catch { return null; } })();
    channel?.addEventListener("message", syncProducts);
    const refreshOnFocus = () => { void syncCloud(true); };
    const refreshOnVisibility = () => { void syncCloud(); };
    window.addEventListener("focus", refreshOnFocus);
    document.addEventListener("visibilitychange", refreshOnVisibility);
    return () => {
      window.removeEventListener("noirknull:products", syncProducts);
      window.removeEventListener("noirknull:featured", syncFeatured);
      window.removeEventListener("noirknull:eternal-fits", syncEternalFits);
      window.removeEventListener("noirknull:homepage", syncHomepage);
      window.removeEventListener("noirknull:categories", syncCategories);
      window.removeEventListener("storage", syncProducts);
      window.removeEventListener("storage", syncFeatured);
      window.removeEventListener("storage", syncEternalFits);
      window.removeEventListener("storage", syncHomepage);
      channel?.removeEventListener("message", syncProducts);
      channel?.close();
      window.removeEventListener("focus", refreshOnFocus);
      document.removeEventListener("visibilitychange", refreshOnVisibility);
    };
  }, []);

  useEffect(() => {
    const productId = Number(new URLSearchParams(window.location.search).get("product"));
    if (!productId) return;
    const shoe = products.find((item) => item.id === productId);
    if (!shoe) return;
    setSelectedProduct(shoe);
    setSelectedImageIndex(0);
    setSelectedSize(null);
    setOpenDetail("description");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [products]);

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
    setCollectionMode(null);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goTo = (id: string) => {
    
    setSelectedProduct(null);
    setShopOpen(false);
    setCollectionMode(null);
    setMobileMenuOpen(false);
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };
  const openProduct = (shoe: Shoe) => {
    setSelectedProduct(shoe);
    setSelectedImageIndex(0);
    setSelectedSize(null);
    setOpenDetail("description");
    const url = new URL(window.location.href);
    url.searchParams.set("product", String(shoe.id));
    window.history.pushState({ product: shoe.id }, "", url);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const closeProduct = () => {
    setSelectedProduct(null);
    setSelectedImageIndex(0);
    setSelectedSize(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("product");
    window.history.replaceState({}, "", url.pathname + url.search + url.hash);
  };
  const shareProduct = async (shoe: Shoe) => {
    const url = new URL(window.location.href);
    url.searchParams.set("product", String(shoe.id));
    const shareData = {
      title: shoe.name + " — NoirKnull",
      text: shoe.description?.trim() || (shoe.name + " — " + money(shoe.price)),
      url: url.toString(),
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url.toString());
        window.alert("Product link copied.");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      try {
        await navigator.clipboard.writeText(url.toString());
        window.alert("Product link copied.");
      } catch {}
    }
  };
  const sizeOptionsForProduct = (shoe: Shoe) => {
    const sizes = Array.isArray(shoe.sizes) && shoe.sizes.length ? shoe.sizes.map(String) : defaultSizesForProduct(shoe);
    return sizes;
  };
  const categoryName = (shoe: Shoe) => shoe.category?.trim() || "SHOES";
  const categories = ["ALL", ...savedCategories.filter(category => category && category.toUpperCase() !== "ALL")];
  const homepageShoes = products.filter((shoe) => featuredIds.includes(shoe.id));
  const legacyHomeCollection = homepageShoes.length ? homepageShoes : products;
  const bestSellerProducts = products.filter((shoe) => Boolean(shoe.isBestSeller));
  const bestSellers = (bestSellerProducts.length ? bestSellerProducts : legacyHomeCollection).slice(0, 10);
  const bestSellerIds = new Set(bestSellers.map(shoe => shoe.id));
  const taggedNewDrops = products.filter((shoe) => Boolean(shoe.isNewDrop) || shoe.tag?.trim().toUpperCase() === "NEW DROP");
  const newDrops = (taggedNewDrops.length ? taggedNewDrops : products.filter(shoe => !bestSellerIds.has(shoe.id))).slice(0, 10);
  const selectedProductImages = selectedProduct?.images?.length ? selectedProduct.images : selectedProduct ? [selectedProduct.image] : [];
  const matchesShopCategory = (shoe: Shoe, selected: string) => {
    if (selected === "ALL") return true;
    const text = `${shoe.name} ${shoe.kind} ${shoe.category || ""}`.toLowerCase();
    if (selected === "SHOES") return shoe.productType === "shoes" || /shoe|sneaker|runner|court|street|essential/.test(text);
    if (selected === "WATCHES") return shoe.productType === "watch" || /watch/.test(text);
    if (selected === "ACCESSORIES") return shoe.productType === "accessory" || /accessor|bag|wallet|cap|belt/.test(text);
    if (selected === "JACKETS") return /jacket/.test(text);
    return categoryName(shoe).toUpperCase() === selected.toUpperCase();
  };
  const visibleShoes = products.filter((shoe) => {
    const matchesSearch = `${shoe.name} ${shoe.kind} ${shoe.tone} ${shoe.tag || ""} ${shoe.category || ""} ${shoe.productType || ""} ${shoe.description || ""}`.toLowerCase().includes(searchTerm.trim().toLowerCase());
    const matchesCollection = collectionMode === "best" ? Boolean(shoe.isBestSeller) : collectionMode === "new" ? Boolean(shoe.isNewDrop) : true;
    return matchesSearch && matchesCollection && matchesShopCategory(shoe, activeCategory);
  }).sort((a,b) => sortBy === "price-low" ? a.price-b.price : sortBy === "price-high" ? b.price-a.price : sortBy === "name" ? a.name.localeCompare(b.name) : a.id-b.id);
  const add = (shoe: Shoe, size: string) => {
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
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" }));
  };
  const updateCheckout = (key: keyof typeof checkoutData, value: string) => setCheckoutData((old) => ({ ...old, [key]: value }));
  const checkoutReady = Boolean(checkoutData.email.trim() && checkoutData.phone.trim() && checkoutData.firstName.trim() && checkoutData.lastName.trim() && checkoutData.address.trim() && checkoutData.city.trim() && checkoutData.state.trim() && checkoutData.pincode.trim().length === 6);

  if (isAdmin) return <Admin />;
  if (isTrackOrder) return <TrackOrder />;

  return <div className="noir-site">
    <div className="topline"><span>SNEAKERS & ACCESSORIES / EST. 2026</span><span>FREE SHIPPING OVER ₹5,000 ↗</span></div>
    <header className="noir-header liquid-glass-header">
      <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(value => !value)} aria-label={mobileMenuOpen ? "Close menu" : "Open menu"} aria-controls="noirknull-mobile-nav" aria-expanded={mobileMenuOpen}>☰</button>
      <nav id="noirknull-mobile-nav" className={mobileMenuOpen ? "nav-links nav-open" : "nav-links"}>
        <button className="nav-primary header-shop-link" onClick={openShop}>SHOP <span>↗</span></button>
        <button className="nav-primary header-world-link" onClick={() => { closeProduct(); goTo("about-noirknull"); setMobileMenuOpen(false); }}>ABOUT US</button>
        <a className="nav-primary header-track-link" href="/track-order" onClick={() => setMobileMenuOpen(false)}>TRACK ORDER</a>
      </nav>
      <button className="noir-logo" onClick={() => { setMobileMenuOpen(false); closeProduct(); setShopOpen(false); setCheckoutOpen(false); setCartOpen(false); requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" })); }} aria-label="NoirKnull home">NoirKnull<span>®</span></button>
      <button className="bag-button" onClick={() => setCartOpen(true)}><ShoppingBag size={17}/><span>BAG</span><b>{cart.length}</b></button>
    </header>

    {shopOpen && !selectedProduct && <main className="shop-page">
      <div className="shop-page-top"><div className="shop-breadcrumb"><button onClick={() => { setShopOpen(false); window.scrollTo({top:0,behavior:"smooth"}); }}>HOME</button><span>/</span><span>SHOP ALL</span></div><p className="kicker">NOIRKNULL® — {collectionMode === "best" ? "BEST SELLERS" : collectionMode === "new" ? "NEW DROP" : "THE FIRST DROP"}</p><h1>{collectionMode === "best" ? <>The most<br/><em>wanted.</em></> : collectionMode === "new" ? <>Just<br/><em>dropped.</em></> : <>Find your<br/><em>own pace.</em></>}</h1><p className="shop-intro">{collectionMode === "best" ? "The pieces customers keep coming back for." : collectionMode === "new" ? "Fresh silhouettes. Just landed. Made for your next move." : <>Considered silhouettes. Everyday movement.<br/>Find the pair that feels like you.</>}</p></div>
   
      <div className="shop-toolbar"><div className="shop-result-count">{visibleShoes.length} OBJECT{visibleShoes.length===1?"":"S"} <span> / THE COLLECTION</span></div><label className="shop-search"><Search size={17}/><input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search sneakers, styles..." aria-label="Search products"/>{searchTerm && <button onClick={() => setSearchTerm("")} aria-label="Clear search"><X size={15}/></button>}</label><label className="shop-sort"><SlidersHorizontal size={15}/><span>SORT</span><select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort products"><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name: A–Z</option></select></label></div>
      <div className="shop-body">
        <div className="shop-mobile-controls">
          <label className="shop-mobile-search"><Search size={16}/><input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search products..." aria-label="Search products"/>{searchTerm && <button onClick={() => setSearchTerm("")} aria-label="Clear search"><X size={14}/></button>}</label>
          <label className="shop-mobile-sort"><span>SORT</span><select value={sortBy} onChange={(e) => setSortBy(e.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name: A–Z</option></select></label>
        </div>
        <div className="shop-filters shop-filters-top">
          <div className="filter-heading"><span>CATEGORIES</span><b>FILTER THE DROP</b></div>
          <div className="shop-category-row">
            {categories.map((category) => <button key={category} className={activeCategory===category?"category-filter active":"category-filter"} onClick={() => setActiveCategory(category)}>
              <span className="category-filter-label">{category}</span>
              <span className="category-filter-count">{category==="ALL"?products.length:products.filter((shoe)=>categoryName(shoe).toUpperCase()===category.toUpperCase()).length}</span>
            </button>)}
          </div>
        </div>
        <div className="shop-results">{visibleShoes.length ? <div className="shop-product-grid">{visibleShoes.map((shoe,i)=><article className="shop-product-card" key={shoe.id}><button className="shop-product-image" onClick={()=>openProduct(shoe)} aria-label={`View ${shoe.name}`}><img src={shoe.image} alt={shoe.kind} loading="lazy" decoding="async"/>{shoe.tag&&<span className="shoe-tag">{shoe.tag}</span>}<span className="shop-view-link">VIEW PRODUCT <ArrowUpRight size={15}/></span></button><div className="shop-product-meta"><div><p>{shoe.category || (shoe.productType === "watch" ? "WATCHES" : shoe.productType === "apparel" ? "APPAREL" : shoe.productType === "accessory" ? "ACCESSORIES" : "SHOES")}</p><h2>{shoe.name}</h2><span>{shoe.tone}</span></div><strong>{money(shoe.price)}</strong></div></article>)}</div> : <div className="shop-empty"><Search size={25}/><h2>No matches found.</h2><p>Try another search or clear your filters.</p><button onClick={()=>{setSearchTerm("");setActiveCategory("ALL");}}>CLEAR FILTERS ↗</button></div>}</div></div>
      <div className="shop-bottom-note"><span>DESIGNED WITH INTENTION.</span><span>NO RULES, JUST FORM — NOIRKNULL®</span></div>
 </main>}
    {selectedProduct && <main className="product-page" style={{ "--product-glass-tint": selectedProduct.glassTint?.trim() || tintFromTone(selectedProduct.tone) } as React.CSSProperties}>
      <div className="product-crumb"><button onClick={closeProduct}>← BACK TO SHOP</button><span>COLLECTION / {selectedProduct.name}</span><span>NOIRKNULL®</span></div>
      <div className="product-layout">
        <div className="product-gallery">
          <div className="product-gallery-stage" onTouchStart={e => setGalleryTouchStart(e.touches[0].clientX)} onTouchEnd={e => {
            if (galleryTouchStart === null || selectedProductImages.length < 2) { setGalleryTouchStart(null); return; }
            const delta = e.changedTouches[0].clientX - galleryTouchStart;
            if (Math.abs(delta) > 45) setSelectedImageIndex(index => delta < 0 ? (index + 1) % selectedProductImages.length : (index - 1 + selectedProductImages.length) % selectedProductImages.length);
            setGalleryTouchStart(null);
          }} onTouchCancel={() => setGalleryTouchStart(null)}>
            <div className="product-main-image">
              <img key={selectedImageIndex} className="product-gallery-slide" src={selectedProductImages[selectedImageIndex] || selectedProduct.image} alt={selectedProduct.kind}/>
              {selectedProductImages.length > 1 && <>
                <button className="product-gallery-arrow product-gallery-arrow-prev" onClick={() => setSelectedImageIndex(index => (index - 1 + selectedProductImages.length) % selectedProductImages.length)} aria-label="Previous product image">←</button>
                <button className="product-gallery-arrow product-gallery-arrow-next" onClick={() => setSelectedImageIndex(index => (index + 1) % selectedProductImages.length)} aria-label="Next product image">→</button>
              </>}
              <div className="product-glass-product-label"><span>{selectedProduct.category || (selectedProduct.productType === "watch" ? "WATCHES" : selectedProduct.productType === "apparel" ? "APPAREL" : selectedProduct.productType === "accessory" ? "ACCESSORIES" : "SHOES")}</span><strong>{selectedProduct.name}</strong></div>
              <span className="product-image-index">{String(selectedImageIndex + 1).padStart(2, "0")} / {String(selectedProductImages.length).padStart(2, "0")}</span>
            </div>
            {selectedProductImages.length > 1 && <div className="product-gallery-thumbs">{selectedProductImages.map((image, index) => <button key={index} className={index === selectedImageIndex ? "active" : ""} onClick={() => setSelectedImageIndex(index)} aria-label={`View product image ${index + 1}`}><img src={image} alt="" loading="lazy" decoding="async" /></button>)}</div>}
          </div>
          <div className="product-gallery-note"><span>SWIPE TO EXPLORE.</span><span>FORM FOLLOWS FEELING ↗</span></div>
        </div>
        <div className="product-information">
          <div className="product-status-row">
            <p className="kicker"><i/> {selectedProduct.tag || "THE FIRST DROP"}</p>
            <div className="product-status-badges">
              {selectedProduct.isBestSeller && <span>BEST SELLER</span>}
              {selectedProduct.isNewDrop && <span>NEW DROP</span>}
            </div>
          </div>
          <p className="product-category">{selectedProduct.category || selectedProduct.kind}</p>
          <div className="product-title-row">
            <h1>{selectedProduct.name}</h1>
            <button className="product-share-button" type="button" onClick={() => shareProduct(selectedProduct)} aria-label={"Share " + selectedProduct.name} title="Share product">
              <Share2 size={17}/>
              <span>SHARE</span>
            </button>
          </div>
          <div className="product-price-line"><strong>{money(selectedProduct.price)}</strong><span>INCLUSIVE OF TAXES</span></div>
          <p className="product-tone">{selectedProduct.tone}</p>
          <p className="product-description">{selectedProduct.description?.trim() || "A considered everyday silhouette. Clean lines, a confident profile and a design that moves with your own direction. No extra noise—just the essentials."}</p>
          {sizeOptionsForProduct(selectedProduct).length > 0 ? <>
            <div className="size-heading"><span>{selectedProduct.productType === "apparel" ? "SELECT YOUR SIZE" : selectedProduct.productType === "watch" || selectedProduct.productType === "accessory" ? "SIZE" : "SELECT YOUR SIZE (INDIA / UK)"}</span>{selectedProduct.productType === "shoes" && <button onClick={() => setOpenDetail(openDetail === "size" ? null : "size")}>SIZE GUIDE ↗</button>}</div>
            <div className={"size-grid " + ((selectedProduct.productType === "watch" || selectedProduct.productType === "accessory") ? "size-grid-one" : "")}>{sizeOptionsForProduct(selectedProduct).map(size => <button key={size} className={selectedSize === size ? "size-option size-selected" : "size-option"} onClick={() => setSelectedSize(size)} aria-pressed={selectedSize === size}>{size}</button>)}</div>
            {openDetail === "size" && selectedProduct.productType === "shoes" && <div className="size-guide-note">Choose your usual UK/India shoe size. If you are between sizes, check the fit with our team before ordering.</div>}
          </> : <div className="size-not-required"><span>SIZE</span><strong>ONE SIZE / NOT REQUIRED</strong></div>}
          <button className="product-add-button" onClick={() => selectedSize || sizeOptionsForProduct(selectedProduct).length === 0 ? add(selectedProduct, selectedSize || "OS") : document.querySelector(".size-grid")?.scrollIntoView({ behavior: "smooth", block: "center" })}>{selectedSize ? "ADD TO BAG — " + money(selectedProduct.price) : sizeOptionsForProduct(selectedProduct).length === 0 ? "ADD TO BAG — " + money(selectedProduct.price) : "SELECT A SIZE TO CONTINUE"} <ArrowRight size={17}/></button>
          <p className="product-delivery-note">↗ FREE SHIPPING ON ORDERS OVER ₹5,000</p>
          <div className="product-accordions">
            <div className="product-accordion"><button onClick={() => setOpenDetail(openDetail === "description" ? null : "description")}><span>PRODUCT DETAILS</span><b>{openDetail === "description" ? "−" : "+"}</b></button>{openDetail === "description" && <p>{selectedProduct.description?.trim() || "Designed around everyday versatility and a distinct silhouette. Colourway: " + selectedProduct.tone + ". Product: " + selectedProduct.name + ". A fresh take on footwear for your own pace."}</p>}</div>
            <div className="product-accordion"><button onClick={() => setOpenDetail(openDetail === "fit" ? null : "fit")}><span>FIT & SIZING</span><b>{openDetail === "fit" ? "−" : "+"}</b></button>{openDetail === "fit" && <p>Available sizes shown in UK/India sizing. Select your size before adding to your bag. For exact insole measurements, confirm with the store before purchase.</p>}</div>
            <div className="product-accordion"><button onClick={() => setOpenDetail(openDetail === "shipping" ? null : "shipping")}><span>SHIPPING & RETURNS</span><b>{openDetail === "shipping" ? "−" : "+"}</b></button>{openDetail === "shipping" && <p>Shipping and return policies need to be confirmed by the store before checkout is enabled. Orders are not being processed in this preview yet.</p>}</div>
          </div>
          <div className="product-number"><span>NOIRKNULL / 2026</span><span>0{selectedProduct.id} — 04</span></div>
        </div>
      </div>
      <section className="related-products"><div><p className="kicker">KEEP EXPLORING</p><h2>More from the<br/><em>first drop.</em></h2></div><div className="related-grid">{products.filter((shoe) => shoe.id !== selectedProduct.id).slice(0,3).map((shoe) => <button key={shoe.id} className="related-card" onClick={() => openProduct(shoe)}><img src={shoe.image} alt={shoe.kind} loading="lazy" decoding="async"/><span>{shoe.name} <b>{money(shoe.price)}</b></span><small>{shoe.category || (shoe.productType === "watch" ? "WATCHES" : shoe.productType === "apparel" ? "APPAREL" : shoe.productType === "accessory" ? "ACCESSORIES" : "SHOES")} ↗</small></button>)}</div></section>
    </main>}
    {checkoutOpen && <Checkout cart={cart} onBack={() => { setCheckoutOpen(false); setCartOpen(true); }} onComplete={() => { setCheckoutOpen(false); setCart([]); setCheckoutStep("details"); window.scrollTo({ top: 0, behavior: "smooth" }); }} />}
    {!checkoutOpen && <main id="top" className={selectedProduct || shopOpen ? "home-content home-hidden" : "home-content"}>
      <section className="shoe-hero" aria-label="NoirKnull opening">
        <div className="landing-hero-image">
          <img src={homepage.heroImage || homepage.editorialMainImage} alt="NoirKnull collection" fetchPriority="high" decoding="async" />
        </div>
        <div className="landing-hero-overlay">
          <div className="landing-hero-brand">
            <span>NOIRKNULL®</span>
            <small>EST. 2026 / INDIA</small>
          </div>
          <div className="landing-hero-actions">
            <button onClick={openShop}>SHOP <ArrowRight size={16}/></button>
            <button onClick={() => goTo("about-noirknull")}>ABOUT US <ArrowDownRight size={16}/></button>
          </div>
          <div className="landing-hero-scroll">SCROLL TO EXPLORE ↓</div>
        </div>
      </section>


      <section className="homepage-categories section-wrap" id="categories" aria-label="Shop by category">
        <div className="homepage-section-heading reveal">
          <div>
            <p className="kicker">SHOP</p>
            <h2>Shop by<br/><em>category.</em></h2>
          </div>
          <p className="section-intro">Start with what you came for. Explore the collection by category, then make it your own.<br/>Sneakers, watches, accessories and jackets.</p>
        </div>
        <div className="homepage-category-grid">
          {[
            {
              key: "SHOES",
              label: "SHOES",
              kicker: "01 / FOOTWEAR",
              description: "Everyday silhouettes built around movement.",
              image: homepage.categoryImages?.SHOES || products.find((shoe) => shoe.productType === "shoes")?.image || homepage.editorialMainImage,
            },
            {
              key: "WATCHES",
              label: "WATCHES",
              kicker: "02 / TIME",
              description: "Useful details with a quieter point of view.",
              image: homepage.categoryImages?.WATCHES || products.find((shoe) => shoe.productType === "watch" || /watch/i.test(`${shoe.name} ${shoe.kind} ${shoe.category || ""}`))?.image || homepage.editorialAccessoryImages[0],
            },
            {
              key: "ACCESSORIES",
              label: "ACCESSORIES",
              kicker: "03 / THE EXTRAS",
              description: "The details that finish the whole feeling.",
              image: homepage.categoryImages?.ACCESSORIES || products.find((shoe) => shoe.productType === "accessory" || /accessor|bag|wallet|cap|belt/i.test(`${shoe.name} ${shoe.kind} ${shoe.category || ""}`))?.image || homepage.editorialAccessoryImages[1],
            },
            {
              key: "JACKETS",
              label: "JACKETS",
              kicker: "04 / OUTER LAYER",
              description: "Strong layers for wherever the day goes.",
              image: homepage.categoryImages?.JACKETS || products.find((shoe) => /jacket/i.test(`${shoe.name} ${shoe.kind} ${shoe.category || ""}`))?.image || homepage.fitPickImages[0],
            },
          ].map((category) => (
            <button
              key={category.key}
              className="homepage-category-card reveal"
              onClick={() => {
                setSelectedProduct(null);
                setShopOpen(true);
                setCollectionMode(null);
                setSearchTerm("");
                setSortBy("featured");
                setActiveCategory(category.key);
                setMobileMenuOpen(false);
                requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
              }}
              aria-label={`Shop ${category.label}`}
            >
              <div className="homepage-category-image">
                <img src={category.image} alt={category.label} loading="lazy" decoding="async"/>
                <span className="homepage-category-index">{category.kicker}</span>
                <span className="homepage-category-arrow"><ArrowUpRight size={18}/></span>
              </div>
              <div className="homepage-category-meta">
                <div>
                  <h3>{category.label}</h3>
                  <p>{category.description}</p>
                </div>
                <span>SHOP ↗</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {homepage.showNewDrops && newDrops.length > 0 && (
        <section className="homepage-products section-wrap" id="new-arrivals" aria-label="New arrivals">
          <div className="homepage-section-heading reveal">
            <div>
              <p className="kicker">NEW</p>
              <h2>New<br/><em>arrivals.</em></h2>
            </div>
            <p className="section-intro">Fresh from the studio. The newest pieces to enter the NoirKnull collection.</p>
          </div>
          <div className="homepage-products-grid">
            {newDrops.slice(0, 6).map((shoe) => (
              <article className="homepage-product-card reveal" key={shoe.id}>
                <button className="homepage-product-image" onClick={() => openProduct(shoe)} aria-label={`View ${shoe.name}`}>
                  <img src={shoe.image} alt={shoe.kind} loading="lazy" decoding="async"/>
                  <span className="homepage-product-badge">NEW ARRIVAL</span>
                  <span className="homepage-product-view">VIEW PRODUCT <ArrowUpRight size={14}/></span>
                </button>
                <div className="homepage-product-meta">
                  <div>
                    <span>{shoe.category || "NOIRKNULL"}</span>
                    <h3>{shoe.name}</h3>
                    <small>{shoe.tone}</small>
                  </div>
                  <strong>{money(shoe.price)}</strong>
                </div>
              </article>
            ))}
          </div>
          <div className="homepage-section-footer">
            <span>FRESH FROM THE STUDIO</span>
            <a href="/new-drop">VIEW ALL NEW ARRIVALS <ArrowRight size={14}/></a>
          </div>
        </section>
      )}

      {homepage.showBestSellers && bestSellers.length > 0 && (
        <section className="homepage-products homepage-best-sellers section-wrap" id="best-sellers" aria-label="Best sellers">
          <div className="homepage-section-heading reveal">
            <div>
              <p className="kicker">BEST SELLERS</p>
              <h2>Best<br/><em>sellers.</em></h2>
            </div>
            <p className="section-intro">The pairs earning their place. Proven favourites, kept in motion.</p>
          </div>
          <div className="homepage-products-grid">
            {bestSellers.slice(0, 6).map((shoe) => (
              <article className="homepage-product-card reveal" key={shoe.id}>
                <button className="homepage-product-image" onClick={() => openProduct(shoe)} aria-label={`View ${shoe.name}`}>
                  <img src={shoe.image} alt={shoe.kind} loading="lazy" decoding="async"/>
                  <span className="homepage-product-badge best">BEST SELLER</span>
                  <span className="homepage-product-view">VIEW PRODUCT <ArrowUpRight size={14}/></span>
                </button>
                <div className="homepage-product-meta">
                  <div>
                    <span>{shoe.category || "NOIRKNULL"}</span>
                    <h3>{shoe.name}</h3>
                    <small>{shoe.tone}</small>
                  </div>
                  <strong>{money(shoe.price)}</strong>
                </div>
              </article>
            ))}
          </div>
          <div className="homepage-section-footer">
            <span>THE ONES PEOPLE KEEP COMING BACK TO</span>
            <a href="/best-sellers">VIEW ALL BEST SELLERS <ArrowRight size={14}/></a>
          </div>
        </section>
      )}



      <section className="about-contact" id="about-noirknull" aria-label="About NoirKnull and contact information">
        <div className="about-noirknull-copy reveal">
          <p className="kicker">ABOUT NOIRKNULL</p>
          <h2>Made to<br/><em>stand apart.</em></h2>
          <p>NOIRKNULL is a sneakers and accessories brand built around considered design, everyday utility and the freedom to move your own way.</p>
          <p className="about-signoff">SNEAKERS / WATCHES / ACCESSORIES / JACKETS<br/>NOIRKNULL® — 2026</p>
        </div>
        <div className="about-contact-card reveal" id="contact">
          <div>
            <p className="kicker">CONTACT</p>
            <h3>Let's talk.</h3>
            <p>For product questions, collaborations, orders or anything else, reach us directly.</p>
          </div>
          <div className="contact-links">
            <a href="mailto:hello@noirknull.com"><span>EMAIL</span><strong>hello@noirknull.com</strong><ArrowUpRight size={16}/></a>
            <a href="/track-order"><span>ORDERS</span><strong>TRACK AN ORDER</strong><ArrowUpRight size={16}/></a>
          </div>
        </div>
      </section>
    </main>}

    {!checkoutOpen && <footer className={selectedProduct || shopOpen ? "noir-footer home-hidden" : "noir-footer"}>
      <div className="footer-main">
        <button className="noir-logo footer-wordmark" onClick={() => goTo("top")}>NoirKnull<span>®</span></button>
        <p>SNEAKERS & ACCESSORIES.<br/>MADE TO STAND APART.</p>
        <div className="footer-nav">
          <button onClick={() => goTo("categories")}>SHOP CATEGORIES</button>
          <button onClick={() => goTo("about-noirknull")}>ABOUT NOIRKNULL</button>
          <a href="/track-order">TRACK ORDER ↗</a>
          <a href="mailto:hello@noirknull.com">hello@noirknull.com ↗</a>
        </div>
      </div>
      <div className="footer-legal"><span>© NOIRKNULL 2026</span><span>SNEAKERS / WATCHES / ACCESSORIES / JACKETS</span><button onClick={() => goTo("top")}>BACK TO TOP ↑</button></div>
    </footer>

    }

    {cartOpen && <div className="cart-backdrop" onClick={() => setCartOpen(false)}><aside className="cart-drawer" onClick={(e) => e.stopPropagation()}><div className="cart-head"><div><p className="kicker">NOIRKNULL / YOUR BAG</p><h2>Your picks <span>({cart.length})</span></h2></div><button onClick={() => setCartOpen(false)} aria-label="Close bag"><X/></button></div>{cart.length === 0 ? <div className="empty-bag"><ShoppingBag size={28}/><p>Your bag is taking it slow.</p><button onClick={() => { setCartOpen(false); goTo("collection"); }}>EXPLORE THE DROP <ArrowRight size={15}/></button></div> : <><div className="bag-items">{cart.map((item, i) => <div className="bag-item" key={`${item.shoe.id}-${item.size}-${i}`}><img src={item.shoe.image} alt={item.shoe.kind} loading="lazy" decoding="async"/><div><p>{item.shoe.category || (item.shoe.productType === "watch" ? "WATCHES" : item.shoe.productType === "apparel" ? "APPAREL" : item.shoe.productType === "accessory" ? "ACCESSORIES" : "SHOES")} · {item.size === "OS" ? "ONE SIZE" : "SIZE " + item.size}</p><h3>{item.shoe.name}</h3><strong>{money(item.shoe.price)}</strong></div><button aria-label="Remove item" onClick={() => setCart((old) => old.filter((_, index) => index !== i))}><X size={15}/></button></div>)}</div><div className="bag-bottom"><div><span>SUBTOTAL</span><strong>{money(cart.reduce((sum, item) => sum + item.shoe.price, 0))}</strong></div><p>Shipping and taxes calculated at checkout.</p><button onClick={openCheckout}>CONTINUE TO CHECKOUT <ArrowRight size={16}/></button></div></>}</aside></div>}
  </div>;
}
