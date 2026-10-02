import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import { useCartStore } from '@/stores/cartStore';
import { useFormattedPrice } from '@/hooks/useFormattedPrice';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();
  const { formatPrice } = useFormattedPrice();
  const total = getTotalPrice();

  return (
    <Layout>
      <Helmet><title>Cart — NOIRKNULL</title><meta name="description" content="Your NOIRKNULL shopping cart." /></Helmet>
      <main className="min-h-[calc(100vh-56px)] bg-[#f4f2ed] px-5 pb-20 pt-12 md:px-10 md:pt-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex items-end justify-between border-b border-foreground/10 pb-6"><div><p className="text-[9px] uppercase tracking-[.4em] text-foreground/45">NOIRKNULL / 01</p><h1 className="mt-3 text-5xl font-light tracking-[-.06em] md:text-7xl">YOUR CART</h1></div><span className="text-[10px] uppercase tracking-[.2em] text-foreground/45">{items.length} items</span></div>
          {items.length === 0 ? (
            <div className="flex min-h-[50vh] flex-col items-center justify-center text-center"><div className="text-[clamp(5rem,15vw,11rem)] font-black tracking-[-.1em] text-foreground/[.05]">EMPTY</div><p className="-mt-8 text-[10px] uppercase tracking-[.3em] text-foreground/45">Your selection is waiting</p><Link to="/products" className="mt-8 border border-foreground bg-foreground px-9 py-4 text-[10px] uppercase tracking-[.22em] text-background transition hover:bg-transparent hover:text-foreground">Continue Shopping →</Link></div>
          ) : (
            <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
              <section className="space-y-4">
                {items.map((item, i) => (
                  <article key={item.variantId} className="group flex gap-5 border border-foreground/[.08] bg-white/55 p-4 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,.07)]" style={{ animationDelay: `${i * 80}ms` }}>
                    <Link to={`/product/${item.product.node.handle}`} className="h-36 w-32 shrink-0 overflow-hidden bg-secondary md:h-48 md:w-40"><img src={item.product.node.images?.edges?.[0]?.node?.url} alt={item.product.node.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /></Link>
                    <div className="flex min-w-0 flex-1 flex-col justify-between py-1"><div><div className="flex justify-between gap-4"><Link to={`/product/${item.product.node.handle}`} className="text-sm uppercase tracking-[.08em]">{item.product.node.title}</Link><span className="text-sm">{formatPrice(item.price.amount)}</span></div>{item.variantTitle !== 'Default Title' && <p className="mt-2 text-[9px] uppercase tracking-[.18em] text-foreground/45">{item.variantTitle}</p>}</div><div className="flex items-end justify-between"><div className="flex items-center border border-foreground/15"><button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="h-9 w-9 transition hover:bg-foreground hover:text-background">−</button><span className="w-10 text-center text-[10px]">{item.quantity}</span><button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} className="h-9 w-9 transition hover:bg-foreground hover:text-background">+</button></div><button onClick={() => removeItem(item.variantId)} className="text-[9px] uppercase tracking-[.18em] text-foreground/45 hover:text-foreground">Remove</button></div></div>
                  </article>
                ))}
              </section>
              <aside className="h-fit border border-foreground/10 bg-white/45 p-7 backdrop-blur-sm lg:sticky lg:top-24"><p className="text-[9px] uppercase tracking-[.35em] text-foreground/45">Order Summary</p><div className="my-8 space-y-4 text-xs"><div className="flex justify-between"><span className="text-foreground/45">Subtotal</span><span>{formatPrice(total.toString())}</span></div><div className="flex justify-between"><span className="text-foreground/45">Shipping</span><span>Calculated at checkout</span></div></div><div className="border-t border-foreground/10 pt-5"><div className="flex justify-between text-sm uppercase"><span>Total</span><span>{formatPrice(total.toString())}</span></div></div><Link to="/checkout" className="mt-7 flex h-14 items-center justify-center bg-foreground text-[10px] uppercase tracking-[.24em] text-background transition-all hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(0,0,0,.14)]">Proceed to Checkout →</Link><Link to="/products" className="mt-4 block text-center text-[9px] uppercase tracking-[.2em] text-foreground/45 hover:text-foreground">Continue Shopping</Link></aside>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}
