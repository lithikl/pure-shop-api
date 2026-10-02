import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";

const TermsPage = () => {
  return (
    <Layout>
      <Helmet>
        <title>Terms & Conditions | VOID™</title>
        <meta name="description" content="Terms and conditions for VOID™ store." />
      </Helmet>
      
      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-base font-normal mb-8">Terms & Conditions</h1>
          
          <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-foreground mb-3">1. General</h2>
              <p>
                These terms and conditions govern your use of the VOID™ website and the purchase of products from our store. By accessing this website or placing an order, you agree to be bound by these terms.
              </p>
            </section>

            <section>
              <h2 className="text-foreground mb-3">2. Orders</h2>
              <p>
                All orders are subject to availability and confirmation of the order price. We reserve the right to refuse any order placed with us. When you place an order, you will receive an acknowledgment email confirming receipt of your order.
              </p>
            </section>

            <section>
              <h2 className="text-foreground mb-3">3. Pricing</h2>
              <p>
                All prices are displayed in EUR and include applicable taxes unless otherwise stated. We reserve the right to change prices at any time without prior notice. The price applicable to your order will be the price shown at the time of purchase.
              </p>
            </section>

            <section>
              <h2 className="text-foreground mb-3">4. Payment</h2>
              <p>
                Payment must be made at the time of ordering. We accept major credit cards and other payment methods as displayed at checkout. All transactions are processed securely.
              </p>
            </section>

            <section>
              <h2 className="text-foreground mb-3">5. Intellectual Property</h2>
              <p>
                All content on this website, including text, graphics, logos, images, and software, is the property of VOID™ and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or use any content without our prior written consent.
              </p>
            </section>

            <section>
              <h2 className="text-foreground mb-3">6. Limitation of Liability</h2>
              <p>
                VOID™ shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of our website or products. Our total liability shall not exceed the amount paid by you for the relevant product.
              </p>
            </section>

            <section>
              <h2 className="text-foreground mb-3">7. Governing Law</h2>
              <p>
                These terms shall be governed by and construed in accordance with the laws of the European Union. Any disputes shall be subject to the exclusive jurisdiction of the courts in our registered place of business.
              </p>
            </section>

            <section>
              <h2 className="text-foreground mb-3">8. Contact</h2>
              <p>
                For any questions regarding these terms, please contact us at legal@void.com.
              </p>
            </section>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default TermsPage;
