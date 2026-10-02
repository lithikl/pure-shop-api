import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import CookiePreferences from "@/components/CookiePreferences";

const CookiesPage = () => {
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  return (
    <Layout>
      <Helmet>
        <title>Cookie Policy | VOID™</title>
        <meta name="description" content="Cookie policy for VOID™ store." />
      </Helmet>
      
      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-base font-normal mb-8">Cookie Policy</h1>
          
          <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-foreground mb-3">1. What Are Cookies</h2>
              <p>
                Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.
              </p>
            </section>

            <section>
              <h2 className="text-foreground mb-3">2. Types of Cookies We Use</h2>
              <p className="mb-3">
                We use the following types of cookies:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Essential cookies:</strong> Required for the website to function properly, such as shopping cart and checkout functionality.</li>
                <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with our website to improve our services.</li>
                <li><strong>Preference cookies:</strong> Remember your settings and preferences, such as language and currency.</li>
                <li><strong>Marketing cookies:</strong> Used to deliver relevant advertisements and track campaign effectiveness.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-foreground mb-3">3. Essential Cookies</h2>
              <p>
                These cookies are necessary for the website to function and cannot be disabled. They include cookies that maintain your session, remember items in your cart, and enable secure checkout.
              </p>
            </section>

            <section>
              <h2 className="text-foreground mb-3">4. Analytics Cookies</h2>
              <p>
                We use analytics cookies to collect information about how visitors use our website. This helps us improve our site and your shopping experience. All data collected is anonymous and aggregated.
              </p>
            </section>

            <section>
              <h2 className="text-foreground mb-3">5. Managing Cookies</h2>
              <p className="mb-3">
                You can control and manage cookies through your browser settings or by using our cookie preferences panel. Please note that disabling certain cookies may affect the functionality of our website.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPreferencesOpen(true)}
              >
                Manage Cookie Preferences
              </Button>
            </section>

            <section>
              <h2 className="text-foreground mb-3">6. Third-Party Cookies</h2>
              <p>
                Some cookies are placed by third-party services that appear on our pages. We do not control these cookies and recommend reviewing the privacy policies of these third parties for more information.
              </p>
            </section>

            <section>
              <h2 className="text-foreground mb-3">7. Cookie Retention</h2>
              <p>
                Session cookies are deleted when you close your browser. Persistent cookies remain on your device for a set period or until you delete them. The retention period varies depending on the type and purpose of the cookie.
              </p>
            </section>

            <section>
              <h2 className="text-foreground mb-3">8. Updates to This Policy</h2>
              <p>
                We may update this cookie policy from time to time. Any changes will be posted on this page with an updated effective date.
              </p>
            </section>

            <section>
              <h2 className="text-foreground mb-3">9. Contact</h2>
              <p>
                For any questions about our use of cookies, please contact us at privacy@void.com.
              </p>
            </section>
          </div>
        </div>
        
        <CookiePreferences open={preferencesOpen} onOpenChange={setPreferencesOpen} />
      </main>
    </Layout>
  );
};

export default CookiesPage;
