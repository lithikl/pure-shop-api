# Remix of Streetwear Store

Build a headless Shopify clothing store with an ultra-minimal streetwear vibe (clean, quiet, lots of whitespace). This must be Shopify-backed using the Shopify Storefront API for products/collections/cart, and Shopify Checkout for checkout.

Homepage (no hero)
	•	No hero section at all.
	•	Above the fold should be products immediately.
	•	Layout: product grid (clean, square images).
	•	Desktop: 3–4 columns
	•	Tablet: 2–3 columns
	•	Mobile: 2 columns
	•	Each product card: image, product name, price (very minimal), optional “Sold out” state.
	•	Minimal hover: subtle image swap or opacity only.

Typography (small, regular)
	•	Typography must be small and regular, not bold.
	•	Base font size: 14px
	•	Headings should be understated (same weight, slightly larger if needed, but still minimal).
	•	No big statements, no oversized type.

Navbar (fixed + minimal)

Navbar layout:
	•	Left: Off-canvas menu button (hamburger)
	•	Center: Logo (centered perfectly)
	•	Right: Search button, User account button, Dynamic cart button (shows item count)

Behavior:
	•	Navbar fixed at top, white background or transparent-to-white on scroll (very subtle).
	•	Icon buttons: minimal line icons.

Off-canvas menu (required)
	•	Off-canvas panel slides from the left.
	•	Include a nice easing animation for enter/exit (smooth, fashion-like).
	•	Overlay: subtle dim background.
	•	Menu items:
	•	Shop (all products)
	•	Collections (list from Shopify)
	•	New Arrivals
	•	About
	•	Contact
	•	Close on: close button, overlay click, ESC key.
	•	Trap focus for accessibility.

Search (required)
	•	Clicking search opens:
	•	Either an off-canvas search panel (preferred) or a minimal modal
	•	Search should query Shopify products (Storefront API).
	•	Results displayed as a minimal grid/list.

Account
	•	Add a user/account entry point (even if Shopify customer auth is placeholder initially).
	•	If full Shopify customer auth is complex, create the UI + routes with a placeholder state.

Cart (dynamic)
	•	Cart button shows live item count.
	•	Cart opens as a right-side drawer or dedicated cart page (choose the most minimal).
	•	Quantity controls, remove item, subtotal.
	•	Checkout button must redirect to Shopify Checkout.

Product & Collection pages
	•	Collection page: grid + minimal filters (size, availability, price).
	•	Product page:
	•	Large images
	•	Variant selector for sizes (Shopify variants)
	•	Add to cart
	•	Minimal description layout

Visual style rules
	•	Ultra-minimal, sharp edges, no heavy shadows, no gradients.
	•	Max whitespace, clean grid, understated UI.
	•	Animations: subtle only (opacity/translate), high-quality easing.
	•	Mobile-first, fast, SEO-friendly.

Shopify integration requirements
	•	Use Shopify Storefront API:
	•	Products
	•	Collections
	•	Variants (sizes)
	•	Inventory availability
	•	Cart creation & updates
	•	Checkout via Shopify Checkout URL from the cart.

Deliverables
	•	A working web app with:
	•	Home grid (no hero)
	•	Off-canvas menu
	•	Search UI + Shopify search
	•	Product pages, collection pages
	•	Cart + Shopify checkout redirect
	•	Clean, readable component structure.

Use placeholder brand name/logo: VOID™ and placeholder product content if Shopify data isn’t connected yet, but keep the structure fully ready for Shopify.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://pure-shop-api.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/886317f4-4ff4-4019-b80c-c9321d366d94).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
