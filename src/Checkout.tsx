import { useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";

type Shoe = { id: number; name: string; kind: string; price: number; image: string; tone: string; tag?: string };
type CartItem = { shoe: Shoe; size: number };
type Props = { cart: CartItem[]; onBack: () => void; onComplete: () => void };
const money = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export default function Checkout({ cart, onBack, onComplete }: Props) {
  const [step, setStep] = useState<"details" | "review" | "success">("details");
  const [shipping, setShipping] = useState<"standard" | "express">("standard");
  const [payment, setPayment] = useState<"cod" | "upi" | "card">("upi");
  const [data, setData] = useState({ email:"", phone:"", firstName:"", lastName:"", address:"", apartment:"", city:"Chennai", state:"Tamil Nadu", pincode:"" });
  const subtotal = cart.reduce((sum, item) => sum + item.shoe.price, 0);
  const shippingCost = cart.length === 0 ? 0 : shipping === "express" ? 199 : subtotal >= 5000 ? 0 : 99;
  const total = subtotal + shippingCost;
  const update = (key: keyof typeof data, value: string) => setData(old => ({ ...old, [key]: value }));
  const ready = Boolean(data.email.trim() && data.phone.trim() && data.firstName.trim() && data.lastName.trim() && data.address.trim() && data.city.trim() && data.state.trim() && data.pincode.length === 6);

  if (step === "success") return <main className="checkout-page"><section className="checkout-success">
    <div className="checkout-success-mark">✓</div><p className="kicker">NOIRKNULL / ORDER CONFIRMED</p><h1>You are<br/><em>all set.</em></h1>
    <p>Your order has been placed successfully. A confirmation will be sent to {data.email || "your email"}.</p>
    <div className="checkout-success-meta"><span>ORDER CONFIRMED</span><span>NOIRKNULL® — 2026</span></div>
    <button className="checkout-primary" onClick={onComplete}>RETURN HOME <ArrowUpRight size={16}/></button>
  </section></main>;

  return <main className="checkout-page"><div className="checkout-shell"><div className="checkout-main">
    <div className="checkout-header"><button className="checkout-back" onClick={onBack}>← BACK TO BAG</button><div><p className="kicker">NOIRKNULL® / CHECKOUT</p><h1>Complete<br/><em>your order.</em></h1></div><div className="checkout-progress"><span className="active">01 DETAILS</span><i/><span className={step === "review" ? "active" : ""}>02 REVIEW</span><i/><span>03 CONFIRMED</span></div></div>
    {step === "details" ? <div className="checkout-form">
      <section className="checkout-section"><div className="checkout-section-head"><span>01</span><div><p>CONTACT</p><small>Where should we send your order updates?</small></div></div><div className="checkout-grid one"><label><span>EMAIL ADDRESS *</span><input type="email" value={data.email} onChange={e=>update("email",e.target.value)} placeholder="you@example.com" autoComplete="email"/></label><label><span>PHONE NUMBER *</span><input type="tel" value={data.phone} onChange={e=>update("phone",e.target.value)} placeholder="+91 98765 43210" autoComplete="tel"/></label></div></section>
      <section className="checkout-section"><div className="checkout-section-head"><span>02</span><div><p>DELIVERY ADDRESS</p><small>We currently ship across India.</small></div></div><div className="checkout-grid two"><label><span>FIRST NAME *</span><input value={data.firstName} onChange={e=>update("firstName",e.target.value)}/></label><label><span>LAST NAME *</span><input value={data.lastName} onChange={e=>update("lastName",e.target.value)}/></label><label className="wide"><span>ADDRESS *</span><input value={data.address} onChange={e=>update("address",e.target.value)} placeholder="House / flat number, street"/></label><label className="wide"><span>APARTMENT / LANDMARK</span><input value={data.apartment} onChange={e=>update("apartment",e.target.value)} placeholder="Optional"/></label><label><span>CITY *</span><input value={data.city} onChange={e=>update("city",e.target.value)}/></label><label><span>STATE *</span><input value={data.state} onChange={e=>update("state",e.target.value)}/></label><label><span>PINCODE *</span><input inputMode="numeric" maxLength={6} value={data.pincode} onChange={e=>update("pincode",e.target.value.replace(/[^0-9]/g,"").slice(0,6))}/></label></div></section>
      <section className="checkout-section"><div className="checkout-section-head"><span>03</span><div><p>SHIPPING METHOD</p><small>Choose how quickly you want your order.</small></div></div><div className="checkout-options"><button type="button" className={shipping==="standard"?"checkout-option selected":"checkout-option"} onClick={()=>setShipping("standard")}><span><b>STANDARD DELIVERY</b><small>3–7 business days</small></span><strong>{subtotal>=5000?"FREE":money(99)}</strong></button><button type="button" className={shipping==="express"?"checkout-option selected":"checkout-option"} onClick={()=>setShipping("express")}><span><b>EXPRESS DELIVERY</b><small>1–3 business days</small></span><strong>{money(199)}</strong></button></div></section>
      <section className="checkout-section"><div className="checkout-section-head"><span>04</span><div><p>PAYMENT</p><small>Select your preferred payment method.</small></div></div><div className="checkout-options"><button type="button" className={payment==="upi"?"checkout-option selected":"checkout-option"} onClick={()=>setPayment("upi")}><span><b>UPI</b><small>Google Pay, PhonePe, Paytm & more</small></span><strong>↗</strong></button><button type="button" className={payment==="card"?"checkout-option selected":"checkout-option"} onClick={()=>setPayment("card")}><span><b>CARD</b><small>Credit or debit card</small></span><strong>↗</strong></button><button type="button" className={payment==="cod"?"checkout-option selected":"checkout-option"} onClick={()=>setPayment("cod")}><span><b>CASH ON DELIVERY</b><small>Pay when your order arrives</small></span><strong>↗</strong></button></div><p className="checkout-payment-note">Payment details are collected securely at the payment step. No card information is stored on this page.</p></section>
      <button className="checkout-primary checkout-continue" disabled={!ready} onClick={()=>ready && setStep("review")}>REVIEW ORDER <ArrowRight size={17}/></button>{!ready && <p className="checkout-validation">Complete the required contact and delivery fields to continue.</p>}
    </div> : <div className="checkout-review">
      <div className="review-card"><div className="review-card-head"><div><p className="kicker">DELIVERING TO</p><h2>{data.firstName} {data.lastName}</h2></div><button onClick={()=>setStep("details")}>EDIT</button></div><p>{data.address}{data.apartment ? ", " + data.apartment : ""}<br/>{data.city}, {data.state} — {data.pincode}</p><span>{data.email} · {data.phone}</span></div>
      <div className="review-card"><div className="review-card-head"><div><p className="kicker">DELIVERY</p><h2>{shipping==="standard"?"Standard":"Express"} delivery</h2></div><button onClick={()=>setStep("details")}>EDIT</button></div><p>{shipping==="standard"?"3–7 business days":"1–3 business days"}</p></div>
      <div className="review-card"><div className="review-card-head"><div><p className="kicker">PAYMENT</p><h2>{payment==="upi"?"UPI":payment==="card"?"Card":"Cash on delivery"}</h2></div><button onClick={()=>setStep("details")}>EDIT</button></div><p>{payment==="cod"?"Pay when your order arrives.":"You will complete payment securely after confirming this order."}</p></div>
      <button className="checkout-primary" onClick={async()=>{ 
        if (payment === "cod") { setStep("success"); return; }
        try {
          const orderResponse = await fetch("/api/create-order", {
            method: "POST", headers: {"Content-Type":"application/json"},
            body: JSON.stringify({ amount: total, currency: "INR", receipt: `noir-${Date.now()}`, customer: { name: `${data.firstName} ${data.lastName}`, email: data.email, phone: data.phone } })
          });
          const order = await orderResponse.json();
          if (!orderResponse.ok) throw new Error(order.error || "Unable to create payment order.");
          const loadRazorpay = () => new Promise<boolean>((resolve) => {
            if ((window as any).Razorpay) return resolve(true);
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true); script.onerror = () => resolve(false);
            document.body.appendChild(script);
          });
          if (!(await loadRazorpay())) throw new Error("Razorpay Checkout could not be loaded.");
          const Razorpay = (window as any).Razorpay;
          const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
          if (!key) throw new Error("Razorpay key is not configured.");
          const razorpay = new Razorpay({
            key, amount: order.amount, currency: order.currency, order_id: order.id,
            name: "NOIRKNULL", description: "NOIRKNULL footwear order",
            prefill: { name: `${data.firstName} ${data.lastName}`, email: data.email, contact: data.phone },
            theme: { color: "#111111" },
            handler: async (response: any) => {
              try {
                const verifyResponse = await fetch("/api/verify-payment", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(response) });
                const verified = await verifyResponse.json();
                if (!verifyResponse.ok || !verified.verified) throw new Error(verified.error || "Payment verification failed.");
                setStep("success");
              } catch (error) { alert(error instanceof Error ? error.message : "Payment verification failed."); }
            }
          });
          razorpay.open();
        } catch (error) { alert(error instanceof Error ? error.message : "Unable to start payment."); }
      }}>PAY SECURELY — {money(total)} <ArrowRight size={17}/></button><p className="checkout-terms">By placing your order, you confirm that your delivery details are correct and agree to the store purchase terms.</p>
    </div>}
  </div><aside className="checkout-summary"><div className="checkout-summary-sticky"><div className="summary-title"><p className="kicker">YOUR ORDER</p><h2>Order summary <span>{cart.length}</span></h2></div><div className="summary-items">{cart.map((item,i)=><div className="summary-item" key={item.shoe.id+"-"+item.size+"-"+i}><div className="summary-image"><img src={item.shoe.image} alt={item.shoe.kind}/><span>{item.size}</span></div><div><p>{item.shoe.kind}</p><h3>{item.shoe.name}</h3><small>SIZE {item.size}</small></div><strong>{money(item.shoe.price)}</strong></div>)}</div><div className="summary-totals"><div><span>SUBTOTAL</span><b>{money(subtotal)}</b></div><div><span>SHIPPING</span><b>{shippingCost===0?"FREE":money(shippingCost)}</b></div><div className="summary-total"><span>TOTAL</span><strong>{money(total)}</strong></div></div><p className="summary-note">Prices include applicable taxes. Free standard shipping on orders over ₹5,000.</p></div></aside></div></main>;
}
