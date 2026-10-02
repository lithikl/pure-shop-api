import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Helmet } from 'react-helmet-async';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { fetchProductByHandle, ShopifyProduct } from '@/lib/shopify';
import { useCartStore } from '@/stores/cartStore';
import ImageLightbox from '@/components/ImageLightbox';
import { useFormattedPrice } from '@/hooks/useFormattedPrice';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ProductPage() {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct['node'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [adding, setAdding] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  
  const addItem = useCartStore(state => state.addItem);
  const setCartOpen = useCartStore(state => state.setOpen);
  const navigate = useNavigate();
  const { formatPrice } = useFormattedPrice();
  const isMobile = useIsMobile();

  useEffect(() => {
    async function loadProduct() {
      if (!handle) return;
      try {
        const data = await fetchProductByHandle(handle);
        setProduct(data);
        if (data?.variants.edges[0]) {
          setSelectedVariant(data.variants.edges[0].node.id);
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Failed to load product:', error);
        }
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [handle]);

  const handleAddToCart = async () => {
    if (!product || !selectedVariant) return;
    
    const variant = product.variants.edges.find(v => v.node.id === selectedVariant);
    if (!variant) return;

    setAdding(true);
    
    addItem({
      product: { node: product },
      variantId: variant.node.id,
      variantTitle: variant.node.title,
      price: variant.node.price,
      quantity: 1,
      selectedOptions: variant.node.selectedOptions
    });

    toast.success('Added to cart', {
      position: 'top-center'
    });
    
    setTimeout(() => {
      setAdding(false);
      setCartOpen(true);
    }, 300);
  };

  const currentVariant = product?.variants.edges.find(v => v.node.id === selectedVariant)?.node;
  const isAvailable = currentVariant?.availableForSale ?? false;

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="page-padding py-20 text-center">
          <p className="text-sm text-muted-foreground mb-4">Product not found</p>
          <Link to="/" className="text-sm underline underline-offset-4">
            Back to shop
          </Link>
        </div>
      </Layout>
    );
  }

  const allImages = product.images.edges;

  // Get unique options (excluding default)
  const sizeOption = product.options.find(o => o.name.toLowerCase() === 'size');
  const colorOption = product.options.find(o => o.name.toLowerCase() === 'color');

  const getSelectedOptionValue = (optionName: string) => {
    return currentVariant?.selectedOptions.find(o => o.name.toLowerCase() === optionName.toLowerCase())?.value;
  };

  // Filter images based on selected color (match color in altText)
  const selectedColor = getSelectedOptionValue('color');
  const filteredImages = selectedColor 
    ? allImages.filter(img => {
        const altText = img.node.altText?.toLowerCase() || '';
        return altText.includes(selectedColor.toLowerCase());
      })
    : allImages;
  
  // If no images match the color filter, show all images
  const images = filteredImages.length > 0 ? filteredImages : allImages;

  // Color mapping for visual swatches
  const getColorStyle = (color: string): React.CSSProperties => {
    const colorMap: Record<string, string> = {
      'black': '#000000',
      'white': '#ffffff',
      'navy': '#1a1a2e',
      'grey': '#6b7280',
      'gray': '#6b7280',
      'beige': '#d4c5a9',
      'cream': '#f5f5dc',
      'brown': '#8b4513',
      'red': '#dc2626',
      'blue': '#2563eb',
      'green': '#16a34a',
    };
    const bgColor = colorMap[color.toLowerCase()] || '#e5e5e5';
    return { backgroundColor: bgColor };
  };

  const handleOptionChange = (optionName: string, value: string) => {
    // Get current selected options
    const currentOptions = currentVariant?.selectedOptions || [];
    
    // Build new options map with the changed option
    const newOptions: Record<string, string> = {};
    currentOptions.forEach(opt => {
      newOptions[opt.name.toLowerCase()] = opt.value;
    });
    newOptions[optionName.toLowerCase()] = value;
    
    // Find variant that matches ALL selected options
    const matchingVariant = product.variants.edges.find(v =>
      v.node.selectedOptions.every(opt => 
        newOptions[opt.name.toLowerCase()] === opt.value
      )
    );
    
    if (matchingVariant) {
      setSelectedVariant(matchingVariant.node.id);
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>{product.title} — VOID™</title>
        <meta name="description" content={product.description?.slice(0, 160) || `Shop ${product.title} at VOID™`} />
      </Helmet>

      <div className="page-padding py-12">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </button>
      </div>

      <div className={`page-padding ${isMobile ? 'pb-32' : 'pb-12'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-8 lg:gap-12">
          
          {/* Left Column - Product Info & Accordions */}
          <div className="order-2 lg:order-1 lg:h-[calc(100vh-4rem)] lg:sticky lg:top-16">
            <div className="h-full flex flex-col justify-center">
              <h1 className="text-sm mb-1">{product.title}</h1>
              <p className="text-sm text-muted-foreground mb-8">
                {currentVariant && formatPrice(currentVariant.price.amount)}
              </p>

              <Accordion type="single" collapsible defaultValue="related" className="w-full">
                <AccordionItem value="details" className="border-t border-border">
                  <AccordionTrigger className="text-xs py-4 hover:no-underline">
                    Product Details
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground leading-relaxed pb-4">
                    {product.description || 'No description available.'}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="sizing" className="border-border">
                  <AccordionTrigger className="text-xs py-4 hover:no-underline">
                    Sizing
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground leading-relaxed pb-4">
                    Please refer to our size guide for detailed measurements. If you're between sizes, we recommend sizing up for a more relaxed fit.
                  </AccordionContent>
                </AccordionItem>

                {product.relatedProducts?.references?.edges && product.relatedProducts.references.edges.length > 0 && (
                  <AccordionItem value="related" className="border-border">
                    <AccordionTrigger className="text-xs py-4 hover:no-underline">
                      Shop the Look
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="grid grid-cols-2 gap-3">
                        {product.relatedProducts.references.edges.map((edge: any) => (
                          <Link
                            key={edge.node.id}
                            to={`/product/${edge.node.handle}`}
                            className="group"
                          >
                            <div className="aspect-square bg-secondary mb-2 overflow-hidden">
                              {edge.node.images.edges[0] && (
                                <img
                                  src={edge.node.images.edges[0].node.url}
                                  alt={edge.node.images.edges[0].node.altText || edge.node.title}
                                  className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                                />
                              )}
                            </div>
                            <p className="text-xs uppercase truncate">{edge.node.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatPrice(edge.node.priceRange.minVariantPrice.amount)}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                <AccordionItem value="delivery" className="border-border">
                  <AccordionTrigger className="text-xs py-4 hover:no-underline">
                    Delivery and Returns
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground leading-relaxed pb-4">
                    Free standard shipping on orders over $200. Express shipping available at checkout. Returns accepted within 14 days of delivery.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Center Column - Images */}
          <div className="order-1 lg:order-2 space-y-2">
            {images.length > 0 ? (
              images.map((img, index) => (
                <div 
                  key={index} 
                  className="aspect-square bg-secondary cursor-zoom-in"
                  onClick={() => {
                    setLightboxIndex(index);
                    setLightboxOpen(true);
                  }}
                >
                  <img
                    src={img.node.url}
                    alt={img.node.altText || product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="aspect-square bg-secondary flex items-center justify-center">
                <span className="text-xs text-muted-foreground">No image</span>
              </div>
            )}
          </div>

          {/* Image Lightbox */}
          <ImageLightbox
            images={images}
            currentIndex={lightboxIndex}
            isOpen={lightboxOpen}
            onClose={() => setLightboxOpen(false)}
            onNavigate={setLightboxIndex}
          />

          {/* Right Column - Variant Selection */}
          <div className="order-3 lg:h-[calc(100vh-4rem)] lg:sticky lg:top-16">
            <div className="h-full flex flex-col justify-center space-y-6">
              
              {/* Color Selection */}
              {colorOption && colorOption.values.length > 1 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Color: {getSelectedOptionValue('color')}
                  </p>
                  <div className="flex gap-2">
                    {colorOption.values.map((color) => {
                      const isSelected = getSelectedOptionValue('color') === color;
                      const isWhite = color.toLowerCase() === 'white';
                      return (
                        <button
                          key={color}
                          onClick={() => handleOptionChange('color', color)}
                          className={`w-10 h-10 border-2 transition-colors ${
                            isSelected 
                              ? 'border-foreground ring-2 ring-foreground ring-offset-2 ring-offset-background' 
                              : isWhite 
                                ? 'border-border hover:border-foreground' 
                                : 'border-transparent hover:border-foreground'
                          }`}
                          style={getColorStyle(color)}
                          title={color}
                        >
                          <span className="sr-only">{color}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size Selection - desktop only */}
              {!isMobile && sizeOption && !(sizeOption.values.length === 1 && sizeOption.values[0] === 'Default Title') && (
                <div>
                  <Select
                    value={getSelectedOptionValue('size') || ''}
                    onValueChange={(value) => handleOptionChange('size', value)}
                  >
                    <SelectTrigger className="w-full h-12 text-xs border-border rounded-none">
                      <SelectValue placeholder="Select Size" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border rounded-none">
                      {sizeOption.values.map((size) => {
                        const matchingVariant = product.variants.edges.find(v =>
                          v.node.selectedOptions.some(o => o.name.toLowerCase() === 'size' && o.value === size)
                        );
                        const available = matchingVariant?.node.availableForSale ?? false;
                        
                        return (
                          <SelectItem 
                            key={size} 
                            value={size}
                            disabled={!available}
                            className="text-xs"
                          >
                            {size} {!available && '- Sold Out'}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Add to Cart - desktop only */}
              {!isMobile && (
                <button
                  onClick={handleAddToCart}
                  disabled={!isAvailable || adding}
                  className="w-full h-12 bg-foreground text-background text-xs uppercase hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {adding ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : !isAvailable ? (
                    'Sold Out'
                  ) : (
                    <>
                      Add to Bag — {currentVariant && formatPrice(currentVariant.price.amount)}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile fixed bottom bar */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border page-padding py-3 space-y-3">
          {sizeOption && !(sizeOption.values.length === 1 && sizeOption.values[0] === 'Default Title') && (
            <Select
              value={getSelectedOptionValue('size') || ''}
              onValueChange={(value) => handleOptionChange('size', value)}
            >
              <SelectTrigger className="w-full h-10 text-xs border-border rounded-none">
                <SelectValue placeholder="Select Size" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border rounded-none">
                {sizeOption.values.map((size) => {
                  const matchingVariant = product.variants.edges.find(v =>
                    v.node.selectedOptions.some(o => o.name.toLowerCase() === 'size' && o.value === size)
                  );
                  const available = matchingVariant?.node.availableForSale ?? false;
                  
                  return (
                    <SelectItem 
                      key={size} 
                      value={size}
                      disabled={!available}
                      className="text-xs"
                    >
                      {size} {!available && '- Sold Out'}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          )}
          <button
            onClick={handleAddToCart}
            disabled={!isAvailable || adding}
            className="w-full h-12 bg-foreground text-background text-xs uppercase hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {adding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : !isAvailable ? (
              'Sold Out'
            ) : (
              <>
                Add to Bag — {currentVariant && formatPrice(currentVariant.price.amount)}
              </>
            )}
          </button>
        </div>
      )}
    </Layout>
  );
}
