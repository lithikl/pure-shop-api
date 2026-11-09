export type OrderStatus = "PLACED" | "CONFIRMED" | "PACKED" | "SHIPPED" | "OUT FOR DELIVERY" | "DELIVERED" | "CANCELLED";

export type Order = {
  id: string;
  trackingNumber: string;
  createdAt: string;
  status: OrderStatus;
  payment: "razorpay" | "cod";
  paymentId?: string;
  total: number;
  shipping: number;
  customer: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    address: string;
    apartment?: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: Array<{ productId: number; name: string; kind: string; image: string; price: number; size: string }>;
  timeline: Array<{ status: OrderStatus; at: string }>;
};

const KEY = "noirknull:orders:v1";

export function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const orders = JSON.parse(raw) as Order[];
    return orders.map(order => order.trackingNumber ? order : { ...order, trackingNumber: "NKT" + order.id.replace(/^NK/, "").slice(-8) });
  } catch { return []; }
}

export function saveOrders(orders: Order[]) {
  localStorage.setItem(KEY, JSON.stringify(orders));
  window.dispatchEvent(new Event("noirknull:orders"));
}

export function createOrder(input: Omit<Order, "id" | "trackingNumber" | "createdAt" | "timeline" | "status">): Order {
  const order: Order = {
    ...input,
    id: "NK" + Date.now().toString(36).toUpperCase(),
    trackingNumber: "NKT" + Math.random().toString(36).slice(2, 8).toUpperCase() + Date.now().toString().slice(-4),
    createdAt: new Date().toISOString(),
    status: "PLACED",
    timeline: [{ status: "PLACED", at: new Date().toISOString() }],
  };
  saveOrders([order, ...loadOrders()]);
  return order;
}

export function updateOrderStatus(id: string, status: OrderStatus) {
  const orders = loadOrders();
  const updated = orders.map(order => order.id === id
    ? { ...order, status, timeline: [...order.timeline, { status, at: new Date().toISOString() }] }
    : order);
  saveOrders(updated);
  return updated.find(order => order.id === id);
}
