import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Loader2 } from 'lucide-react';
import Layout from '@/components/Layout';
import { useCartStore } from '@/stores/cartStore';
import { useFormattedPrice } from '@/hooks/useFormattedPrice';

export default function CartPage() {
  const { items, isLoading, updateQuantity, removeItem, checkout, getTotalPrice } = useCartStore();
  const { formatPrice } = useFormattedPrice();

  const totalPrice = getTotalPrice();

  return (
    <Layout>
      <Helmet>
        <title>Cart — VOID™</title>
        <meta name="description" content="Your shopping cart" />
      </Helmet>

      <div className="page-padding py-12">
        <h1 className="text-sm uppercase mb-8">Cart</h1>

        {items.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-xs text-muted-foreground mb-4">Your cart is empty</p>
            <Link
              to="/products"
              className="text-xs uppercase underline underline-offset-4 hover:opacity-60 transition-opacity"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="border-t border-border">
                {items.map((item) => (
                  <div key={item.variantId} className="py-6 border-b border-border flex gap-6">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-secondary flex-shrink-0">
                      {item.product.node.images?.edges?.[0]?.node && (
                        <img
                          src={item.product.node.images.edges[0].node.url}
                          alt={item.product.node.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <Link 
                          to={`/product/${item.product.node.handle}`}
                          className="text-xs uppercase hover:opacity-60 transition-opacity"
                        >
                          {item.product.node.title}
                        </Link>
                        {item.variantTitle !== 'Default Title' && (
                          <p className="text-xs text-muted-foreground mt-1">{item.variantTitle}</p>
                        )}
                        <p className="text-xs mt-2">
                          {formatPrice(item.price.amount)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-border">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="w-10 h-10 flex items-center justify-center hover:bg-secondary transition-colors text-xs"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="w-10 text-center text-xs">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="w-10 h-10 flex items-center justify-center hover:bg-secondary transition-colors text-xs"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="border border-border p-6">
                <h2 className="text-xs uppercase mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(totalPrice.toString())}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 mb-6">
                  <div className="flex items-center justify-between text-xs">
                    <span className="uppercase">Total</span>
                    <span>{formatPrice(totalPrice.toString())}</span>
                  </div>
                </div>

                <button
                  onClick={checkout}
                  disabled={isLoading}
                  className="w-full h-12 bg-foreground text-background text-xs uppercase hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating checkout...
                    </>
                  ) : (
                    'Checkout'
                  )}
                </button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Taxes calculated at checkout
                </p>
              </div>

              <Link
                to="/products"
                className="block text-xs uppercase text-center mt-6 underline underline-offset-4 hover:opacity-60 transition-opacity"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
