import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useCartStore } from '@/stores/cartStore';
import { useFormattedPrice } from '@/hooks/useFormattedPrice';

export default function CheckoutPage() {
  const { items, getTotalPrice, checkout, isLoading } = useCartStore();
  const { formatPrice } = useFormattedPrice();
  const total = getTotalPrice();

  if (!items.length) {
    return <main className="min-h-screen bg-[#f4f2ed] flex items-center justify-center px-6 text-center"><div><p className="text-[9px] uppercase tracking-[.4em] text-foreground/45">NOIRKNULL / CHECKOUT</p><h1 className="mt-4 text-5xl font-light tracking-[-.06em]">NOTHING TO CHECK OUT</h1><Link to="/products" className="mt-8 inline-flex bg-foreground px-8 py-4 text-[10px] uppercase tracking-[.22em] text-background">Return to Shop →</Link></div></main>;
  }

  return (
    <main className="min-h-screen bg-[#f4f2ed] px-5 pb-20 pt-12 md:px-10 md:pt-16">
      <Helmet><title>Checkout — NOIRKNULL</title></Helmet>
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 flex items-end justify-between border-b border-foreground/10 pb-6"><div><p className="text-[9px] uppercase tracking-[.4em] text-foreground/45">NOIRKNULL / SECURE CHECKOUT</p><h1 className="mt-3 text-5xl font-light tracking-[-.06em] md:text-7xl">CHECKOUT</h1></div><Link to="/cart" className="text-[9px] uppercase tracking-[.2em] text-foreground/45 hover:text-foreground">← Edit Cart</Link></header>
        <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
          <section className="space-y-5">
            {['Contact information','Delivery address','Shipping method','Payment'].map((step, i) => <div key={step} className="group border border-foreground/10 bg-white/45 p-6 transition hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(0,0,0,.05)]"><div className="flex items-center gap-4"><span className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/15 text-[9px]">0{i+1}</span><h2 className="text-sm uppercase tracking-[.08em]">{step}</h2><span className="ml-auto text-foreground/30 transition group-hover:translate-x-1">→</span></div>{i === 0 && <p className="mt-4 text-[10px] leading-5 text-foreground/45">Your details are securely collected by the payment provider when you continue.</p>}</div>)}
          </section>
          <aside className="h-fit border border-foreground/10 bg-white/55 p-7 lg:sticky lg:top-8"><p className="text-[9px] uppercase tracking-[.35em] text-foreground/45">Order Review</p><div className="my-7 space-y-4">{items.map(item => <div key={item.variantId} className="flex gap-3"><img src={item.product.node.images?.edges?.[0]?.node?.url} alt="" className="h-16 w-14 object-cover bg-secondary"/><div className="min-w-0 flex-1"><p className="truncate text-[10px] uppercase">{item.product.node.title}</p><p className="mt-1 text-[9px] text-foreground/45">Qty {item.quantity}</p></div><span className="text-[10px]">{formatPrice((Number(item.price.amount) * item.quantity).toString())}</span></div>)}</div><div className="border-t border-foreground/10 pt-5"><div className="flex justify-between text-sm uppercase"><span>Total</span><span>{formatPrice(total.toString())}</span></div></div><button onClick={checkout} disabled={isLoading} className="mt-7 flex h-14 w-full items-center justify-center bg-foreground text-[10px] uppercase tracking-[.24em] text-background transition hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(0,0,0,.15)] disabled:opacity-50">{isLoading ? 'Preparing secure checkout…' : 'Continue to Secure Payment →'}</button><p className="mt-4 text-center text-[8px] uppercase tracking-[.18em] text-foreground/35">Secure payment · Taxes & shipping calculated at checkout</p></aside>
        </div>
      </div>
    </main>
  );
}
