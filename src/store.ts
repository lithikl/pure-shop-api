export type Shoe = {
  id: number;
  name: string;
  kind: string;
  category?: string;
  price: number;
  image: string;
  images?: string[];
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
  { id: 1, name: "NOIR / 01", kind: "Everyday Runner", category: "Runners", price: 4290, image: "/assets/output-onlinepngtools.png", images: ["/assets/output-onlinepngtools.png"], tone: "Crimson / Chalk", tag: "BESTSELLER" },
  { id: 2, name: "NULL / 02", kind: "Street Low", category: "Street", price: 3890, image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1100&q=90", images: ["https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1100&q=90"], tone: "Cloud / Ink", tag: "NEW DROP" },
  { id: 3, name: "FORM / 03", kind: "Retro Court", category: "Court", price: 4590, image: "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=1100&q=90", images: ["https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=1100&q=90"], tone: "Stone / Bone" },
  { id: 4, name: "AFTER / 04", kind: "Daily Essential", category: "Essentials", price: 3490, image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1100&q=90", images: ["https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1100&q=90"], tone: "Mono / Grey" },
];

const CLOUD_API_BASE = "https://noirknull.lithiksaran130510.workers.dev";

const cloudApi = (path: string) => `${CLOUD_API_BASE}${path}`;

const PRODUCTS_KEY = "noirknull:products:v1";
const FEATURED_KEY = "noirknull:featured:v1";
const ETERNAL_FITS_KEY = "noirknull:eternal-fits:v1";
const HOMEPAGE_KEY = "noirknull:homepage:v1";
const CATEGORIES_KEY = "noirknull:categories:v1";

type CloudStore = {
  products?: Shoe[];
  featured?: number[];
  eternalFits?: EternalFit[];
  homepage?: HomepageSettings;
  categories?: string[];
};

export type CloudStoreResult = {
  ok: boolean;
  exists: boolean;
  data: CloudStore | null;
};

const cloudSyncTimers = new Map<string, number>();
let cloudWriteQueue: Promise<void> = Promise.resolve();

export async function getCloudStoreResult(): Promise<CloudStoreResult> {
  try {
    const response = await fetch(cloudApi(`/api/store?ts=${Date.now()}`), {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
    });
    let payload: any = null;
    try { payload = await response.json(); } catch { payload = null; }
    if (!response.ok || !payload?.ok) {
      return { ok: false, exists: false, data: null };
    }
    return {
      ok: true,
      exists: Boolean(payload.exists),
      data: payload.data && typeof payload.data === "object" ? payload.data as CloudStore : null,
    };
  } catch {
    return { ok: false, exists: false, data: null };
  }
}

export async function getCloudStore(): Promise<CloudStore | null> {
  const result = await getCloudStoreResult();
  return result.ok && result.exists ? result.data : null;
}

function applyCloudStore(data: CloudStore) {
  if (Array.isArray(data.products)) localStorage.setItem(PRODUCTS_KEY, JSON.stringify(data.products));
  if (Array.isArray(data.featured)) localStorage.setItem(FEATURED_KEY, JSON.stringify(data.featured));
  if (Array.isArray(data.eternalFits)) localStorage.setItem(ETERNAL_FITS_KEY, JSON.stringify(data.eternalFits));
  if (data.homepage && typeof data.homepage === "object") localStorage.setItem(HOMEPAGE_KEY, JSON.stringify(data.homepage));
  if (Array.isArray(data.categories)) localStorage.setItem(CATEGORIES_KEY, JSON.stringify(data.categories));
  window.dispatchEvent(new Event("noirknull:products"));
  window.dispatchEvent(new Event("noirknull:featured"));
  window.dispatchEvent(new Event("noirknull:eternal-fits"));
  window.dispatchEvent(new Event("noirknull:homepage"));
  window.dispatchEvent(new Event("noirknull:categories"));
}

export async function hydrateFromCloud(): Promise<"synced" | "empty" | "unavailable"> {
  const result = await getCloudStoreResult();
  if (!result.ok) return "unavailable";
  if (!result.exists || !result.data) return "empty";
  applyCloudStore(result.data);
  return "synced";
}

async function writeCloudSection(section: keyof CloudStore, value: unknown) {
  cloudWriteQueue = cloudWriteQueue.then(async () => {
    let lastError: Error | null = null;
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        const response = await fetch(cloudApi("/api/store"), {
          method: "POST",
          headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
          body: JSON.stringify({ section, value }),
        });
        if (response.ok) return;
        const detail = await response.text().catch(() => "");
        lastError = new Error(`Cloud store save failed (${response.status})${detail ? `: ${detail.slice(0, 180)}` : ""}`);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error("Cloud store save failed");
      }
      await new Promise(resolve => window.setTimeout(resolve, attempt * 300));
    }
    console.error(lastError || new Error("Cloud store save failed"));
  });
  return cloudWriteQueue;
}

