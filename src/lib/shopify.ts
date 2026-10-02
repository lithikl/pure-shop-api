import { toast } from "sonner";
import shoeBlack from "@/assets/shoe-black.png";
import chainSilver from "@/assets/chain-silver.png";
import ringSilver from "@/assets/ring-silver.png";

const SHOPIFY_API_VERSION = "2025-07";

// Shopify connection is optional.
// If the store is disconnected (or never connected), these env vars are absent.
// In that case we fall back to local demo data and we do NOT call Shopify.
const SHOPIFY_STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN as string | undefined;
const SHOPIFY_STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN as string | undefined;

const SHOPIFY_STOREFRONT_URL = SHOPIFY_STORE_DOMAIN
  ? `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`
  : null;

const SHOPIFY_CONNECTED = Boolean(SHOPIFY_STOREFRONT_URL && SHOPIFY_STOREFRONT_TOKEN);

// ============= DEMO DATA (no Shopify required) =============

type DemoProductNode = ShopifyProduct["node"];

function demoProductNode(partial: Partial<DemoProductNode> & Pick<DemoProductNode, "id" | "title" | "handle">): DemoProductNode {
  const currencyCode = "EUR";
  const baseAmount = partial.priceRange?.minVariantPrice.amount ?? "95";

  const sizeValues = ["S", "M", "L", "XL"];
  const colorValues = partial.options?.find((o) => o.name.toLowerCase() === "color")?.values ?? ["Black"];

  const variants = partial.variants?.edges?.length
    ? partial.variants
    : {
        edges: colorValues.flatMap((color) =>
          sizeValues.map((size) => ({
            node: {
              id: `demo-variant-${partial.id}-${color.toLowerCase()}-${size}`,
              title: `${color} / ${size}`,
              price: { amount: baseAmount, currencyCode },
              availableForSale: true,
              selectedOptions: [
                { name: "Color", value: color },
                { name: "Size", value: size },
              ],
            },
          }))),
      };

  const options = partial.options ?? [
    { name: "Color", values: colorValues },
    { name: "Size", values: sizeValues },
  ];

  return {
    id: partial.id,
    title: partial.title,
    description: partial.description ?? "A minimal essential built for everyday wear.",
    handle: partial.handle,
    tags: partial.tags ?? [],
    availableForSale: partial.availableForSale ?? true,
    priceRange: partial.priceRange ?? {
      minVariantPrice: { amount: baseAmount, currencyCode },
    },
    images: partial.images ?? { edges: [] },
    variants,
    options,
    collections: partial.collections,
    relatedProducts: partial.relatedProducts,
  };
}

