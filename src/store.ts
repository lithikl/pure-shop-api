export type ProductType = "shoes" | "apparel" | "watch" | "accessory" | "other";

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
  productType?: ProductType;
  sizes?: string[];
  isBestSeller?: boolean;
  isNewDrop?: boolean;
  description?: string;
};

export type EternalFit = {
  id: number;
  image: string;
  title: string;
  meta?: string;
  caption?: string;
};

export const DEFAULT_SHOES: Shoe[] = [
  { id: 1, name: "NOIR / 01", kind: "Everyday Runner", category: "Runners", price: 4290, image: "/assets/output-onlinepngtools.png", images: ["/assets/output-onlinepngtools.png"], tone: "Crimson / Chalk", tag: "BESTSELLER", productType: "shoes", sizes: ["6","7","8","9","10","11","12"], isBestSeller: true, description: "A considered everyday runner with a confident profile, designed for comfort and movement without unnecessary noise." },
  { id: 2, name: "NULL / 02", kind: "Street Low", category: "Street", price: 3890, image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1100&q=90", images: ["https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1100&q=90"], tone: "Cloud / Ink", tag: "NEW DROP", productType: "shoes", sizes: ["6","7","8","9","10","11","12"], isNewDrop: true, description: "A low-profile street silhouette with a clean shape and an easy everyday feel." },
  { id: 3, name: "FORM / 03", kind: "Retro Court", category: "Court", price: 4590, productType: "shoes", sizes: ["6","7","8","9","10","11","12"], image: "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=1100&q=90", images: ["https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=1100&q=90"], tone: "Stone / Bone" },
  { id: 4, name: "AFTER / 04", kind: "Daily Essential", category: "Essentials", price: 3490, productType: "shoes", sizes: ["6","7","8","9","10","11","12"], image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1100&q=90", images: ["https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1100&q=90"], tone: "Mono / Grey" },
];

const CLOUD_API_BASE = "https://noirknull.lithiksaran130510.workers.dev";

const cloudApi = (path: string) => `${CLOUD_API_BASE}${path}`;

const PRODUCTS_KEY = "noirknull:products:v1";
const FEATURED_KEY = "noirknull:featured:v1";
const ETERNAL_FITS_KEY = "noirknull:eternal-fits:v1";
const HOMEPAGE_KEY = "noirknull:homepage:v1";
const CATEGORIES_KEY = "noirknull:categories:v1";
let adminToken: string | null = null;

export function setAdminToken(token: string) {
  adminToken = token;
}

export function getAdminToken() {
  return adminToken;
}

export function clearAdminToken() {
  adminToken = null;
}

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

let cloudWriteQueue: Promise<void> = Promise.resolve();
let lastCloudHydration = 0;
const CLOUD_HYDRATE_MIN_INTERVAL = 30_000;

export async function getCloudStoreResult(): Promise<CloudStoreResult> {
  try {
    const response = await fetch(cloudApi(`/api/store?ts=${Date.now()}`), {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    let payload: any = null;
    try { payload = await response.json(); } catch { payload = null; }
    if (!response.ok || !payload?.ok) return { ok: false, exists: false, data: null };
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

export async function hydrateFromCloud(force = false): Promise<"synced" | "empty" | "unavailable" | "throttled"> {
  const now = Date.now();
  if (!force && now - lastCloudHydration < CLOUD_HYDRATE_MIN_INTERVAL) return "throttled";
  lastCloudHydration = now;
  const result = await getCloudStoreResult();
  if (!result.ok) return "unavailable";
  if (!result.exists || !result.data) return "empty";
  applyCloudStore(result.data);
  return "synced";
}

async function writeCloudSection(section: keyof CloudStore, value: unknown) {
  const token = getAdminToken();
  if (!token) {
    const error = new Error("Admin authentication required before saving to cloud.");
    window.dispatchEvent(new CustomEvent("noirknull:cloud-error", { detail: { status: 401, section } }));
    throw error;
  }

  const queuedWrite = cloudWriteQueue.then(async () => {
    let lastError: Error | null = null;
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        const response = await fetch(cloudApi("/api/store"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
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

    const status = /Cloud store save failed \((\d+)\)/.exec(lastError?.message || "")?.[1];
    window.dispatchEvent(new CustomEvent("noirknull:cloud-error", { detail: { status: Number(status || 0), section } }));
    throw lastError || new Error("Cloud store save failed");
  });

  cloudWriteQueue = queuedWrite.catch(() => undefined);
  return queuedWrite;
}

export function publishCloudSection(section: keyof CloudStore, value: unknown) {
  return writeCloudSection(section, value);
}

export type HomepageCategoryImages = {
  SHOES: string;
  WATCHES: string;
  ACCESSORIES: string;
  JACKETS: string;
};

export type HomepageSettings = {
  heroImage: string;
  categoryImages: HomepageCategoryImages;
  heroVideo: string;
  manifestoImage: string;
  fitPickImages: [string, string, string];
  editorialMainImage: string;
  editorialAccessoryImages: [string, string];
  showBestSellers: boolean;
  showNewDrops: boolean;
  showEternalFits: boolean;
  showManifesto: boolean;
  showDetails: boolean;
  showClosingBanner: boolean;
  patternWaves: boolean;
  patternOpacity: number;
};

export const DEFAULT_HOMEPAGE: HomepageSettings = {
  heroImage: "/assets/output-onlinepngtools.png",
  categoryImages: {
    SHOES: DEFAULT_SHOES[0].image,
    WATCHES: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=88",
    ACCESSORIES: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=88",
    JACKETS: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1000&q=88",
  },
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
  showNewDrops: true,
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
  return publishCloudSection("categories", normalized);
}

function inferProductType(product: Shoe): ProductType {
  const text = `${product.category || ""} ${product.kind || ""} ${product.name || ""}`.toLowerCase();
  if (text.includes("watch")) return "watch";
  if (text.includes("accessor") || text.includes("bag") || text.includes("wallet") || text.includes("cap") || text.includes("belt")) return "accessory";
  if (text.includes("shirt") || text.includes("tee") || text.includes("t-shirt") || text.includes("apparel") || text.includes("hoodie") || text.includes("jacket")) return "apparel";
  if (text.includes("shoe") || text.includes("runner") || text.includes("sneaker") || text.includes("court") || text.includes("street") || text.includes("essential")) return "shoes";
  return "other";
}

export function defaultSizesForProduct(product: Shoe): string[] {
  const type = product.productType || inferProductType(product);
  if (type === "watch" || type === "accessory") return ["OS"];
  if (type === "apparel") return ["XS", "S", "M", "L", "XL", "XXL"];
  if (type === "shoes") return ["6", "7", "8", "9", "10", "11", "12"];
  return [];
}

export function loadProducts(): Shoe[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) return DEFAULT_SHOES;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_SHOES;
    return parsed.map((product: Shoe) => ({
      ...product,
      productType: product.productType || inferProductType(product),
      sizes: Array.isArray(product.sizes) && product.sizes.length ? product.sizes.map(String) : defaultSizesForProduct(product),
      images: Array.isArray(product.images) && product.images.length ? product.images : [product.image],
    }));
  } catch { return DEFAULT_SHOES; }
}

export async function saveProducts(products: Shoe[]) {
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
  await publishCloudSection("products", products);
  await publishCloudSection("categories", mergedCategories);
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
  return publishCloudSection("featured", ids);
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
  return publishCloudSection("eternalFits", fits);
}


export function loadHomepageSettings(): HomepageSettings {
  try {
    const raw = localStorage.getItem(HOMEPAGE_KEY);
    if (!raw) return DEFAULT_HOMEPAGE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_HOMEPAGE,
      ...parsed,
      categoryImages: {
        ...DEFAULT_HOMEPAGE.categoryImages,
        ...(parsed.categoryImages && typeof parsed.categoryImages === "object" ? parsed.categoryImages : {}),
      },
      fitPickImages: Array.isArray(parsed.fitPickImages) ? parsed.fitPickImages.slice(0, 3) : DEFAULT_HOMEPAGE.fitPickImages,
      editorialAccessoryImages: Array.isArray(parsed.editorialAccessoryImages) ? parsed.editorialAccessoryImages.slice(0, 2) : DEFAULT_HOMEPAGE.editorialAccessoryImages,
    };
  } catch { return DEFAULT_HOMEPAGE; }
}

export function saveHomepageSettings(settings: HomepageSettings) {
  localStorage.setItem(HOMEPAGE_KEY, JSON.stringify(settings));
  window.dispatchEvent(new Event("noirknull:homepage"));
  return publishCloudSection("homepage", settings);
}
