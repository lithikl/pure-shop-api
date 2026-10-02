import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { BarChart3, Box, ChevronRight, LayoutDashboard, Package, Plus, Settings, ShoppingBag, Users } from 'lucide-react';

const products = [
  { name: 'Court Sneaker', sku: 'NK-001', price: '₹4,999', stock: 24, status: 'Active' },
  { name: 'Cuban Link Chain', sku: 'NK-002', price: '₹2,999', stock: 18, status: 'Active' },
  { name: 'Signet Ring', sku: 'NK-003', price: '₹1,499', stock: 31, status: 'Active' },
];

const orders = [
  { id: '#NK-1048', customer: 'Recent order', status: 'Processing', total: '₹7,998' },
  { id: '#NK-1047', customer: 'Recent order', status: 'Shipped', total: '₹4,999' },
  { id: '#NK-1046', customer: 'Recent order', status: 'Delivered', total: '₹1,499' },
];

export default function AdminPage() {
  const [section, setSection] = useState('Overview');
  const [showProductForm, setShowProductForm] = useState(false);
  const nav = [
    ['Overview', LayoutDashboard], ['Orders', ShoppingBag], ['Products', Package], ['Customers', Users], ['Analytics', BarChart3], ['Settings', Settings],
  ] as const;

  return (
    <div className="min-h-screen bg-[#10100f] text-[#f5f3ee]">
      <Helmet><title>Admin — NOIRKNULL</title></Helmet>
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-[#141413] p-5 md:flex md:flex-col">
          <Link to="/" className="mb-12 px-3 text-lg font-semibold tracking-[-.04em]">NOIRKNULL<span className="text-white/30"> / ADMIN</span></Link>
          <nav className="space-y-1">{nav.map(([label, Icon]) => <button key={label} onClick={() => setSection(label)} className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[10px] uppercase tracking-[.16em] transition ${section === label ? 'bg-white text-black' : 'text-white/45 hover:bg-white/5 hover:text-white'}`}><Icon className="h-4 w-4" />{label}<ChevronRight className={`ml-auto h-3 w-3 transition ${section === label ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} /></button>)}</nav>
          <div className="mt-auto rounded-2xl border border-white/10 bg-white/[.03] p-4"><p className="text-[9px] uppercase tracking-[.2em] text-white/35">Store status</p><div className="mt-3 flex items-center gap-2 text-[10px] uppercase"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> Online</div></div>
        </aside>

        <main className="flex-1 overflow-hidden">
          <header className="flex h-20 items-center justify-between border-b border-white/10 px-5 md:px-10"><div><p className="text-[9px] uppercase tracking-[.35em] text-white/35">Control Center</p><h1 className="mt-1 text-xl font-light tracking-[-.03em]">{section}</h1></div><div className="flex items-center gap-3"><Link to="/" className="hidden text-[9px] uppercase tracking-[.18em] text-white/45 hover:text-white md:block">View Store ↗</Link><button onClick={() => setShowProductForm(true)} className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[9px] uppercase tracking-[.18em] text-black transition hover:-translate-y-0.5"><Plus className="h-3.5 w-3.5" /> Add Product</button></div></header>

          <div className="p-5 md:p-10">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[['Revenue','₹14,496','+18.4%'],['Orders','3','+12.0%'],['Products','3','Live'],['Customers','3','+8.2%']].map(([label,value,change]) => <div key={label} className="group rounded-2xl border border-white/10 bg-white/[.035] p-6 transition hover:-translate-y-1 hover:bg-white/[.055]"><p className="text-[9px] uppercase tracking-[.25em] text-white/35">{label}</p><p className="mt-5 text-3xl font-light tracking-[-.05em]">{value}</p><p className="mt-2 text-[9px] uppercase tracking-[.15em] text-white/40">{change}</p></div>)}
            </div>

            <div className="mt-8 grid gap-8 xl:grid-cols-[1.3fr_.7fr]">
              <section className="rounded-2xl border border-white/10 bg-white/[.025] p-5 md:p-7"><div className="mb-6 flex items-center justify-between"><div><p className="text-[9px] uppercase tracking-[.3em] text-white/35">Catalog</p><h2 className="mt-1 text-lg font-light">Products</h2></div><button onClick={() => setSection('Products')} className="text-[9px] uppercase tracking-[.18em] text-white/45 hover:text-white">Manage all →</button></div><div className="overflow-x-auto"><table className="w-full min-w-[560px] text-left"><thead><tr className="border-b border-white/10 text-[8px] uppercase tracking-[.2em] text-white/30"><th className="pb-3">Product</th><th className="pb-3">SKU</th><th className="pb-3">Price</th><th className="pb-3">Stock</th><th className="pb-3">Status</th></tr></thead><tbody>{products.map(p => <tr key={p.sku} className="border-b border-white/5 text-[10px] transition hover:bg-white/[.025]"><td className="py-4">{p.name}</td><td className="py-4 text-white/35">{p.sku}</td><td className="py-4">{p.price}</td><td className="py-4">{p.stock}</td><td className="py-4"><span className="rounded-full border border-emerald-400/20 px-2 py-1 text-[8px] uppercase text-emerald-300">{p.status}</span></td></tr>)}</tbody></table></div></section>

              <section className="rounded-2xl border border-white/10 bg-white/[.025] p-5 md:p-7"><p className="text-[9px] uppercase tracking-[.3em] text-white/35">Performance</p><h2 className="mt-1 text-lg font-light">Store activity</h2><div className="mt-8 flex h-48 items-end gap-2">{[34,48,40,66,52,76,62,90,72,84,58,96].map((height,i)=><div key={i} className="group relative flex-1"><div style={{height:`${height}%`}} className="w-full rounded-t bg-white/15 transition-all duration-500 group-hover:bg-white/70" /></div>)}</div><div className="mt-4 flex justify-between text-[8px] uppercase tracking-[.16em] text-white/25"><span>12 weeks ago</span><span>Now</span></div></section>
            </div>

            <section className="mt-8 rounded-2xl border border-white/10 bg-white/[.025] p-5 md:p-7"><div className="mb-6 flex items-center justify-between"><div><p className="text-[9px] uppercase tracking-[.3em] text-white/35">Fulfillment</p><h2 className="mt-1 text-lg font-light">Recent Orders</h2></div><button onClick={() => setSection('Orders')} className="text-[9px] uppercase tracking-[.18em] text-white/45 hover:text-white">View orders →</button></div><div className="grid gap-3 md:grid-cols-3">{orders.map(order => <div key={order.id} className="rounded-xl border border-white/10 p-4 transition hover:-translate-y-1 hover:bg-white/[.03]"><div className="flex justify-between"><span className="text-[10px]">{order.id}</span><span className="text-[8px] uppercase text-white/35">{order.status}</span></div><p className="mt-6 text-[9px] uppercase tracking-[.15em] text-white/35">{order.customer}</p><p className="mt-1 text-sm">{order.total}</p></div>)}</div></section>
          </div>
        </main>
      </div>

      {showProductForm && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-md" onClick={() => setShowProductForm(false)}><div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#171716] p-7 shadow-2xl" onClick={e => e.stopPropagation()}><div className="flex items-center justify-between"><div><p className="text-[9px] uppercase tracking-[.3em] text-white/35">Catalog</p><h2 className="mt-1 text-2xl font-light">Add Product</h2></div><button onClick={() => setShowProductForm(false)} className="text-xl text-white/45 hover:text-white">×</button></div><div className="mt-8 space-y-4"><input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/25" placeholder="Product name" /><div className="grid grid-cols-2 gap-4"><input className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/25" placeholder="Price" /><input className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/25" placeholder="Stock" /></div><input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/25" placeholder="Image URL" /><button onClick={() => setShowProductForm(false)} className="mt-3 h-12 w-full rounded-xl bg-white text-[10px] uppercase tracking-[.2em] text-black transition hover:-translate-y-0.5">Save Product</button><p className="text-center text-[8px] uppercase tracking-[.15em] text-white/25">Product persistence will be connected to your store database next.</p></div></div></div>}
    </div>
  );
}