const DEMO_PRODUCTS: ShopifyProduct[] = [
  {
    node: demoProductNode({
      id: "demo-court-sneaker",
      title: "Court Sneaker",
      handle: "court-sneaker",
      description: "Full-grain leather low-top. Minimal profile, all-day comfort.",
      tags: ["new"],
      images: {
        edges: [
          { node: { url: shoeBlack, altText: "Court Sneaker - black" } },
        ],
      },
      options: [
        { name: "Color", values: ["Black"] },
        { name: "Size", values: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"] },
      ],
      variants: {
        edges: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"].map((size) => ({
          node: {
            id: `demo-variant-court-sneaker-black-${size.replace(" ", "-").toLowerCase()}`,
            title: `Black / ${size}`,
            price: { amount: "4999", currencyCode: "INR" },
            availableForSale: true,
            selectedOptions: [
              { name: "Color", value: "Black" },
              { name: "Size", value: size },
            ],
          },
        })),
      },
      priceRange: { minVariantPrice: { amount: "4999", currencyCode: "INR" } },
      relatedProducts: {
        references: {
          edges: [
            {
              node: {
                id: "demo-cuban-chain",
                title: "Cuban Link Chain",
                handle: "cuban-link-chain",
                priceRange: { minVariantPrice: { amount: "2999", currencyCode: "INR" } },
                images: { edges: [{ node: { url: chainSilver, altText: "Cuban Link Chain - silver" } }] },
              },
            },
            {
              node: {
                id: "demo-signet-ring",
                title: "Signet Ring",
                handle: "signet-ring",
                priceRange: { minVariantPrice: { amount: "1499", currencyCode: "INR" } },
                images: { edges: [{ node: { url: ringSilver, altText: "Signet Ring - silver" } }] },
              },
            },
          ],
        },
      },
    }),
  },
  {
    node: demoProductNode({
      id: "demo-cuban-chain",
      title: "Cuban Link Chain",
      handle: "cuban-link-chain",
      description: "Sterling silver Cuban link chain. Weighty, polished, timeless.",
      tags: ["new"],
      images: {
        edges: [
          { node: { url: chainSilver, altText: "Cuban Link Chain - silver" } },
        ],
      },
      options: [
        { name: "Color", values: ["Silver"] },
        { name: "Size", values: ["18 in", "20 in", "22 in"] },
      ],
      variants: {
        edges: ["18 in", "20 in", "22 in"].map((size) => ({
          node: {
            id: `demo-variant-cuban-chain-silver-${size.replace(" ", "-")}`,
            title: `Silver / ${size}`,
            price: { amount: "2999", currencyCode: "INR" },
            availableForSale: true,
            selectedOptions: [
              { name: "Color", value: "Silver" },
              { name: "Size", value: size },
            ],
          },
        })),
      },
      priceRange: { minVariantPrice: { amount: "2999", currencyCode: "INR" } },
      relatedProducts: {
        references: {
          edges: [
            {
              node: {
                id: "demo-signet-ring",
                title: "Signet Ring",
                handle: "signet-ring",
                priceRange: { minVariantPrice: { amount: "1499", currencyCode: "INR" } },
                images: { edges: [{ node: { url: ringSilver, altText: "Signet Ring - silver" } }] },
              },
            },
            {
              node: {
                id: "demo-court-sneaker",
                title: "Court Sneaker",
                handle: "court-sneaker",
                priceRange: { minVariantPrice: { amount: "4999", currencyCode: "INR" } },
                images: { edges: [{ node: { url: shoeBlack, altText: "Court Sneaker - black" } }] },
              },
            },
          ],
        },
      },
    }),
  },
  {
    node: demoProductNode({
      id: "demo-signet-ring",
      title: "Signet Ring",
      handle: "signet-ring",
      description: "Polished sterling silver signet ring. Clean face, solid feel.",
      tags: ["new"],
      images: {
        edges: [
          { node: { url: ringSilver, altText: "Signet Ring - silver" } },
        ],
      },
      options: [
        { name: "Color", values: ["Silver"] },
        { name: "Size", values: ["8", "9", "10", "11"] },
      ],
      variants: {
        edges: ["8", "9", "10", "11"].map((size) => ({
          node: {
            id: `demo-variant-signet-ring-silver-${size}`,
            title: `Silver / ${size}`,
            price: { amount: "1499", currencyCode: "INR" },
            availableForSale: true,
            selectedOptions: [
              { name: "Color", value: "Silver" },
              { name: "Size", value: size },
            ],
          },
        })),
      },
      priceRange: { minVariantPrice: { amount: "1499", currencyCode: "INR" } },
      relatedProducts: {
        references: {
          edges: [
            {
              node: {
                id: "demo-cuban-chain",
                title: "Cuban Link Chain",
                handle: "cuban-link-chain",
                priceRange: { minVariantPrice: { amount: "2999", currencyCode: "INR" } },
                images: { edges: [{ node: { url: chainSilver, altText: "Cuban Link Chain - silver" } }] },
              },
            },
            {
              node: {
                id: "demo-court-sneaker",
                title: "Court Sneaker",
                handle: "court-sneaker",
                priceRange: { minVariantPrice: { amount: "4999", currencyCode: "INR" } },
                images: { edges: [{ node: { url: shoeBlack, altText: "Court Sneaker - black" } }] },
              },
            },
          ],
        },
      },
    }),
  },
];

// Mapping of collection handles to product handles
const DEMO_COLLECTION_PRODUCTS: Record<string, string[]> = {
  frontpage: ["court-sneaker", "cuban-link-chain", "signet-ring"],
  "new-arrivals": ["court-sneaker", "cuban-link-chain", "signet-ring"], // products with "new" tag
  footwear: ["court-sneaker"],
  jewelry: ["cuban-link-chain", "signet-ring"],
};

const DEMO_COLLECTIONS: ShopifyCollection[] = [
  {
    node: {
      id: "demo-collection-frontpage",
      title: "Featured",
      handle: "frontpage",
      description: "Demo collection (no Shopify connected).",
      image: {
        url: shoeBlack,
        altText: "Featured collection",
      },
    },
  },
  {
    node: {
      id: "demo-collection-new-arrivals",
      title: "New Arrivals",
      handle: "new-arrivals",
      description: "Fresh drops and latest additions.",
      image: {
        url: chainSilver,
        altText: "New Arrivals collection",
      },
    },
  },
  {
    node: {
      id: "demo-collection-footwear",
      title: "Footwear",
      handle: "footwear",
      description: "Sneakers built for every day.",
      image: {
        url: shoeBlack,
        altText: "Footwear collection",
      },
    },
  },
  {
    node: {
      id: "demo-collection-jewelry",
      title: "Jewelry",
      handle: "jewelry",
      description: "Chains and rings in sterling silver.",
      image: {
        url: ringSilver,
        altText: "Jewelry collection",
      },
    },
  },
];

