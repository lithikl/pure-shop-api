import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, Pencil, Plus, Save, Settings2, Trash2, X, Upload, RotateCcw } from "lucide-react";
import { loadOrders, updateOrderStatus, Order, OrderStatus } from "./orders";
import {
  ProductType,
  DEFAULT_ETERNAL_FITS,
  DEFAULT_HOMEPAGE,
  DEFAULT_SHOES,
  EternalFit,
  HomepageSettings,
  Shoe,
  loadEternalFits,
  loadFeatured,
  loadHomepageSettings,
  loadProducts,
  loadCategories,
  saveCategories,
  saveEternalFits,
  saveFeatured,
  saveHomepageSettings,
  saveProducts,
  hydrateFromCloud,
  defaultSizesForProduct,
  publishCloudSection,
} from "./store";

const money = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const productTypeLabel = (type: ProductType | undefined) => type === "watch" ? "WATCH" : type === "apparel" ? "APPAREL" : type === "accessory" ? "ACCESSORY" : type === "other" ? "OTHER" : "SHOES";

const emptyProduct = (): Shoe => ({
  id: Date.now(),
  name: "",
  kind: "SHOES",
  category: "SHOES",
  productType: "shoes",
  price: 0,
  image: "",
  images: [""],
  tone: "",
  tag: "",
  glassTint: "",
  isBestSeller: false,
  isNewDrop: false,
});

const emptyEternalFit = (): EternalFit => ({ id: Date.now(), image: "", title: "", meta: "", caption: "" });

const readImage = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result));
  reader.onerror = () => reject(reader.error);
  reader.readAsDataURL(file);
});

async function uploadMedia(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const token = localStorage.getItem("noirknull:admin-token:v1");
  const response = await fetch("https://noirknull.lithiksaran130510.workers.dev/api/upload", {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  if (!response.ok) throw new Error("Cloud upload failed");
  const payload = await response.json();
  if (!payload?.url) throw new Error("Cloud upload returned no URL");
  return payload.url;
}

function VideoPicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [busy, setBusy] = useState(false);
  const upload = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    try {
      try {
        onChange(await uploadMedia(file));
      } catch {
        onChange(await readImage(file));
        alert("Cloud upload was unavailable, so this upload is temporarily stored in this browser.");
      }
    } finally { setBusy(false); }
  };
  return <div className="admin-video-picker">
    <div className="admin-video-preview">{value ? <video src={value} controls muted playsInline /> : <span>NO VIDEO</span>}</div>
    <div className="admin-video-actions">
      <label className="admin-upload-button"><Upload size={14}/> {busy ? "READING..." : "UPLOAD VIDEO"}<input type="file" accept="video/mp4,video/webm,video/quicktime" onChange={e => upload(e.target.files?.[0])} hidden /></label>
      <input value={value.startsWith("data:") ? "" : value} onChange={e => onChange(e.target.value)} placeholder="/assets/your-video.mp4 or video URL..." />
    </div>
    <small>Upload an MP4 for same-browser control, or paste a public video URL / /assets/... path. Large videos may exceed browser localStorage limits.</small>
  </div>;
}

