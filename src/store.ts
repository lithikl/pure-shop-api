export type Shoe = {
  id: number;
  name: string;
  kind: string;
  price: number;
  image: string;
  tone: string;
  tag?: string;
  glassTint?: string;
};

export type EternalFit = {
  id: number;
  image: string;
  title: string;
  meta?: string;
  caption?: string;
};

export const DEFAULT_SHOES: Shoe[] = [
  { id: 1, name: "NOIR / 01", kind: "Everyday Runner", price: 4290, image: "/assets/output-onlinepngtools.png", tone: "Crimson / Chalk", tag: "BESTSELLER" },
  { id: 2, name: "NULL / 02", kind: "Street Low", price: 3890, image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1100&q=90", tone: "Cloud / Ink", tag: "NEW DROP" },
  { id: 3, name: "FORM / 03", kind: "Retro Court", price: 4590, image: "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=1100&q=90", tone: "Stone / Bone" },
  { id: 4, name: "AFTER / 04", kind: "Daily Essential", price: 3490, image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1100&q=90", tone: "Mono / Grey" },
];

const PRODUCTS_KEY = "noirknull:products:v1";
const FEATURED_KEY = "noirknull:featured:v1";
const ETERNAL_FITS_KEY = "noirknull:eternal-fits:v1";

export const DEFAULT_ETERNAL_FITS: EternalFit[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1500&q=88",
    title: "THE OFF-DUTY FIT",
    meta: "01 / 05 · CHENNAI",
    caption: "Quiet layers. Strong silhouette.",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1500&q=88",
    title: "THE EVERYDAY FORM",
    meta: "02 / 05 · N/K STUDIO",
    caption: "Built around movement.",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1500&q=88",
    title: "THE CITY FIT",
    meta: "03 / 05 · AFTER HOURS",
    caption: "Nothing extra. Nothing missing.",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1500&q=88",
    title: "THE LONG WAY HOME",
    meta: "04 / 05 · IN MOTION",
    caption: "Your route. Your pace.",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1500&q=88",
    title: "THE LAST LOOK",
    meta: "05 / 05 · NOIRKNULL",
    caption: "Wear it your way.",
  },
];

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


export function loadEternalFits(): EternalFit[] {
  try {
    const raw = localStorage.getItem(ETERNAL_FITS_KEY);
    if (!raw) return DEFAULT_ETERNAL_FITS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_ETERNAL_FITS;
  } catch { return DEFAULT_ETERNAL_FITS; }
}

export function saveEternalFits(fits: EternalFit[]) {
  localStorage.setItem(ETERNAL_FITS_KEY, JSON.stringify(fits));
  window.dispatchEvent(new Event("noirknull:eternal-fits"));
}