export function demoModeEnabled() {
  return !SHOPIFY_CONNECTED;
}

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    tags: string[];
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string | null;
        };
      }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
          availableForSale: boolean;
          selectedOptions: Array<{
            name: string;
            value: string;
          }>;
        };
      }>;
    };
    options: Array<{
      name: string;
      values: string[];
    }>;
    availableForSale: boolean;
    collections?: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          handle: string;
        };
      }>;
    };
    relatedProducts?: {
      references?: {
        edges: Array<{
          node: {
            id: string;
            title: string;
            handle: string;
            priceRange: {
              minVariantPrice: {
                amount: string;
                currencyCode: string;
              };
            };
            images: {
              edges: Array<{
                node: {
                  url: string;
                  altText: string | null;
                };
              }>;
            };
          };
        }>;
      };
    };
  };
}

export interface ShopifyCollection {
  node: {
    id: string;
    title: string;
    handle: string;
    description: string;
    image?: {
      url: string;
      altText: string | null;
    };
  };
}

export async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}) {
  // When Shopify is disconnected, do not call Shopify at all.
  // Returning null triggers demo-mode fallbacks in our fetch helpers.
  if (!SHOPIFY_CONNECTED || !SHOPIFY_STOREFRONT_URL) {
    return null;
  }

  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 402) {
    // Only show this toast when Shopify is actually connected.
    toast.error("Shopify: Payment required", {
      description: "Your store needs to be upgraded to a paid plan.",
    });
    return null;
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.errors) {
    throw new Error(`Error calling Shopify: ${data.errors.map((e: { message: string }) => e.message).join(', ')}`);
  }

  return data;
}

// ============= LOCALIZATION QUERY =============

const LOCALIZATION_QUERY = `
  query GetLocalization {
    localization {
      availableCountries {
        isoCode
        name
        currency {
          isoCode
          name
          symbol
        }
      }
    }
  }
`;

export interface ShopifyCountry {
  isoCode: string;
  name: string;
  currency: {
    isoCode: string;
    name: string;
    symbol: string;
  };
}

export async function fetchAvailableCountries(): Promise<ShopifyCountry[]> {
  if (demoModeEnabled()) {
    return [];
  }
  const data = await storefrontApiRequest(LOCALIZATION_QUERY);
  if (!data) return [];
  return data.data.localization.availableCountries;
}

// ============= PRODUCT QUERIES WITH LOCALIZATION =============

