export type Shoe = {
  id: number;
  name: string;
  kind: string;
  price: number;
  image: string;
  tone: string;
  tag?: string;
  glassTint?: string;
  glassTint?: string;
};

export const DEFAULT_SHOES: Shoe[] = [
  { id: 1, name: "NOIR / 01", kind: "Everyday Runner", price: 4290, image: "/assets/noir-01.webp", tone: "Crimson / Chalk", tag: "BESTSELLER" },
  { id: 2, name: "NULL / 02", kind: "Street Low", price: 3890, image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1100&q=90", tone: "Cloud / Ink", tag: "NEW DROP" },
  { id: 3, name: "FORM / 03", kind: "Retro Court", price: 4590, image: "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=1100&q=90", tone: "Stone / Bone" },
  { id: 4, name: "AFTER / 04", kind: "Daily Essential", price: 3490, image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1100&q=90", tone: "Mono / Grey" },
];

const PRODUCTS_KEY = "noirknull:products:v1";
const FEATURED_KEY = "noirknull:featured:v1";

export function loadProducts(): Shoe[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) return DEFAULT_SHOES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_SHOES;
  } catch { return DEFAULT_SHOES; }
}

export function saveProducts(products: Shoe[]) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  window.dispatchEvent(new Event("noirknull:products"));
}

export function loadFeatured(): number[] {
  try {
    const raw = localStorage.getItem(FEATURED_KEY);
    if (!raw) return DEFAULT_SHOES.map((p) => p.id);
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(Number) : DEFAULT_SHOES.map((p) => p.id);
  } catch { return DEFAULT_SHOES.map((p) => p.id); }
}

export function saveFeatured(ids: number[]) {
  localStorage.setItem(FEATURED_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event("noirknull:featured"));
}
