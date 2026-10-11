import { useMemo, useState } from "react";
import { ArrowLeft, Check, Eye, EyeOff, Pencil, Plus, Save, Settings2, Trash2, X } from "lucide-react";
import { DEFAULT_SHOES, Shoe, loadFeatured, loadProducts, saveFeatured, saveProducts } from "./store";

const emptyProduct = (): Shoe => ({
  id: Date.now(),
  name: "",
  kind: "Everyday Runner",
  price: 0,
  image: "",
  tone: "",
  tag: ""
});

const money = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export default function Admin() {
  const [products, setProducts] = useState<Shoe[]>(loadProducts);
  const [featured, setFeatured] = useState<number[]>(loadFeatured);
  const [editing, setEditing] = useState<Shoe | null>(null);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<"products" | "homepage" | "settings">("products");

  const featuredProducts = useMemo(() => featured.map(id => products.find(p => p.id === id)).filter(Boolean) as Shoe[], [featured, products]);

  const persistProducts = (next: Shoe[]) => {
    setProducts(next);
    saveProducts(next);
    flash();
  };
  const persistFeatured = (next: number[]) => {
    setFeatured(next);
    saveFeatured(next);
    flash();
  };
  const flash = () => { setSaved(true); window.setTimeout(() => setSaved(false), 1400); };

  const saveProduct = () => {
    if (!editing?.name.trim() || !editing.kind.trim() || !editing.image.trim() || editing.price <= 0) return;
    const exists = products.some(p => p.id === editing.id);
    const next = exists ? products.map(p => p.id === editing.id ? { ...editing, name: editing.name.trim(), image: editing.image.trim(), tone: editing.tone.trim() } : p) : [...products, editing];
    persistProducts(next);
    setEditing(null);
  };

  const deleteProduct = (id: number) => {
    const next = products.filter(p => p.id !== id);
    persistProducts(next);
    persistFeatured(featured.filter(x => x !== id));
    if (editing?.id === id) setEditing(null);
  };

  const toggleFeatured = (id: number) => {
    persistFeatured(featured.includes(id) ? featured.filter(x => x !== id) : [...featured, id]);
  };

  const moveFeatured = (id: number, direction: -1 | 1) => {
    const index = featured.indexOf(id);
    if (index < 0) return;
    const target = index + direction;
    if (target < 0 || target >= featured.length) return;
    const next = [...featured];
    [next[index], next[target]] = [next[target], next[index]];
    persistFeatured(next);
  };

  const reset = () => {
    persistProducts(DEFAULT_SHOES);
    persistFeatured(DEFAULT_SHOES.map(p => p.id));
    setEditing(null);
  };

  return <div className="admin-page">
    <aside className="admin-sidebar">
      <div className="admin-brand"><span>N/K</span><div><strong>NOIRKNULL</strong><small>CONTROL ROOM</small></div></div>
      <nav>
        <button className={tab === "products" ? "active" : ""} onClick={() => setTab("products")}><Settings2 size={16}/> PRODUCTS</button>
        <button className={tab === "homepage" ? "active" : ""} onClick={() => setTab("homepage")}><Eye size={16}/> HOMEPAGE</button>
        <button className={tab === "settings" ? "active" : ""} onClick={() => setTab("settings")}><Settings2 size={16}/> SETTINGS</button>
      </nav>
      <a href="/" className="admin-back"><ArrowLeft size={15}/> VIEW STORE</a>
    </aside>

    <main className="admin-main">
      <header className="admin-topbar">
        <div><p className="kicker">NOIRKNULL® / ADMIN</p><h1>{tab === "products" ? "Products." : tab === "homepage" ? "Homepage." : "Settings."}</h1></div>
        <div className="admin-status">{saved ? <><Check size={14}/> SAVED</> : "LOCAL CONTROL"}</div>
      </header>

      {tab === "products" && <section className="admin-section">
        <div className="admin-section-head"><div><span>01 / CATALOGUE</span><h2>Manage every product.</h2><p>Add, edit, delete and control the product details shown across the store.</p></div><button className="admin-primary" onClick={() => setEditing(emptyProduct())}><Plus size={16}/> ADD PRODUCT</button></div>
        <div className="admin-product-grid">
          {products.map(product => <article className="admin-product-card" key={product.id}>
            <div className="admin-product-image"><img src={product.image} alt={product.kind}/>{featured.includes(product.id) && <span>ON HOMEPAGE</span>}</div>
            <div className="admin-product-body"><div><small>{product.kind}</small><h3>{product.name}</h3><p>{product.tone}</p></div><strong>{money(product.price)}</strong></div>
            <div className="admin-card-actions"><button onClick={() => setEditing(product)}><Pencil size={14}/> EDIT</button><button onClick={() => toggleFeatured(product.id)}>{featured.includes(product.id) ? <EyeOff size={14}/> : <Eye size={14}/>} {featured.includes(product.id) ? "HIDE HOME" : "SHOW HOME"}</button><button className="danger" onClick={() => deleteProduct(product.id)}><Trash2 size={14}/> DELETE</button></div>
          </article>)}
        </div>
      </section>}

      {tab === "homepage" && <section className="admin-section">
        <div className="admin-section-head"><div><span>02 / HOMEPAGE CONTROL</span><h2>Choose what appears first.</h2><p>Toggle products into the homepage collection and arrange their order. Changes are saved immediately in this browser.</p></div></div>
        <div className="featured-manager">
          <div className="featured-list">{featuredProducts.length ? featuredProducts.map((product, index) => <div className="featured-row" key={product.id}><b>0{index + 1}</b><img src={product.image} alt=""/><div><strong>{product.name}</strong><span>{product.kind} · {money(product.price)}</span></div><button disabled={index === 0} onClick={() => moveFeatured(product.id, -1)}>↑</button><button disabled={index === featuredProducts.length - 1} onClick={() => moveFeatured(product.id, 1)}>↓</button><button className="danger-icon" onClick={() => toggleFeatured(product.id)}><EyeOff size={15}/></button></div>) : <div className="admin-empty">No products selected for the homepage.</div>}</div>
          <div className="homepage-available"><h3>Available products</h3>{products.filter(p => !featured.includes(p.id)).map(product => <button key={product.id} onClick={() => toggleFeatured(product.id)}><Plus size={15}/><img src={product.image} alt=""/><span>{product.name}<small>{product.kind}</small></span></button>)}</div>
        </div>
      </section>}

      {tab === "settings" && <section className="admin-section">
        <div className="admin-section-head"><div><span>03 / STORE SETTINGS</span><h2>Control the storefront.</h2><p>Product and homepage controls are active. The controls below are intentionally lightweight until a real database/auth layer is connected.</p></div></div>
        <div className="admin-warning"><strong>Important</strong><p>This admin currently stores catalogue and homepage choices in <code>localStorage</code>. That means it is perfect for controlling the site in the same browser, but it is <b>not a secure multi-device production admin</b>. For real customer-facing management, the next step is a database + authenticated admin API.</p></div>
        <button className="admin-reset" onClick={reset}>RESET CATALOGUE TO ORIGINAL PRODUCTS</button>
      </section>}

      {editing && <div className="admin-modal-backdrop" onClick={() => setEditing(null)}><div className="admin-modal" onClick={e => e.stopPropagation()}>
        <div className="admin-modal-head"><div><p className="kicker">{products.some(p => p.id === editing.id) ? "EDIT PRODUCT" : "NEW PRODUCT"}</p><h2>{editing.name || "Create product"}</h2></div><button onClick={() => setEditing(null)}><X size={18}/></button></div>
        <div className="admin-form-grid">
          <label><span>PRODUCT NAME</span><input value={editing.name} onChange={e => setEditing({...editing,name:e.target.value})} placeholder="NOIR / 05"/></label>
          <label><span>CATEGORY / TYPE</span><select value={editing.kind} onChange={e => setEditing({...editing,kind:e.target.value})}><option>Everyday Runner</option><option>Street Low</option><option>Retro Court</option><option>Daily Essential</option><option>High Top</option><option>Slip-On</option></select></label>
          <label><span>PRICE (₹)</span><input type="number" min="1" value={editing.price || ""} onChange={e => setEditing({...editing,price:Number(e.target.value)})}/></label>
          <label><span>COLOUR / TONE</span><input value={editing.tone} onChange={e => setEditing({...editing,tone:e.target.value})} placeholder="Black / Bone"/></label>
          <label className="wide"><span>IMAGE URL</span><input value={editing.image} onChange={e => setEditing({...editing,image:e.target.value})} placeholder="https://..."/></label>
          <label><span>BADGE</span><input value={editing.tag || ""} onChange={e => setEditing({...editing,tag:e.target.value})} placeholder="NEW DROP"/></label>
        </div>
        <div className="admin-preview">{editing.image ? <img src={editing.image} alt="Preview"/> : <span>IMAGE PREVIEW</span>}<div><strong>{editing.name || "Product name"}</strong><span>{editing.kind} · {editing.tone || "Tone"}</span></div></div>
        <div className="admin-modal-actions"><button onClick={() => setEditing(null)}>CANCEL</button><button className="admin-primary" onClick={saveProduct}><Save size={15}/> SAVE PRODUCT</button></div>
      </div></div>}
    </main>
  </div>;
}