const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $query: String, $country: CountryCode) @inContext(country: $country) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          description
          handle
          tags
          availableForSale
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          options {
            name
            values
          }
          collections(first: 10) {
            edges {
              node {
                id
                title
                handle
              }
            }
          }
        }
      }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!, $country: CountryCode) @inContext(country: $country) {
    productByHandle(handle: $handle) {
      id
      title
      description
      handle
      availableForSale
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
            selectedOptions {
              name
              value
            }
          }
        }
      }
      options {
        name
        values
      }
      relatedProducts: metafield(namespace: "custom", key: "related_products") {
        references(first: 10) {
          edges {
            node {
              ... on Product {
                id
                title
                handle
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
                images(first: 1) {
                  edges {
                    node {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const COLLECTIONS_QUERY = `
  query GetCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url
            altText
          }
        }
      }
    }
  }
`;

const COLLECTION_BY_HANDLE_QUERY = `
  query GetCollectionByHandle($handle: String!, $first: Int!, $country: CountryCode) @inContext(country: $country) {
    collectionByHandle(handle: $handle) {
      id
      title
      handle
      description
      products(first: $first) {
        edges {
          node {
            id
            title
            description
            handle
            tags
            availableForSale
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 5) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
            options {
              name
              values
            }
          }
        }
      }
    }
  }
`;

const SEARCH_PRODUCTS_QUERY = `
  query SearchProducts($query: String!, $first: Int!, $country: CountryCode) @inContext(country: $country) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          description
          handle
          tags
          availableForSale
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 2) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 5) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          options {
            name
            values
          }
        }
      }
    }
  }
`;

// Helper to get current country code for API requests
let currentCountryCode: string | null = null;

export function setCurrentCountry(countryCode: string | null) {
  currentCountryCode = countryCode;
}

export function getCurrentCountry(): string | null {
  return currentCountryCode;
}

export async function fetchProducts(first: number = 20, query?: string, country?: string): Promise<ShopifyProduct[]> {
  if (demoModeEnabled()) {
    const q = query?.toLowerCase().trim();
    const filtered = q
      ? DEMO_PRODUCTS.filter((p) =>
          [p.node.title, p.node.description, ...(p.node.tags ?? [])].some((v) => v.toLowerCase().includes(q)),
        )
      : DEMO_PRODUCTS;
    return filtered.slice(0, first);
  }
  const countryCode = country || currentCountryCode;
  const data = await storefrontApiRequest(PRODUCTS_QUERY, { first, query, country: countryCode });
  if (!data) return [];
  return data.data.products.edges;
}

export async function fetchProductByHandle(handle: string, country?: string): Promise<ShopifyProduct['node'] | null> {
  if (demoModeEnabled()) {
    return DEMO_PRODUCTS.find((p) => p.node.handle === handle)?.node ?? null;
  }
  const countryCode = country || currentCountryCode;
  const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle, country: countryCode });
  if (!data) return null;
  return data.data.productByHandle;
}

export async function fetchCollections(first: number = 10): Promise<ShopifyCollection[]> {
  if (demoModeEnabled()) {
    return DEMO_COLLECTIONS.slice(0, first);
  }
  const data = await storefrontApiRequest(COLLECTIONS_QUERY, { first });
  if (!data) return [];
  return data.data.collections.edges;
}

export async function fetchCollectionByHandle(handle: string, first: number = 50, country?: string): Promise<{ collection: ShopifyCollection['node']; products: ShopifyProduct[] } | null> {
  if (demoModeEnabled()) {
    const collection = DEMO_COLLECTIONS.find((c) => c.node.handle === handle)?.node;
    if (!collection) return null;
    
    // Filter products based on collection mapping
    const productHandles = DEMO_COLLECTION_PRODUCTS[handle] ?? [];
    const products = DEMO_PRODUCTS.filter((p) => productHandles.includes(p.node.handle)).slice(0, first);
    
    return {
      collection,
      products,
    };
  }
  const countryCode = country || currentCountryCode;
  const data = await storefrontApiRequest(COLLECTION_BY_HANDLE_QUERY, { handle, first, country: countryCode });
  if (!data || !data.data.collectionByHandle) return null;
  return {
    collection: data.data.collectionByHandle,
    products: data.data.collectionByHandle.products.edges
  };
}

export async function searchProducts(query: string, first: number = 20, country?: string): Promise<ShopifyProduct[]> {
  if (demoModeEnabled()) {
    const q = query.toLowerCase().trim();
    return DEMO_PRODUCTS.filter((p) =>
      [p.node.title, p.node.description, ...(p.node.tags ?? [])].some((v) => v.toLowerCase().includes(q)),
    ).slice(0, first);
  }
  const countryCode = country || currentCountryCode;
  const data = await storefrontApiRequest(SEARCH_PRODUCTS_QUERY, { query: `title:*${query}*`, first, country: countryCode });
  if (!data) return [];
  return data.data.products.edges;
}

export async function fetchProductsByTag(tag: string, first: number = 50, country?: string): Promise<ShopifyProduct[]> {
  if (demoModeEnabled()) {
    const t = tag.toLowerCase().trim();
    return DEMO_PRODUCTS.filter((p) => (p.node.tags ?? []).some((x) => x.toLowerCase() === t)).slice(0, first);
  }
  const countryCode = country || currentCountryCode;
  const data = await storefrontApiRequest(SEARCH_PRODUCTS_QUERY, { query: `tag:${tag}`, first, country: countryCode });
  if (!data) return [];
  return data.data.products.edges;
}

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!, $country: CountryCode) @inContext(country: $country) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function createCheckout(items: Array<{ variantId: string; quantity: number }>, country?: string): Promise<string | null> {
  // In demo mode (no Shopify connected), checkout isn't available.
  if (demoModeEnabled()) {
    return null;
  }
  const lines = items.map(item => ({
    quantity: item.quantity,
    merchandiseId: item.variantId,
  }));

  const countryCode = country || currentCountryCode;
  const data = await storefrontApiRequest(CART_CREATE_MUTATION, {
    input: { lines },
    country: countryCode,
  });

  if (!data) return null;

  if (data.data.cartCreate.userErrors.length > 0) {
    throw new Error(`Cart creation failed: ${data.data.cartCreate.userErrors.map((e: { message: string }) => e.message).join(', ')}`);
  }

  const cart = data.data.cartCreate.cart;
  
  if (!cart.checkoutUrl) {
    throw new Error('No checkout URL returned from Shopify');
  }

  const url = new URL(cart.checkoutUrl);
  url.searchParams.set('channel', 'online_store');
  return url.toString();
}

export function formatPrice(amount: string, currencyCode: string, locale?: string): string {
  return new Intl.NumberFormat(locale || 'en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(parseFloat(amount));
}

// ============= CUSTOMER AUTHENTICATION =============

const CUSTOMER_CREATE_MUTATION = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION = `
  mutation customerAccessTokenDelete($customerAccessToken: String!) {
    customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
      deletedAccessToken
      deletedCustomerAccessTokenId
      userErrors {
        field
        message
      }
    }
  }
`;

const CUSTOMER_QUERY = `
  query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      phone
      acceptsMarketing
      defaultAddress {
        id
        address1
        address2
        city
        province
        country
        zip
      }
      orders(first: 10, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            totalPrice {
              amount
              currencyCode
            }
            lineItems(first: 5) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    image {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const CUSTOMER_RECOVER_MUTATION = `
  mutation customerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export interface CustomerCreateInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  acceptsMarketing?: boolean;
}

export interface CustomerLoginInput {
  email: string;
  password: string;
}

export async function createCustomer(input: CustomerCreateInput): Promise<{ success: boolean; error?: string }> {
  if (demoModeEnabled()) {
    return { success: false, error: 'Shopify is not connected.' };
  }
  const data = await storefrontApiRequest(CUSTOMER_CREATE_MUTATION, { input });
  
  if (!data) return { success: false, error: 'Failed to connect to Shopify' };
  
  const errors = data.data.customerCreate.customerUserErrors;
  if (errors.length > 0) {
    return { success: false, error: errors.map((e: { message: string }) => e.message).join(', ') };
  }
  
  return { success: true };
}

export async function loginCustomer(input: CustomerLoginInput): Promise<{ 
  success: boolean; 
  accessToken?: string; 
  expiresAt?: string;
  error?: string 
}> {
  if (demoModeEnabled()) {
    return { success: false, error: 'Shopify is not connected.' };
  }
  const data = await storefrontApiRequest(CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION, { input });
  
  if (!data) return { success: false, error: 'Failed to connect to Shopify' };
  
  const errors = data.data.customerAccessTokenCreate.customerUserErrors;
  if (errors.length > 0) {
    return { success: false, error: errors.map((e: { message: string }) => e.message).join(', ') };
  }
  
  const token = data.data.customerAccessTokenCreate.customerAccessToken;
  return { 
    success: true, 
    accessToken: token.accessToken,
    expiresAt: token.expiresAt
  };
}

export async function logoutCustomer(accessToken: string): Promise<boolean> {
  if (demoModeEnabled()) {
    return false;
  }
  const data = await storefrontApiRequest(CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION, { 
    customerAccessToken: accessToken 
  });
  
  return !!data;
}

export async function getCustomer(accessToken: string): Promise<{
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  acceptsMarketing: boolean;
  defaultAddress: {
    id: string;
    address1: string | null;
    address2: string | null;
    city: string | null;
    province: string | null;
    country: string | null;
    zip: string | null;
  } | null;
  orders: {
    edges: Array<{
      node: {
        id: string;
        orderNumber: number;
        processedAt: string;
        financialStatus: string;
        fulfillmentStatus: string;
        totalPrice: {
          amount: string;
          currencyCode: string;
        };
        lineItems: {
          edges: Array<{
            node: {
              title: string;
              quantity: number;
              variant: {
                image: {
                  url: string;
                  altText: string | null;
                } | null;
              } | null;
            };
          }>;
        };
      };
    }>;
  };
} | null> {
  if (demoModeEnabled()) {
    return null;
  }
  const data = await storefrontApiRequest(CUSTOMER_QUERY, { customerAccessToken: accessToken });
  
  if (!data || !data.data.customer) return null;
  
  return data.data.customer;
}

export async function recoverCustomerPassword(email: string): Promise<{ success: boolean; error?: string }> {
  if (demoModeEnabled()) {
    return { success: false, error: 'Shopify is not connected.' };
  }
  const data = await storefrontApiRequest(CUSTOMER_RECOVER_MUTATION, { email });
  
  if (!data) return { success: false, error: 'Failed to connect to Shopify' };
  
  const errors = data.data.customerRecover.customerUserErrors;
  if (errors.length > 0) {
    return { success: false, error: errors.map((e: { message: string }) => e.message).join(', ') };
  }
  
  return { success: true };
}
