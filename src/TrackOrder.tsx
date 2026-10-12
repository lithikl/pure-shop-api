import { useMemo, useState } from "react";
import { ArrowRight, Package, Search } from "lucide-react";
import { loadOrders, Order } from "./orders";

const steps = ["PLACED","CONFIRMED","PACKED","SHIPPED","OUT FOR DELIVERY","DELIVERED"] as const;

export default function TrackOrder() {
  const query = new URLSearchParams(window.location.search).get("order") || "";
  const [value, setValue] = useState(query);
  const [searched, setSearched] = useState(query);
  const order = useMemo(() => loadOrders().find(item => item.id.toLowerCase() === searched.trim().toLowerCase()), [searched]);
  const current = order ? steps.indexOf(order.status as typeof steps[number]) : -1;

  return <main className="track-page">
    <div className="track-shell">
      <a className="track-back" href="/">← BACK TO NOIRKNULL</a>
      <p className="kicker">NOIRKNULL® / ORDER TRACKING</p>
      <h1>Track your<br/><em>order.</em></h1>
      <p className="track-intro">Enter your NOIRKNULL order number to see its current delivery status.</p>
      <form className="track-search" onSubmit={e => { e.preventDefault(); setSearched(value); }}>
        <input value={value} onChange={e => setValue(e.target.value.toUpperCase())} placeholder="ORDER NUMBER — e.g. NKABC123" />
        <button type="submit"><Search size={16}/> TRACK <ArrowRight size={16}/></button>
      </form>
      {searched && !order && <div className="track-not-found"><Package size={20}/><div><strong>Order not found.</strong><span>Check the order number and try again.</span></div></div>}
      {order && <section className="track-card">
        <div className="track-card-head"><div><span>{order.id}</span><h2>{order.customer.firstName} {order.customer.lastName}</h2><small>Placed {new Date(order.createdAt).toLocaleString("en-IN")}</small></div><strong>₹{order.total.toLocaleString("en-IN")}</strong></div>
        {order.status === "CANCELLED" ? <div className="track-cancelled">This order has been cancelled.</div> : <div className="track-timeline">{steps.map((step,index) => <div className={index <= current ? "track-step active" : "track-step"} key={step}><i/><div><strong>{step}</strong><small>{order.timeline.find(item => item.status === step) ? new Date(order.timeline.find(item => item.status === step)!.at).toLocaleDateString("en-IN") : "Pending"}</small></div></div>)}</div>}
        <div className="track-items">{order.items.map(item => <div key={item.productId+"-"+item.size}><img src={item.image} alt={item.name}/><div><strong>{item.name}</strong><span>{item.kind} · SIZE {item.size}</span></div><b>₹{item.price.toLocaleString("en-IN")}</b></div>)}</div>
        <div className="track-address"><span>DELIVERING TO</span><p>{order.customer.address}{order.customer.apartment ? ", "+order.customer.apartment : ""}<br/>{order.customer.city}, {order.customer.state} — {order.customer.pincode}</p></div>
      </section>}
    </div>
  </main>;
}
