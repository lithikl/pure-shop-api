import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { fetchCollectionByHandle, type ShopifyProduct } from "@/lib/shopify";
import { useFormattedPrice } from "@/hooks/useFormattedPrice";

interface FeaturedCarouselProps {
  collectionHandle?: string;
}

export default function FeaturedCarousel({ collectionHandle = "frontpage" }: FeaturedCarouselProps) {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [appeared, setAppeared] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { formatPrice } = useFormattedPrice();

  const wheelTargetRef = useRef<HTMLDivElement>(null);

  // IMPORTANT:
  // Keep the slide element itself free of transform transitions.
  // Embla uses transforms on slides internally when loop=true; if the slide has
  // transform transitions, loop repositioning becomes visible (the "jump").
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    slidesToScroll: 1,
    skipSnaps: false,
    containScroll: false,
    duration: 28,
  });

  // If you have very few products and very wide slides, looping can look better
  // when there are more slides available to wrap.
  const slides = useMemo(() => {
    if (products.length === 0) return [] as ShopifyProduct[];
    const min = 7;
    const times = products.length >= min ? 1 : Math.ceil(min / products.length);
    return Array.from({ length: times }).flatMap(() => products);
  }, [products]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchCollectionByHandle(collectionHandle, 20);
        if (data) {
          setProducts(data.products);
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error("Failed to load featured products:", error);
        }
      } finally {
        setLoading(false);
        // Trigger appear animation after a brief delay
        setTimeout(() => setAppeared(true), 50);
      }
    }

    loadProducts();
  }, [collectionHandle]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();
  }, [emblaApi, slides.length]);
  // Smooth wheel navigation (trackpad + mouse wheel)
  useEffect(() => {
    const target = wheelTargetRef.current;
    if (!target || !emblaApi) return;

    let locked = false;

    const onWheel = (e: WheelEvent) => {
      // Allow normal page scroll if user isn't interacting with the carousel area
      e.preventDefault();

      if (locked) return;
      const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 6) return;

      locked = true;
      if (delta > 0) emblaApi.scrollNext();
      else emblaApi.scrollPrev();

      window.setTimeout(() => {
        locked = false;
      }, 260);
    };

    target.addEventListener("wheel", onWheel, { passive: false });
    return () => target.removeEventListener("wheel", onWheel);
  }, [emblaApi]);

  // Auto-focus carousel so arrow keys work immediately (without stealing focus from inputs)
  useEffect(() => {
    const el = wheelTargetRef.current;
    if (!el || !appeared) return;

    const active = document.activeElement;
    if (active === document.body) el.focus();
  }, [appeared]);

  if (loading || products.length === 0) return null;

  const activeProductId = slides[selectedIndex]?.node.id;

  return (
    <div 
      ref={wheelTargetRef}
      tabIndex={0}
      role="region"
      aria-label="Featured products carousel"
      onKeyDown={(e) => {
        if (!emblaApi) return;
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          emblaApi.scrollPrev();
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          emblaApi.scrollNext();
        } else if (e.key === "Enter") {
          e.preventDefault();
          const activeProduct = slides[selectedIndex];
          if (activeProduct) {
            navigate(`/product/${activeProduct.node.handle}`);
          }
        }
      }}
      className="absolute inset-0 flex items-center overflow-hidden border-none outline-none focus:outline-none focus:ring-0"
    >
      {/* Inner wrapper for appear animation - scale happens here, clipping happens on parent */}
      <div 
        className={`w-full transition-all duration-700 ease-out ${
          appeared ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="w-full" ref={emblaRef}>
          <div className="flex items-center cursor-grab active:cursor-grabbing">
          {slides.map((product, index) => {
            const imageUrl = product.node.images.edges[0]?.node.url;
            const price = formatPrice(product.node.priceRange.minVariantPrice.amount);

            const isActive = product.node.id === activeProductId;
            const isHovered = hoveredIndex === index;

            const handleClick = (e: React.MouseEvent) => {
              if (!isActive && emblaApi) {
                e.preventDefault();
                emblaApi.scrollTo(index);
              }
              // If active, let the Link navigate naturally
            };

            return (
              // NOTE: No transform transitions on this slide element.
              <div key={`${product.node.id}-${index}`} className="flex-none px-8 md:px-16 lg:px-24">
                {/* Scale/opacity live on an inner wrapper so Embla loop transforms stay invisible */}
                <div
                  className={`relative transition-[transform,opacity] duration-500 ease-out ${
                    isActive ? "opacity-100 scale-100" : "opacity-40 scale-[0.5]"
                  }`}
                >
                  <Link
                    to={`/product/${product.node.handle}`}
                    className={`block relative group ${isActive ? "cursor-pointer" : "cursor-default"}`}
                    onClick={handleClick}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div className="w-64 md:w-80 lg:w-96 aspect-[3/4] relative">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.node.title}
                          className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                          draggable={false}
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-muted-foreground/50 text-xs">No image</span>
                        </div>
                      )}
                    </div>

                    {/* Info (always show on active slide) */}
                    <div
                      className={`absolute -bottom-8 left-0 right-0 text-center transition-all duration-300 ${
                        isActive ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                      }`}
                    >
                      <p className="text-xs uppercase text-foreground">{product.node.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{price}</p>
                    </div>
                  </Link>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </div>
    </div>
  );
}