function ImagePicker({ value, onChange, label = "UPLOAD PHOTO", aspectRatio = 1 }: { value: string; onChange: (value: string) => void; label?: string; aspectRatio?: number }) {
  const [busy, setBusy] = useState(false);
  const [editingCrop, setEditingCrop] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  const upload = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    try {
      try {
        onChange(await uploadMedia(file));
      } catch {
        onChange(await readImage(file));
        alert("Cloud upload was unavailable, so this image is temporarily stored in this browser.");
      }
      setZoom(1); setOffsetX(0); setOffsetY(0); setEditingCrop(true);
    } finally { setBusy(false); }
  };

  const applyCrop = async () => {
    if (!value) return;
    setBusy(true);
    try {
      const safeRatio = Math.max(0.55, Math.min(2.2, aspectRatio));
      const width = 1600;
      const height = Math.round(width / safeRatio);
      const image = new Image();
      if (!value.startsWith("data:")) image.crossOrigin = "anonymous";
      image.src = value;
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("Unable to read image for cropping"));
      });

      const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight) * zoom;
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      const x = (width - drawWidth) / 2 + (offsetX / 80) * width * 0.45;
      const y = (height - drawHeight) / 2 + (offsetY / 80) * height * 0.45;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas is unavailable");
      context.clearRect(0, 0, width, height);
      context.drawImage(image, x, y, drawWidth, drawHeight);

      const cropped = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("Unable to create cropped image")), "image/png");
      });
      const file = new File([cropped], "noirknull-cropped.png", { type: "image/png" });
      try {
        const cloudUrl = await uploadMedia(file);
        onChange(cloudUrl);
      } catch {
        onChange(URL.createObjectURL(cropped));
        alert("The crop was created locally, but cloud upload is unavailable right now. Save again after the site is deployed.");
      }
      setEditingCrop(false);
    } catch (error) {
      console.error(error);
      alert("Could not apply the crop. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return <div className="admin-image-picker">
    <div className="admin-image-preview">{value ? <img src={value} alt="Preview" /> : <span>NO IMAGE</span>}</div>
    <div className="admin-image-picker-actions">
      <label className="admin-upload-button"><Upload size={14} /> {busy ? "READING..." : label}<input type="file" accept="image/*" onChange={e => upload(e.target.files?.[0])} hidden /></label>
      <input value={value.startsWith("data:") ? "" : value} onChange={e => onChange(e.target.value)} placeholder="or paste image URL..." />
      {value && <button type="button" className="admin-adjust-button" onClick={() => setEditingCrop(true)}><Pencil size={13}/> ADJUST IMAGE</button>}
    </div>
    {editingCrop && value && <div className="admin-crop-editor" style={{ "--crop-ratio": String(aspectRatio) } as Record<string, string>}>
      <div className="admin-crop-stage"><img src={value} alt="Adjust" style={{ transform: `translate(${offsetX}px,${offsetY}px) scale(${zoom})` }} /></div>
      <div className="admin-crop-controls">
        <label>ZOOM <input type="range" min="0.6" max="2.5" step="0.01" value={zoom} onChange={e => setZoom(Number(e.target.value))}/></label>
        <label>LEFT / RIGHT <input type="range" min="-80" max="80" step="1" value={offsetX} onChange={e => setOffsetX(Number(e.target.value))}/></label>
        <label>UP / DOWN <input type="range" min="-80" max="80" step="1" value={offsetY} onChange={e => setOffsetY(Number(e.target.value))}/></label>
        <div><button type="button" onClick={() => {setZoom(1);setOffsetX(0);setOffsetY(0)}}>RESET</button><button type="button" className="admin-primary" onClick={applyCrop}><Check size={14}/> APPLY</button></div>
      </div>
    </div>}
    {value.startsWith("data:") && <small>Image is stored locally. Use ADJUST IMAGE to manually control zoom and position before applying.</small>}
  </div>;
}

export default function Admin() {
  const [products, setProducts] = useState<Shoe[]>(loadProducts);
  const [categories, setCategories] = useState<string[]>(loadCategories);
  const [newCategory, setNewCategory] = useState("");
  const [categoryComposerOpen, setCategoryComposerOpen] = useState(false);

  const [featured, setFeatured] = useState<number[]>(loadFeatured);
  const [eternalFits, setEternalFits] = useState<EternalFit[]>(loadEternalFits);
  const [homepage, setHomepage] = useState<HomepageSettings>(loadHomepageSettings);
  const [editing, setEditing] = useState<Shoe | null>(null);
  const [editingFit, setEditingFit] = useState<EternalFit | null>(null);
  const [saved, setSaved] = useState(false);
  const [orders, setOrders] = useState<Order[]>(loadOrders);
  const [tab, setTab] = useState<"orders" | "products" | "homepage" | "eternal" | "settings">("orders");
  const [authenticated, setAuthenticated] = useState(() => Boolean(localStorage.getItem("noirknull:admin-token:v1")));
  const [adminPassword, setAdminPassword] = useState("");
  const [adminBusy, setAdminBusy] = useState(false);
  const [adminError, setAdminError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      const cloudState = await hydrateFromCloud();
      if (!mounted) return;
      if (cloudState === "synced") {
        setProducts(loadProducts());
        setCategories(loadCategories());
        setFeatured(loadFeatured());
        setEternalFits(loadEternalFits());
        setHomepage(loadHomepageSettings());
      } else if (cloudState === "empty") {
        publishCloudSection("products", products);
        publishCloudSection("categories", categories);
        publishCloudSection("featured", featured);
        publishCloudSection("eternalFits", eternalFits);
        publishCloudSection("homepage", homepage);
        publishCloudSection("categories", ["SHOES"]);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const featuredProducts = useMemo(() => featured.map(id => products.find(p => p.id === id)).filter(Boolean) as Shoe[], [featured, products]);

  const loginAdmin = async (event: FormEvent) => {
    event.preventDefault();
    setAdminBusy(true);
    setAdminError("");
    try {
      const response = await fetch("https://noirknull.lithiksaran130510.workers.dev/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ password: adminPassword }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.token) {
        throw new Error(payload?.error || "Unable to sign in.");
      }
      localStorage.setItem("noirknull:admin-token:v1", payload.token);
      setAuthenticated(true);
      setAdminPassword("");
    } catch (error) {
      setAdminError(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setAdminBusy(false);
    }
  };

  const logoutAdmin = () => {
    localStorage.removeItem("noirknull:admin-token:v1");
    setAuthenticated(false);
  };

  const flash = () => { setSaved(true); window.setTimeout(() => setSaved(false), 1400); };
  const persistProducts = (next: Shoe[]) => {
    const normalized = next.map(product => ({
      ...product,
      category: product.category?.trim() || "SHOES",
      isBestSeller: Boolean(product.isBestSeller),
      isNewDrop: Boolean(product.isNewDrop),
      productType: product.productType || "shoes",
      kind: productTypeLabel(product.productType || "shoes"),
      sizes: Array.isArray(product.sizes) ? product.sizes.map(String) : defaultSizesForProduct(product),
    }));
    setProducts(normalized);
    saveProducts(normalized);
    flash();
  };
  const persistFeatured = (next: number[]) => { setFeatured(next); saveFeatured(next); flash(); };
  const persistHomepage = (next: HomepageSettings) => { setHomepage(next); saveHomepageSettings(next); flash(); };
  const persistEternalFits = (next: EternalFit[]) => { setEternalFits(next); saveEternalFits(next); flash(); };

  const deleteCategory = (category: string) => {
    if (category.toLowerCase() === "shoes") {
      alert("SHOES is the default fallback category and cannot be deleted.");
      return;
    }
    if (!window.confirm(`Delete the category "${category}"? Products using it will be moved to SHOES.`)) return;
    const nextCategories = categories.filter(item => item.toLowerCase() !== category.toLowerCase());
    const nextProducts = products.map(product => product.category?.toLowerCase() === category.toLowerCase()
      ? { ...product, category: "SHOES" }
      : product
    );
    setCategories(nextCategories);
    saveCategories(nextCategories);
    setProducts(nextProducts);
    saveProducts(nextProducts);
    if (editing?.category?.toLowerCase() === category.toLowerCase()) {
      setEditing(current => current ? { ...current, category: "SHOES" } : current);
    }
    flash();
  };

  const addCategory = (useForCurrentProduct = false) => {
    const normalized = newCategory.trim().replace(/\s+/g, " ");
    if (!normalized) return;
    const exists = categories.some(category => category.toLowerCase() === normalized.toLowerCase());
    if (exists) {
      setNewCategory("");
      return;
    }
    const next = [...categories, normalized].sort((left, right) => left.localeCompare(right));
    setCategories(next);
    saveCategories(next);
    publishCloudSection("categories", next);
    if (useForCurrentProduct) setEditing(current => current ? { ...current, category: normalized, kind: current.kind?.trim() || normalized } : current);
    setNewCategory("");
    setCategoryComposerOpen(false);
    flash();
  };

  const saveProduct = () => {
    if (!editing?.name.trim() || !editing.image.trim() || editing.price <= 0) return;
    const normalized = {
      ...editing,
      name: editing.name.trim(),
      productType: editing.productType || "shoes",
      kind: productTypeLabel(editing.productType),
      category: editing.category?.trim() || "SHOES",
      image: editing.image.trim(),
      images: (editing.images?.length ? editing.images : [editing.image]).map((image) => image.trim()).filter(Boolean),
      tone: editing.tone.trim(),
      tag: editing.tag?.trim(),
      isBestSeller: Boolean(editing.isBestSeller),
      isNewDrop: Boolean(editing.isNewDrop),
      sizes: Array.isArray(editing.sizes) ? editing.sizes.map(String) : defaultSizesForProduct(editing),
    };
    const exists = products.some(p => p.id === editing.id);
    persistProducts(exists ? products.map(p => p.id === editing.id ? normalized : p) : [...products, normalized]);
    setEditing(null);
  };

  const deleteProduct = (id: number) => {
    persistProducts(products.filter(p => p.id !== id));
    persistFeatured(featured.filter(x => x !== id));
    if (editing?.id === id) setEditing(null);
  };

  const toggleFeatured = (id: number) => persistFeatured(featured.includes(id) ? featured.filter(x => x !== id) : [...featured, id]);

  const moveFeatured = (id: number, direction: -1 | 1) => {
    const index = featured.indexOf(id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= featured.length) return;
    const next = [...featured];
    [next[index], next[target]] = [next[target], next[index]];
    persistFeatured(next);
  };

  const saveEternalFit = () => {
    if (!editingFit?.image.trim() || !editingFit.title.trim()) return;
    const normalized = { ...editingFit, image: editingFit.image.trim(), title: editingFit.title.trim(), meta: editingFit.meta?.trim(), caption: editingFit.caption?.trim() };
    const exists = eternalFits.some(fit => fit.id === editingFit.id);
    persistEternalFits(exists ? eternalFits.map(fit => fit.id === editingFit.id ? normalized : fit) : [...eternalFits, normalized]);
    setEditingFit(null);
  };

  const deleteEternalFit = (id: number) => {
    persistEternalFits(eternalFits.filter(fit => fit.id !== id));
    if (editingFit?.id === id) setEditingFit(null);
  };

  const moveEternalFit = (id: number, direction: -1 | 1) => {
    const index = eternalFits.findIndex(fit => fit.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= eternalFits.length) return;
    const next = [...eternalFits];
    [next[index], next[target]] = [next[target], next[index]];
    persistEternalFits(next);
  };

  const resetAll = () => {
    persistProducts(DEFAULT_SHOES);
    setCategories(["SHOES"]);
    saveCategories(["SHOES"]);
    publishCloudSection("categories", ["SHOES"]);
    persistFeatured(DEFAULT_SHOES.map(p => p.id));
    persistEternalFits(DEFAULT_ETERNAL_FITS);
    persistHomepage(DEFAULT_HOMEPAGE);
    setEditing(null);
    setEditingFit(null);
  };

  if (!authenticated) {
    return <main className="admin-login-page">
      <section className="admin-login-card">
        <p className="kicker">NOIRKNULL / PRIVATE ACCESS</p>
        <h1>CONTROL ROOM</h1>
        <p>Enter the admin password to manage products, categories, homepage content and orders.</p>
        <form onSubmit={loginAdmin}>
          <label>
            <span>ADMIN PASSWORD</span>
            <input
              type="password"
              value={adminPassword}
              onChange={e => setAdminPassword(e.target.value)}
              autoComplete="current-password"
              autoFocus
              placeholder="Enter password"
            />
          </label>
          {adminError && <div className="admin-login-error">{adminError}</div>}
          <button className="admin-primary" type="submit" disabled={adminBusy || !adminPassword}>
            {adminBusy ? "CHECKING..." : "ENTER CONTROL ROOM"}
          </button>
        </form>
      </section>
    </main>;
  }

  return <div className="admin-page">
    <aside className="admin-sidebar">
      <div className="admin-brand"><div><strong>NOIRKNULL</strong><small>CONTROL ROOM</small></div></div>
      <nav>
        <button className={tab === "orders" ? "active" : ""} onClick={() => setTab("orders")}><Settings2 size={16}/> ORDERS</button>
        <button className={tab === "products" ? "active" : ""} onClick={() => setTab("products")}><Settings2 size={16}/> PRODUCTS</button>
        <button className={tab === "homepage" ? "active" : ""} onClick={() => setTab("homepage")}><Eye size={16}/> HOMEPAGE</button>
        <button className={tab === "eternal" ? "active" : ""} onClick={() => setTab("eternal")}><Eye size={16}/> ETERNAL FITS</button>
        <button className={tab === "settings" ? "active" : ""} onClick={() => setTab("settings")}><Settings2 size={16}/> SETTINGS</button>
      </nav>
      <a href="/" className="admin-back"><ArrowLeft size={15}/> VIEW STORE</a>
    </aside>

    <main className="admin-main">
      <header className="admin-topbar">
        <div><p className="kicker">NOIRKNULL® / ADMIN</p><h1>{tab === "orders" ? "Orders." : tab === "products" ? "Products." : tab === "homepage" ? "Homepage." : tab === "eternal" ? "Eternal Fits." : "Settings."}</h1></div>
        <div className="admin-top-actions"><div className="admin-status">{saved ? <><Check size={14}/> SAVED</> : "CONTROL ROOM"}</div><button className="admin-logout" onClick={logoutAdmin}>LOG OUT</button></div>
      </header>

      {tab === "orders" && <section className="admin-section">
        <div className="admin-section-head"><div><span>00 / ORDER CONTROL</span><h2>Every order, in one place.</h2><p>Review customer details, payment method, products and delivery status. Update the status and the customer tracking page follows it.</p></div><div className="admin-status">{orders.length} ORDERS</div></div>
        <div className="admin-orders-list">
          {orders.length === 0 ? <div className="admin-empty-state"><strong>No orders yet.</strong><span>Completed checkout orders will appear here.</span></div> : orders.map(order => <article className="admin-order-card" key={order.id}>
            <div className="admin-order-head"><div><span>{order.id}</span><h3>{order.customer.firstName} {order.customer.lastName}</h3><small>{new Date(order.createdAt).toLocaleString("en-IN")} · {order.payment.toUpperCase()}</small></div><strong>₹{order.total.toLocaleString("en-IN")}</strong></div>
            <div className="admin-order-grid"><div><small>CONTACT</small><p>{order.customer.email}<br/>{order.customer.phone}</p></div><div><small>DELIVERY</small><p>{order.customer.address}{order.customer.apartment ? ", "+order.customer.apartment : ""}<br/>{order.customer.city}, {order.customer.state} — {order.customer.pincode}</p></div><div><small>ITEMS</small>{order.items.map(item => <p key={item.productId+"-"+item.size}>{item.name} · SIZE {item.size} · ₹{item.price.toLocaleString("en-IN")}</p>)}</div></div>
            <div className="admin-order-process"><span>PROCESS</span><div>{["PLACED","CONFIRMED","PACKED","SHIPPED","OUT FOR DELIVERY","DELIVERED"].map(status => <button key={status} className={order.status===status ? "active" : ""} onClick={() => setOrders(loadOrders().map(x => x.id === order.id ? updateOrderStatus(order.id, status as OrderStatus)! : x))}>{status}</button>)}</div></div>
            <div className="admin-order-footer"><label><span>ORDER STATUS</span><select value={order.status} onChange={e => setOrders(loadOrders().map(x => x.id === order.id ? updateOrderStatus(order.id, e.target.value as OrderStatus)! : x))}>{["PLACED","CONFIRMED","PACKED","SHIPPED","OUT FOR DELIVERY","DELIVERED","CANCELLED"].map(status => <option key={status}>{status}</option>)}</select></label><div className="admin-order-tracking"><span>TRACKING {order.trackingNumber}</span><a href={"/track-order?tracking="+encodeURIComponent(order.trackingNumber)} target="_blank" rel="noreferrer">OPEN TRACKING ↗</a></div></div>
          </article>)}
        </div>
      </section>}

      {tab === "products" && <section className="admin-section">
        <div className="admin-section-head">
          <div><span>01 / CATALOGUE</span><h2>Full product control.</h2><p>Upload product photos, set prices, create categories automatically, choose homepage products and control every product detail.</p></div>
          <button className="admin-primary" onClick={() => setEditing(emptyProduct())}><Plus size={16}/> ADD PRODUCT</button>
        </div>
        <div className="admin-category-manager">
          <div className="admin-category-manager-head">
            <div><span>CATEGORIES</span><strong>{categories.length} ACTIVE</strong></div>
            <small>Categories created here instantly appear in every product editor. You can also create one directly beside the category selector.</small>
          </div>
          <div className="admin-category-chips">{categories.map(category => <span key={category} className="admin-category-chip"><span>{category}</span><button type="button" onClick={() => deleteCategory(category)} disabled={category.toLowerCase() === "shoes"} aria-label={`Delete ${category} category`} title={category.toLowerCase() === "shoes" ? "Default category cannot be deleted" : `Delete ${category}`}><Trash2 size={12}/></button></span>)}</div>
          <div className="admin-category-add">
            <input value={newCategory} onChange={e => setNewCategory(e.target.value)} onKeyDown={e => { if (e.key === "Enter") addCategory(); }} placeholder="New category name, e.g. Slides" aria-label="New category name"/>
            <button type="button" className="admin-primary" onClick={() => addCategory()}><Plus size={14}/> ADD CATEGORY</button>
          </div>
        </div>
        <div className="admin-product-grid">
          {products.map(product => <article className="admin-product-card" key={product.id}>
            <div className="admin-product-image"><img src={product.image} alt={product.kind}/><div className="admin-product-flags">{product.isBestSeller && <span>BEST SELLER</span>}{product.isNewDrop && <span>NEW DROP</span>}{featured.includes(product.id) && <span>HOME</span>}</div></div>
            <div className="admin-product-body"><div><small>{product.category || productTypeLabel(product.productType)}</small><h3>{product.name}</h3><p>{product.tone}</p></div><strong>{money(product.price)}</strong></div>
            <div className="admin-card-actions"><button onClick={() => setEditing(product)}><Pencil size={14}/> EDIT</button><button onClick={() => toggleFeatured(product.id)}>{featured.includes(product.id) ? <EyeOff size={14}/> : <Eye size={14}/>} {featured.includes(product.id) ? "HIDE HOME" : "SHOW HOME"}</button><button className="danger" onClick={() => deleteProduct(product.id)}><Trash2 size={14}/> DELETE</button></div>
          </article>)}
        </div>
      </section>}

      {tab === "homepage" && <section className="admin-section">
        <div className="admin-section-head"><div><span>02 / HOMEPAGE CONTROL</span><h2>Control the visual direction.</h2><p>Change the homepage photography, turn sections on/off and control the Eternal Fits wave treatment. Uploading a photo here changes the storefront immediately in this browser.</p></div></div>

        <div className="admin-home-grid">
          <div className="admin-control-card admin-home-hero-card">
            <div className="admin-control-card-head"><span>HERO / 01</span><strong>Main sneaker image</strong></div>
            <ImagePicker value={homepage.heroImage} aspectRatio={1} onChange={value => persistHomepage({...homepage, heroImage: value})} />
          </div>

          <div className="admin-control-card admin-home-hero-card">
            <div className="admin-control-card-head"><span>HERO / VIDEO</span><strong>Campaign video</strong></div>
            <VideoPicker value={homepage.heroVideo} onChange={value => persistHomepage({...homepage, heroVideo: value})} />
          </div>

          <div className="admin-control-card">
            <div className="admin-control-card-head"><span>WORLD / 02</span><strong>Manifesto photo</strong></div>
            <ImagePicker value={homepage.manifestoImage} aspectRatio={1} onChange={value => persistHomepage({...homepage, manifestoImage: value})} />
          </div>

          <div className="admin-control-card admin-home-wide">
            <div className="admin-control-card-head"><span>FIT PICKS / SHOP</span><strong>Three moodboard images</strong></div>
            <div className="admin-three-images">{homepage.fitPickImages.map((image, index) => <div key={index}><span>0{index + 1}</span><ImagePicker value={image} aspectRatio={1.25} onChange={value => { const next = [...homepage.fitPickImages] as [string,string,string]; next[index] = value; persistHomepage({...homepage, fitPickImages: next}); }} /></div>)}</div>
          </div>

          <div className="admin-control-card admin-home-wide">
            <div className="admin-control-card-head"><span>EDITORIAL / SHOP</span><strong>Editorial composition images</strong></div>
            <div className="admin-two-images">
              <div><span>MAIN</span><ImagePicker value={homepage.editorialMainImage} aspectRatio={1} onChange={value => persistHomepage({...homepage, editorialMainImage: value})} /></div>
              {homepage.editorialAccessoryImages.map((image, index) => <div key={index}><span>ACCESSORY 0{index + 1}</span><ImagePicker value={image} aspectRatio={1} onChange={value => { const next = [...homepage.editorialAccessoryImages] as [string,string]; next[index] = value; persistHomepage({...homepage, editorialAccessoryImages: next}); }} /></div>)}
            </div>
          </div>

          <div className="admin-control-card admin-home-wide">
            <div className="admin-control-card-head"><span>LAYOUT / VISIBILITY</span><strong>Switch homepage sections</strong></div>
            <div className="admin-toggle-grid">
              {([
                ["showBestSellers", "BEST SELLERS", "Auto-scrolling best seller rail"],
                ["showNewDrops", "NEW DROP", "Auto-scrolling latest drop rail"],
                ["showEternalFits", "ETERNAL FITS", "Infinite campaign gallery"],
                ["showManifesto", "OUR WORLD", "Brand manifesto"],
                ["showDetails", "DETAILS", "Feature detail rows"],
                ["showClosingBanner", "CLOSING BANNER", "Final CTA"],
                ["patternWaves", "PATTERN WAVES", "Eternal Fits background"],
              ] as const).map(([key, label, desc]) => <button key={key} className={homepage[key] ? "admin-toggle active" : "admin-toggle"} onClick={() => persistHomepage({...homepage, [key]: !homepage[key]})}><span>{homepage[key] ? <Eye size={15}/> : <EyeOff size={15}/>}</span><div><strong>{label}</strong><small>{desc}</small></div><b>{homepage[key] ? "ON" : "OFF"}</b></button>)}
            </div>
            <label className="admin-range"><span>PATTERN WAVE OPACITY <b>{Math.round(homepage.patternOpacity * 100)}%</b></span><input type="range" min="0" max="1" step="0.01" value={homepage.patternOpacity} onChange={e => persistHomepage({...homepage, patternOpacity: Number(e.target.value)})}/></label>
          </div>

          <div className="admin-home-actions admin-home-wide"><button onClick={() => persistHomepage(DEFAULT_HOMEPAGE)}><RotateCcw size={15}/> RESET HOMEPAGE DESIGN</button></div>
        </div>
      </section>}

      {tab === "eternal" && <section className="admin-section">
        <div className="admin-section-head"><div><span>03 / CAMPAIGN</span><h2>Build Eternal Fits.</h2><p>Add, upload, edit, reorder and delete every campaign image. The gallery loops automatically on the storefront.</p></div><button className="admin-primary" onClick={() => setEditingFit(emptyEternalFit())}><Plus size={16}/> ADD FIT</button></div>
        <div className="admin-eternal-list">
          {eternalFits.map((fit, index) => <div className="admin-eternal-row" key={fit.id}>
            <b>0{index + 1}</b><img src={fit.image} alt={fit.title}/><div className="admin-eternal-copy"><strong>{fit.title}</strong><span>{fit.meta}</span><small>{fit.caption}</small></div>
            <div className="admin-eternal-actions"><button disabled={index === 0} onClick={() => moveEternalFit(fit.id, -1)}>↑</button><button disabled={index === eternalFits.length - 1} onClick={() => moveEternalFit(fit.id, 1)}>↓</button><button onClick={() => setEditingFit(fit)}><Pencil size={14}/> EDIT</button><button className="danger" onClick={() => deleteEternalFit(fit.id)}><Trash2 size={14}/> DELETE</button></div>
          </div>)}
        </div>
      </section>}

      {tab === "settings" && <section className="admin-section">
        <div className="admin-section-head"><div><span>04 / STORE CONTROL</span><h2>Everything in one place.</h2><p>Use this control room to manage products, categories, homepage imagery, campaign photography and section visibility.</p></div></div>
        <div className="admin-warning"><strong>Cloud storage</strong><p>Catalogue, homepage, featured products and Eternal Fits are synchronized through the shared cloud store, so changes made here can appear on other devices. Browser storage is used only as a fast local cache. Admin authentication should still be added before public launch.</p></div>
        <div className="admin-settings-grid"><div><span>PRODUCTS</span><strong>{products.length}</strong></div><div><span>CATEGORIES</span><strong>{categories.length}</strong></div><div><span>HOMEPAGE PICKS</span><strong>{featured.length}</strong></div><div><span>ETERNAL FITS</span><strong>{eternalFits.length}</strong></div></div>
        <button className="admin-reset" onClick={resetAll}>RESET EVERYTHING TO ORIGINAL STORE</button>
      </section>}

      {editingFit && <div className="admin-modal-backdrop" onClick={() => setEditingFit(null)}><div className="admin-modal admin-modal-large" onClick={e => e.stopPropagation()}>
        <div className="admin-modal-head"><div><p className="kicker">{eternalFits.some(fit => fit.id === editingFit.id) ? "EDIT ETERNAL FIT" : "NEW ETERNAL FIT"}</p><h2>{editingFit.title || "Create campaign image"}</h2></div><button onClick={() => setEditingFit(null)}><X size={18}/></button></div>
        <ImagePicker value={editingFit.image} aspectRatio={0.82} onChange={value => setEditingFit({...editingFit,image:value})} label="UPLOAD CAMPAIGN PHOTO" />
        <div className="admin-form-grid">
          <label><span>FIT TITLE</span><input value={editingFit.title} onChange={e => setEditingFit({...editingFit,title:e.target.value})} placeholder="THE OFF-DUTY FIT"/></label>
          <label><span>META / LOCATION</span><input value={editingFit.meta || ""} onChange={e => setEditingFit({...editingFit,meta:e.target.value})} placeholder="01 / 05 · CHENNAI"/></label>
          <label className="wide"><span>CAPTION</span><input value={editingFit.caption || ""} onChange={e => setEditingFit({...editingFit,caption:e.target.value})} placeholder="Quiet layers. Strong silhouette."/></label>
        </div>
        <div className="admin-modal-actions"><button onClick={() => setEditingFit(null)}>CANCEL</button><button className="admin-primary" onClick={saveEternalFit}><Save size={15}/> SAVE FIT</button></div>
      </div></div>}

      {editing && <div className="admin-modal-backdrop" onClick={() => setEditing(null)}><div className="admin-modal admin-modal-large admin-product-modal" onClick={e => e.stopPropagation()}>
        <div className="admin-modal-head"><div><p className="kicker">{products.some(p => p.id === editing.id) ? "EDIT PRODUCT" : "NEW PRODUCT"}</p><h2>{editing.name || "Create product"}</h2></div><button onClick={() => setEditing(null)}><X size={18}/></button></div>
        <div className="admin-product-gallery-editor">
          <div className="admin-gallery-editor-head"><div><span>PRODUCT GALLERY</span><strong>{(editing.images?.length || 1)} IMAGE{(editing.images?.length || 1) === 1 ? "" : "S"}</strong></div><button type="button" onClick={() => setEditing({...editing, images: [...(editing.images?.length ? editing.images : [editing.image]), ""]})}><Plus size={14}/> ADD IMAGE</button></div>
          <div className="admin-product-gallery-grid">
            {(editing.images?.length ? editing.images : [editing.image]).map((image, index) => <div className="admin-product-gallery-item" key={index}>
              <div className="admin-gallery-item-head"><span>{index === 0 ? "MAIN IMAGE" : `IMAGE 0${index + 1}`}</span>{index > 0 && <button type="button" onClick={() => { const next = [...(editing.images || [editing.image])]; next.splice(index, 1); setEditing({...editing, images: next}); }}><Trash2 size={13}/></button>}</div>
              <ImagePicker value={image} aspectRatio={1} label={index === 0 ? "UPLOAD MAIN PHOTO" : `UPLOAD IMAGE 0${index + 1}`} onChange={value => { const next = [...(editing.images || [editing.image])]; next[index] = value; setEditing({...editing, image: next[0] || "", images: next}); }} />
            </div>)}
          </div>
          <small className="admin-gallery-help">Add multiple views of the same product. The first image is the main image; customers can swipe through the gallery on the product page.</small>
        </div>
        <div className="admin-form-grid">
          <label><span>PRODUCT NAME</span><input value={editing.name} onChange={e => setEditing({...editing,name:e.target.value})} placeholder="NOIR / 05"/></label>
          <label><span>CATEGORY</span><div className="admin-category-field"><select value={editing.category || "SHOES"} onChange={e => setEditing({...editing,category:e.target.value})}>{categories.map(category => <option key={category} value={category}>{category}</option>)}</select><button type="button" onClick={() => setCategoryComposerOpen(value => !value)}><Plus size={13}/> NEW CATEGORY</button></div>{categoryComposerOpen && <div className="admin-category-inline"><input autoFocus value={newCategory} onChange={e => setNewCategory(e.target.value)} onKeyDown={e => { if (e.key === "Enter") addCategory(true); }} placeholder="Category name"/><button type="button" className="admin-primary" onClick={() => addCategory(true)}>CREATE</button></div>}</label>
          <label><span>PRODUCT TYPE</span><select value={editing.productType || "shoes"} onChange={e => { const productType = e.target.value as ProductType; setEditing({...editing, productType, sizes: defaultSizesForProduct({...editing, productType})}); }}>{([["shoes","SHOES / SNEAKERS"],["apparel","T-SHIRT / SHIRT"],["watch","WATCH"],["accessory","ACCESSORY"],["other","OTHER"]] as [ProductType,string][]).map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label><span>PRICE (₹)</span><input type="number" min="1" value={editing.price || ""} onChange={e => setEditing({...editing,price:Number(e.target.value)})}/></label>
          <div className="admin-size-manager wide">
            <div className="admin-size-manager-head"><span>AVAILABLE SIZES</span><small>{editing.productType === "watch" || editing.productType === "accessory" ? "ONE SIZE ONLY" : editing.productType === "apparel" ? "SELECT THE CLOTHING SIZES YOU ACTUALLY HAVE IN STOCK" : editing.productType === "shoes" ? "SELECT THE SHOE SIZES YOU ACTUALLY HAVE IN STOCK" : "NO SIZE REQUIRED"}</small></div>
            <div className="admin-size-options">
              {(["shoes","apparel","watch","accessory","other"] as ProductType[]).includes(editing.productType || "shoes") && (editing.productType === "shoes" ? ["6","7","8","9","10","11","12"] : editing.productType === "apparel" ? ["XS","S","M","L","XL","XXL","XXXL"] : editing.productType === "watch" || editing.productType === "accessory" ? ["OS"] : []).map(size => <label key={size} className={editing.sizes?.includes(size) ? "admin-size-chip active" : "admin-size-chip"}><input type="checkbox" checked={Boolean(editing.sizes?.includes(size))} disabled={editing.productType === "watch" || editing.productType === "accessory"} onChange={e => setEditing({...editing, sizes: e.target.checked ? Array.from(new Set([...(editing.sizes || []), size])) : (editing.sizes || []).filter(value => value !== size)})}/><b>{size}</b></label>)}
            </div>
          </div>
          <label><span>COLOUR / TONE</span><input value={editing.tone} onChange={e => setEditing({...editing,tone:e.target.value})} placeholder="Black / Bone"/></label>
          <label><span>BADGE</span><input value={editing.tag || ""} onChange={e => setEditing({...editing,tag:e.target.value})} placeholder="NEW DROP"/></label>
          <div className="admin-merch-options wide">
            <span>STOREFRONT PLACEMENT</span>
            <div>
              <label className={editing.isBestSeller ? "admin-merch-option active" : "admin-merch-option"}><input type="checkbox" checked={Boolean(editing.isBestSeller)} onChange={e => setEditing({...editing,isBestSeller:e.target.checked})}/><b>BEST SELLER</b><small>Show in the Best Sellers rail.</small></label>
              <label className={editing.isNewDrop ? "admin-merch-option active" : "admin-merch-option"}><input type="checkbox" checked={Boolean(editing.isNewDrop)} onChange={e => setEditing({...editing,isNewDrop:e.target.checked})}/><b>NEW DROP</b><small>Show in the New Drop rail.</small></label>
            </div>
          </div>
          <label className="wide"><span>PRODUCT PAGE LIQUID GLASS TINT</span><div className="admin-color-field"><input type="color" value={editing.glassTint || "#d72d28"} onChange={e => setEditing({...editing,glassTint:e.target.value})}/><input value={editing.glassTint || ""} onChange={e => setEditing({...editing,glassTint:e.target.value})} placeholder="Auto from product colour"/></div></label>
        </div>
        <div className="admin-tint-note">Leave the tint blank to automatically derive a subtle glass colour from the product tone.</div>
        <div className="admin-preview">{editing.image ? <img src={editing.image} alt="Preview"/> : <span>IMAGE PREVIEW</span>}<div><strong>{editing.name || "Product name"}</strong><span>{editing.category || productTypeLabel(editing.productType)}{editing.isBestSeller ? " · BEST SELLER" : ""}{editing.isNewDrop ? " · NEW DROP" : ""}</span></div></div>
        <div className="admin-modal-actions"><button onClick={() => setEditing(null)}>CANCEL</button><button className="admin-primary" onClick={saveProduct}><Save size={15}/> SAVE PRODUCT</button></div>
      </div></div>}
    </main>
  </div>;
}