export function publishCloudSection(section: keyof CloudStore, value: unknown) {
  const key = String(section);
  const previous = cloudSyncTimers.get(key);
  if (previous) window.clearTimeout(previous);

  const timer = window.setTimeout(() => {
    cloudSyncTimers.delete(key);
    void writeCloudSection(section, value);
  }, 120);

  cloudSyncTimers.set(key, timer);
}

export type HomepageSettings = {
  heroImage: string;
  heroVideo: string;
  manifestoImage: string;
  fitPickImages: [string, string, string];
  editorialMainImage: string;
  editorialAccessoryImages: [string, string];
  showBestSellers: boolean;
  showEternalFits: boolean;
  showManifesto: boolean;
  showDetails: boolean;
  showClosingBanner: boolean;
  patternWaves: boolean;
  patternOpacity: number;
};

export const DEFAULT_HOMEPAGE: HomepageSettings = {
  heroImage: "/assets/output-onlinepngtools.png",
  heroVideo: "/assets/WhatsApp Video 2026-10-12 at 12.43.48 PM.mp4",
  manifestoImage: "https://images.unsplash.com/photo-1520256862855-398228c41684?auto=format&fit=crop&w=1400&q=90",
  fitPickImages: [
    "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=650&q=85",
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=650&q=85",
  ],
  editorialMainImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=90",
  editorialAccessoryImages: [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=420&q=85",
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=420&q=85",
  ],
  showBestSellers: true,
  showEternalFits: true,
  showManifesto: true,
  showDetails: true,
  showClosingBanner: true,
  patternWaves: true,
  patternOpacity: 0.68,
};

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
    meta: "02 / 05 · NOIRKNULL STUDIO",
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

export function loadCategories(): string[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    const saved = raw ? JSON.parse(raw) : [];
    const productCategories = loadProducts().map((p) => p.category?.trim()).filter(Boolean) as string[];
    return Array.from(new Set([...(Array.isArray(saved) ? saved : []), ...productCategories])).sort();
  } catch { return Array.from(new Set(DEFAULT_SHOES.map((p) => p.category).filter(Boolean) as string[])).sort(); }
}

export function saveCategories(categories: string[]) {
  const normalized = Array.from(new Set(categories.map((c) => c.trim()).filter(Boolean))).sort();
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(normalized));
  window.dispatchEvent(new Event("noirknull:categories"));
  publishCloudSection("categories", normalized);
}

export function loadProducts(): Shoe[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) return DEFAULT_SHOES;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_SHOES;
    return parsed.map((product: Shoe) => ({ ...product, images: Array.isArray(product.images) && product.images.length ? product.images : [product.image] }));
  } catch { return DEFAULT_SHOES; }
}

export function saveProducts(products: Shoe[]) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  localStorage.setItem(PRODUCTS_KEY + ":updated", String(Date.now()));
  const categories = Array.from(new Set(products.map((p) => p.category?.trim()).filter(Boolean) as string[]));
  const existing = (() => { try { const raw = localStorage.getItem(CATEGORIES_KEY); const parsed = raw ? JSON.parse(raw) : []; return Array.isArray(parsed) ? parsed : []; } catch { return []; } })();
  const mergedCategories = Array.from(new Set([...existing, ...categories])).sort();
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(mergedCategories));
  window.dispatchEvent(new Event("noirknull:products"));
  try { window.dispatchEvent(new StorageEvent("storage", { key: PRODUCTS_KEY })); } catch {}
  try { new BroadcastChannel("noirknull-store").postMessage({ type: "products" }); } catch {}
  window.dispatchEvent(new Event("noirknull:categories"));
  publishCloudSection("products", products);
  publishCloudSection("categories", mergedCategories);
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
  publishCloudSection("featured", ids);
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
  publishCloudSection("eternalFits", fits);
}


export function loadHomepageSettings(): HomepageSettings {
  try {
    const raw = localStorage.getItem(HOMEPAGE_KEY);
    if (!raw) return DEFAULT_HOMEPAGE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_HOMEPAGE,
      ...parsed,
      fitPickImages: Array.isArray(parsed.fitPickImages) ? parsed.fitPickImages.slice(0, 3) : DEFAULT_HOMEPAGE.fitPickImages,
      editorialAccessoryImages: Array.isArray(parsed.editorialAccessoryImages) ? parsed.editorialAccessoryImages.slice(0, 2) : DEFAULT_HOMEPAGE.editorialAccessoryImages,
    };
  } catch { return DEFAULT_HOMEPAGE; }
}

export function saveHomepageSettings(settings: HomepageSettings) {
  localStorage.setItem(HOMEPAGE_KEY, JSON.stringify(settings));
  window.dispatchEvent(new Event("noirknull:homepage"));
  publishCloudSection("homepage", settings);
}
