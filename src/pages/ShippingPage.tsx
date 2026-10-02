import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";

const ShippingPage = () => {
  return (
    <Layout>
      <Helmet>
        <title>Shipping & Returns | VOID™</title>
        <meta name="description" content="Shipping and returns information for VOID™ store." />
      </Helmet>
      
      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-base font-normal mb-8">Shipping & Returns</h1>
          
          <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-foreground mb-3">Shipping</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-foreground mb-2">Processing Time</h3>
                  <p>
                    Orders are processed within 1-2 business days. You will receive a confirmation email with tracking information once your order has shipped.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground mb-2">Domestic Shipping (EU)</h3>
                  <p>
                    Standard shipping: 3-5 business days — €5.00<br />
                    Express shipping: 1-2 business days — €12.00<br />
                    Free standard shipping on orders over €100.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground mb-2">International Shipping</h3>
                  <p>
                    Standard shipping: 7-14 business days — €15.00<br />
                    Express shipping: 3-5 business days — €25.00<br />
                    Please note that international orders may be subject to customs duties and taxes, which are the responsibility of the recipient.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-foreground mb-3">Returns</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-foreground mb-2">Return Policy</h3>
                  <p>
                    We accept returns within 30 days of delivery. Items must be unworn, unwashed, and in their original condition with all tags attached.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground mb-2">How to Return</h3>
                  <p>
                    To initiate a return, please contact us at returns@void.com with your order number. We will provide you with a return shipping label and instructions.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground mb-2">Refunds</h3>
                  <p>
                    Once we receive and inspect your return, we will process your refund within 5-7 business days. Refunds will be issued to the original payment method. Original shipping costs are non-refundable.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground mb-2">Exchanges</h3>
                  <p>
                    We do not offer direct exchanges. If you need a different size or color, please return your item for a refund and place a new order.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-foreground mb-3">Damaged or Defective Items</h2>
              <p>
                If you receive a damaged or defective item, please contact us within 48 hours of delivery at support@void.com. Include photos of the damage and we will arrange a replacement or refund at no additional cost.
              </p>
            </section>

            <section>
              <h2 className="text-foreground mb-3">Contact</h2>
              <p>
                For any shipping or returns questions, please contact us at support@void.com.
              </p>
            </section>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default ShippingPage;
